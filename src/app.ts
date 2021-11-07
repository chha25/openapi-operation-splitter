import {parse} from 'ts-command-line-args';

export const args = parse<ICopyFilesArguments>({
    sourcePath: String,
    targetPath: String,
    copyFiles: { type: Boolean, alias: 'c' },
    resetPermissions: Boolean,
    filter: { type: String, optional: true },
    excludePaths: { type: String, multiple: true, optional: true },
    help: { type: Boolean, optional: true, alias: 'h', description: 'Prints this usage guide' },
    
});

const msg = 'Hello World';
console.log(msg);