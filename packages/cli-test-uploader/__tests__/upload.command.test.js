const { Command } = require('commander');
const path = require('path');
const { FileUtil, HttpUtil } = require('@thundra/foresight-cli-utils');
const { createTestUploadCommand } = require('../dist/commands/upload');

describe('Cli Execution Tests', () => {

    const tmpPath = path.join(__dirname, './helper/tmp')
    const baseArgs = [
        process.argv[0],
        process.argv[1],
    ];

    const missingArgs = [
        ...baseArgs,
        'upload-test',
        '--projectId=projectId',
        '--framework=JEST',
        `--uploadDir=${tmpPath}`,
    ];

    const requiredArgs = [
        ...missingArgs,
        '--apiKey=apiKey',
    ];

    beforeEach(() => {
        HttpUtil.request = jest.fn(({ url })=> {
            if (url.includes('signedUrl')){
                return JSON.stringify({
                    url: 'http://mock.abc.me'
                })
            } else {
                return JSON.stringify({});
            }
        });
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    test('Verify Success Execution', async () => {
        const consoleLogMock = jest.spyOn(console, 'log').mockImplementation((value) => {
            const result = JSON.parse(value);
            expect(result).toBeTruthy();
            expect(result.status).toBe('Ok');
        });

        const program = new Command();
        program
            .addCommand(createTestUploadCommand()
            .exitOverride());

        const save = JSON.parse(JSON.stringify(process.argv));
        process.argv = requiredArgs;
        await program.parseAsync(process.argv)
      
        process.argv = save;

        consoleLogMock.mockRestore();
    });

    test('Verify Success Upload File Creation', async () => {
        const orginalRemoveFolder = FileUtil.removeFolder;
        FileUtil.removeFolder = jest.fn((async tmpDir => {
            const files = await FileUtil.readDir(tmpDir);
            expect(files.length).toBe(1);
            const file = await FileUtil.getFile(path.join(tmpDir, files[0]));
            expect(file).toBeTruthy();

            await orginalRemoveFolder(tmpDir)           
        }));

        const program = new Command();
        program
            .addCommand(createTestUploadCommand()
            .exitOverride());

        const save = JSON.parse(JSON.stringify(process.argv));
        process.argv = requiredArgs;
        await program.parseAsync(process.argv)
      
        process.argv = save;
    });

    test('Verify to Handle Missing Argument', (done) => {
        const program = new Command();
        program
            .addCommand(createTestUploadCommand()
            .exitOverride());

        const save = JSON.parse(JSON.stringify(process.argv));
        process.argv = missingArgs;

        (async() => {
            await program.parseAsync(process.argv);
            done();
        })().catch((err) => {
            try {
                expect(err.code).toBe('commander.missingMandatoryOptionValue');
                expect(err.message).toContain('--apiKey')
                done();
            } catch (error) {
                done(error);
            }
        }).finally(() => {
            process.argv = save;
        })
    });

    test('Verify to Handle not Exist Upload Dir', (done) => {
        FileUtil.isExist = jest.fn(() => false); 
        const program = new Command();
        program
            .addCommand(createTestUploadCommand()
            .exitOverride());

        const save = JSON.parse(JSON.stringify(process.argv));
        process.argv = requiredArgs;

        (async() => {
            await program.parseAsync(process.argv);
            done();
        })().catch((err) => {
            try {
                expect(err.message).toContain('is not valid directory')
                done();
            } catch (error) {
                done(error);
            }
        }).finally(() => {
            process.argv = save;
        })
    });
});