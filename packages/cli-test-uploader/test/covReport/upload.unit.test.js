const path = require('path');
const chai = require('chai');

const { Command } = require('commander');

const { 
    HttpUtil,
    FileUtil
} = require('@thundra/foresight-cli-utils');
const { createCoverageUploadCommand } = require('../../dist/commands/upload');

describe('Cli Test Upload Unit Tests', function () {

    const tmpPath = path.join(__dirname, '../config/tmp');

    const baseArgs = [
        process.argv[0],
        process.argv[1],
    ];
    
    const missingArgs = [
        ...baseArgs,
        'upload-test-coverage',
        '--projectId=projectId',
        '--format=JACOCO/XML',
        `--uploadDir=${tmpPath}`,
    ];
    
    const requiredArgs = [
        ...missingArgs,
        '--apiKey=apiKey',
        '--signerUrl=http://abc.me/signedUrl'
    ];

    before(() => {
        HttpUtil.request = async ({ url })=> {
            if (url.includes('signedUrl')){
                return JSON.stringify({
                    url: 'http://mock.abc.me'
                })
            } else {
                return JSON.stringify({});
            }
        };
    })

    it('Verify Success Execution', async function () {
        const orginalLog = console.log;
        console.log = (value) => {
            const result = JSON.parse(value);
            chai.expect(result.status).to.be.a('string').that.equals('Ok');
        };

        const program = new Command();
        program
            .addCommand(createCoverageUploadCommand()
            .exitOverride());

        const save = JSON.parse(JSON.stringify(process.argv));
        process.argv = requiredArgs;
        await program.parseAsync(process.argv)
      
        process.argv = save;
        console.log = orginalLog;
    });

    it('Verify Success Upload File Creation', async () => {
        const orginalRemoveFolder = FileUtil.removeFolder;
        FileUtil.removeFolder = async tmpDir => {
            const files = await FileUtil.readDir(tmpDir);
            chai.expect(files.length).equals(1);
            const file = await FileUtil.getFile(path.join(tmpDir, files[0]));
            chai.expect(file).to.be.not.undefined;

            await orginalRemoveFolder(tmpDir)           
        };

        const program = new Command();
        program
            .addCommand(createCoverageUploadCommand()
            .exitOverride());

        const save = JSON.parse(JSON.stringify(process.argv));
        process.argv = requiredArgs;
        await program.parseAsync(process.argv)
      
        process.argv = save;
    });

    it('Verify to Handle Missing Argument', (done) => {
        const program = new Command();
        program
            .addCommand(createCoverageUploadCommand()
            .exitOverride());

        const save = JSON.parse(JSON.stringify(process.argv));
        process.argv = missingArgs;

        (async() => {
            await program.parseAsync(process.argv);
            done();
        })().catch((err) => {
            try {
                chai.expect(err.code).to.be.a('string').that.equals('commander.missingMandatoryOptionValue');
                chai.expect(err.message).to.be.a('string').that.contains('--apiKey');
                done();
            } catch (error) {
                done(error);
            }
        }).finally(() => {
            process.argv = save;
        })
    });

    it('Verify to Handle not Exist Upload Dir', (done) => {
        FileUtil.isExist = () => false; 
        const program = new Command();
        program
            .addCommand(createCoverageUploadCommand()
            .exitOverride());

        const save = JSON.parse(JSON.stringify(process.argv));
        process.argv = requiredArgs;

        (async() => {
            await program.parseAsync(process.argv);
            done();
        })().catch((err) => {
            try {
                chai.expect(err.message).to.be.a('string').that.contains('is not valid directory');
                done();
            } catch (error) {
                done(error);
            }
        }).finally(() => {
            process.argv = save;
        })
    });
});