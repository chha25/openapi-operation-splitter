import { ArgsParseOptions, CommandLineResults, parse, ParseOptions, UnknownProperties } from 'ts-command-line-args'
import { main } from './app';
import { Arguments } from './arguments';

jest.mock('ts-command-line-args');
const mockedParse = <jest.Mock<typeof parse>>parse;

describe('app', () => {

    it('should be truthy', async () => {
        const a = <Arguments>{
            inputFile: 'input/swagger.yaml',
            operations: ['get'],
            targetFile: 'output/app_test.yaml',
        };
        mockedParse.mockReturnValue(a as any);

        await main();
    });

    it('should throw error due to missing input file', async () => {
        const a = <Arguments>{
            operations: ['get'],
            targetFile: 'asdfl',
        };
        mockedParse.mockReturnValue(a as any);

        await main();
    });

    it('should process input yml', async () => {
        const a = <Arguments>{
            inputFile: 'input/swagger.yml',
            operations: ['get'],
            targetFile: 'output/app_test.yml',
        };
        mockedParse.mockReturnValue(a as any);

        await main();
    });

    it('should also support json as target file', async () => {
        const a = <Arguments>{
            inputFile: 'input/swagger.yml',
            operations: ['get'],
            targetFile: 'output/app_test.json',
        };
        mockedParse.mockReturnValue(a as any);

        await main();
    });

    
    it('produce as default output json if no given file extension', async () => {
        const a = <Arguments>{
            inputFile: 'input/swagger.yml',
            operations: ['get'],
            targetFile: 'output/app_test',
        };
        mockedParse.mockReturnValue(a as any);

        await main();
    });
});
