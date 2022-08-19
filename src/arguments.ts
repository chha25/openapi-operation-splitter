import { ArgumentConfig, ParseOptions, UsageGuideConfig } from "ts-command-line-args";

export interface Arguments {
    inputFile: string,
    targetFile: string,
    operations: string[],
    ignore?: string,
    help?: boolean
}

const argumentConfig: ArgumentConfig<Arguments> = {
    inputFile: String,
    targetFile: String,
    operations: { type: String, multiple: true },
    ignore: { type: String, optional: true },
    help: { type: Boolean, optional: true, alias: 'h', description: 'Prints this usage guide' },
};

const parseOptions: ParseOptions<Arguments> = {
        helpArg: 'help',
        headerContentSections: [{ header: 'OpenApi Operation Splitter', content: 'App that can use for splitting a given swagger/open-api file by an operation.' }],
    }

export const usageGuideInfo: UsageGuideConfig<Arguments> = {
    arguments: argumentConfig,
    parseOptions,
};
