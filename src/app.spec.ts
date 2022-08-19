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
});
