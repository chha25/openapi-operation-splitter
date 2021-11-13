import { OpenApiOperationSplitter } from './open-api-operation-splitter';

describe('OpenApiOperationSplitter', () => {
    it('should be parsable', async () => {
        const openApiOperationSplitter: OpenApiOperationSplitter = new OpenApiOperationSplitter();
        const document = await openApiOperationSplitter.parse('input/swagger.yaml');

        expect(document).toBeTruthy();
        expect(document.info.title).toBe('Swagger Petstore');
    });

    it('should be throw exception if file do not exist', async () => {
        const openApiOperationSplitter: OpenApiOperationSplitter = new OpenApiOperationSplitter();
        await expect(openApiOperationSplitter.parse('')).rejects
        .toThrow('Expected a file path, URL, or object. Got undefine');
    });

    it('should be throw excption by invalid yaml', async () => {
        const openApiOperationSplitter: OpenApiOperationSplitter = new OpenApiOperationSplitter();
        await expect(openApiOperationSplitter.parse('input/invalid_swagger.yaml')).rejects
        .toThrow('is not a valid Swagger API definition');
    });
});