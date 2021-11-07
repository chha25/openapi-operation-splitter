import { OpenApiOperationSplitter } from './open-api-operation-splitter';

describe('OpenApiOperationSplitter', () => {

    it('Should be true', () => {
        const openApiOperationSplitter: OpenApiOperationSplitter = new OpenApiOperationSplitter();
        openApiOperationSplitter.parse('fileName');
    });
});