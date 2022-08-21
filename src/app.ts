#!/usr/bin/env node
import { parse } from 'ts-command-line-args';
import { Arguments } from './arguments';
import { OpenApiOperationSplitter } from './open-api-operation-splitter';

export async function main() {
    try {
        const args = parse<Arguments>({
            inputFile: String,
            targetFile: String,
            operations: { type: String, multiple: true },
            ignore: { type: String, optional: true },
            help: { type: Boolean, optional: true, alias: 'h', description: 'Prints this usage guide' },
        });

        const openApiOperationSplitter: OpenApiOperationSplitter = new OpenApiOperationSplitter();
        const parsedApi = await openApiOperationSplitter.parse(args.inputFile);
        const ignore = args.ignore === undefined ? "" : args.ignore;
        const paths = openApiOperationSplitter.getFilteredPathsObject(parsedApi, ignore, ...args.operations);
        const targetFile = args.targetFile;
        parsedApi.paths = paths;
        if (getFileExtension(targetFile) === 'yaml' || getFileExtension(targetFile) === 'yml') {
            await openApiOperationSplitter.saveApiToYaml(parsedApi, targetFile);
        } else {
            await openApiOperationSplitter.saveApiToJson(parsedApi, targetFile);
        }

    } catch (error: any) {
        console.log(error);
    }
}

function getFileExtension(targetFileName: string) {
    const splitExtension = targetFileName.split('.');
    if (splitExtension.length > 1) {
        return splitExtension[1].toLowerCase();
    }
    return '';
}

main();
