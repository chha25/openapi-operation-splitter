import { OpenApiOperationSplitter } from './open-api-operation-splitter';

describe('OpenApiOperationSplitter', () => {

    it('Should be parseable', async () => {
        const openApiOperationSplitter: OpenApiOperationSplitter = new OpenApiOperationSplitter();
        const res = await openApiOperationSplitter.parse('fileName');
    });
});