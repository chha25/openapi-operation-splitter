import { OpenApiOperationSplitter } from './open-api-operation-splitter';
import { OpenAPI } from 'openapi-types';
import SwaggerParser from '@apidevtools/swagger-parser';

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

    it('shoud get paths object by operation GET (v3)', () => {
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

        const actualPaths = openApiOperationSplitter.getPathsObjectByOperation(api, "GET");

        expect(actualPaths).toBeTruthy();
        const pathNames = Object.keys(actualPaths);
        expect(pathNames.length).toBe(1);
        expect(pathNames[0]).toBe('/users');
    });

    it('shoud get paths object by operation (v3) with other operations', async () => {
        const openApiOperationSplitter: OpenApiOperationSplitter = new OpenApiOperationSplitter();
        const api: OpenAPI.Document = await SwaggerParser.parse('input/swagger_v3.yaml');

        const actualPaths = openApiOperationSplitter.getPathsObjectByOperation(api, "GET");

        expect(actualPaths).toBeTruthy();
        const pathNames = Object.keys(actualPaths);
        expect(pathNames.length).toBe(8);
    });

    it('should be bundle the api', async () => {
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

        await openApiOperationSplitter.saveApiToYaml(api, './output/testAbc.yaml');
    });
});