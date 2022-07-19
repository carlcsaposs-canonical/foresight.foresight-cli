const http = require('http');
const path = require('path');
const fs = require('fs');
const portfinder = require('portfinder');
const chai = require('chai');
const yauzl = require("yauzl");

const { Command } = require('commander');
const { StreamUtil, HttpUtil, FileUtil } = require('@thundra/foresight-cli-utils');
const { createTestUploadCommand } = require('../../dist/commands/upload');
const { UPLOADER_METADATA_FILENAME } = require('../../dist/constants');

const { MetadataSchema } = require('../config/data/schema');

describe('Cli Test Upload Integration Tests', function () {

    let server;
    let port;
    
    const testSubscribers = [];
    const outputPath = path.join(__dirname, '../config/tmp/output');
    const outputFilePath = path.join(outputPath, 'test.zip');
    const tmpPath = path.join(__dirname, '../config/tmp')

    const baseArgs = [
        process.argv[0],
        process.argv[1],
    ];

    const missingArgs = [
        ...baseArgs,
        'upload-test',
        '--projectId=projectId',
        '--framework=JEST',
        '--format=JUNIT',
        `--uploadDir=${tmpPath}`,
    ];

    const requiredArgs = [
        ...missingArgs,
        '--apiKey=apiKey',
        '--signerUrl=http://abc.me/signedUrl'
    ];
    
    before(async () => {
        if (fs.existsSync(outputPath)){
            fs.rmdirSync(outputPath, { recursive: true });
        }

        fs.mkdirSync(outputPath);

        port = await portfinder.getPortPromise();
        server = http.createServer(async (req, res) => {
            for (const testSubscriber of testSubscribers) {
                await testSubscriber(req, res);
            }

            res.end();
        });

        server.listen(port);

        const orginalHttpRequest = HttpUtil.request;
        HttpUtil.request = async function ({ url }) {
            if (url.includes('signedUrl')){
                return JSON.stringify({
                    url: `http://localhost:${port}`
                })
            } else {
                return orginalHttpRequest.apply(this, arguments);
            }
        };
    })

    after(() => {
        fs.rmdirSync(outputPath, { recursive: true });
        if (server) {
            server.close();
        }
    })

    it('Verify Test Upload Archive & Uploaded Metadata', async () => {
        const testSubscriber = async (req, res) => {
            await StreamUtil.pipeStream(req, fs.createWriteStream(outputFilePath));

            const getArchiveContent = () => {
                return new Promise((resolve, reject) => {
                    const archiveContent = {}
                    yauzl.open(outputFilePath, {lazyEntries: true}, function(err, archivefile) {
                        if (err) throw err;
                        archivefile.readEntry();
                        archivefile.on("entry", function(entry) {
                            archiveContent[entry.fileName] = '';                     
                            const chunks = [];
                            archivefile.openReadStream(entry, function(err, readStream) {
                                if (err) {
                                    reject(err)
                                };

                                readStream.on("data", function (chunk) {
                                    chunks.push(chunk);
                                });

                                readStream.on("end", function() {
                                    archiveContent[entry.fileName] = Buffer.concat(chunks).toString()
                                    archivefile.readEntry();
                                });
                            });
                        });

                        archivefile.on('end', () => {
                            resolve(archiveContent);
                        })
                    });
                });
            }

            const archiveContent = await getArchiveContent();

            chai.expect(archiveContent).to.have.property(UPLOADER_METADATA_FILENAME);
            chai.expect(archiveContent).to.have.property('packages/cli-test-uploader/test/config/tmp/result.xml');

            const metadata = JSON.parse(archiveContent[UPLOADER_METADATA_FILENAME]);
            const result = MetadataSchema.validate(metadata);
            
            chai.expect(result.error).to.be.undefined;
        }

        testSubscribers.push(testSubscriber);

        const program = new Command();
        program
            .addCommand(createTestUploadCommand()
            .exitOverride());

        const save = JSON.parse(JSON.stringify(process.argv));
        process.argv = requiredArgs;
        await program.parseAsync(process.argv)
      
        process.argv = save;
    })
});