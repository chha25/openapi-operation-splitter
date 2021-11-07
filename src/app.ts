import { parse } from 'ts-command-line-args';
import { OpenApiOperationSplitter } from './open-api-operation-splitter';

try {
    const args = parse<Arguments>({
        inputFile: String,
        targetFileName: String,
        operations: { type: String, multiple: true },
        help: { type: Boolean, optional: true, alias: 'h', description: 'Prints this usage guide' },
    });
    console.log(args);

} catch (error: any) {
    console.log(error);
}

const openApiOperationSplitter: OpenApiOperationSplitter = new OpenApiOperationSplitter();
