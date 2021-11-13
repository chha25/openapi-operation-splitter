import { OpenApiOperationSplitter } from './open-api-operation-splitter';
import { OpenAPI } from 'openapi-types';
import exp from 'constants';

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

    it('shoud get operations (v3)', () => {
        const openApiOperationSplitter: OpenApiOperationSplitter = new OpenApiOperationSplitter();
        const api: OpenAPI.Document = {
            "openapi": "3.0.0",
            "info": { "title": "Sample API", "description": "Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.", "version": "0.1.9" },
            "servers": [{ "url": "http://api.example.com/v1", "description": "Optional server description, e.g. Main (production) server" }, { "url": "http://staging-api.example.com", "description": "Optional server description, e.g. Internal staging server for testing" }],
            "paths": {
                "/users": {
                    "get": {
                        "summary": "Returns a list of users.", "description": "Optional extended description in CommonMark or HTML.", "responses": {
                            "200": {
                                "description": "A JSON array of user names", "content": {
                                    "application/json": {
                                        "schema": { "type": "array", "items": { "type": "string" } }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };

        const actualOperations = openApiOperationSplitter.getPathItemsByOperation(api, "GET");

        expect(actualOperations.length).toBe(1);
    });
});