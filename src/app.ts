#!/usr/bin/env node
import { parse } from 'ts-command-line-args';
import { OpenApiOperationSplitter } from './open-api-operation-splitter';

async function main() {
    try {
        const args = parse<Arguments>({
            inputFile: String,
            targetFileName: String,
            operations: { type: String, multiple: true },
            help: { type: Boolean, optional: true, alias: 'h', description: 'Prints this usage guide' },
        });

        const openApiOperationSplitter: OpenApiOperationSplitter = new OpenApiOperationSplitter();
        const parsedApi = await openApiOperationSplitter.parse(args.inputFile);
        const paths = openApiOperationSplitter.getPathsObjectByOperation(parsedApi, ...args.operations);
        parsedApi.paths = paths;
        await openApiOperationSplitter.saveApiToYaml(parsedApi, args.targetFileName);

    } catch (error: any) {
        console.log(error);
    }
}

main();