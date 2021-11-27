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

    it('shoud get paths object by multiple operations GET, POST (v3)', () => {
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

        const actualPaths = openApiOperationSplitter.getPathsObjectByOperation(api, "GET", "POST");

        expect(actualPaths).toBeTruthy();
        const pathNames = Object.keys(actualPaths);
        expect(pathNames.length).toBe(1);
        expect(pathNames[0]).toBe('/users');
    });

    it('shoud get paths zero paths due to know paths are given', () => {
        const openApiOperationSplitter: OpenApiOperationSplitter = new OpenApiOperationSplitter();
        const api: any = {
            "openapi": "3.0.0",
            "info": { "title": "Sample API", "description": "Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.", "version": "0.1.9" },
            "servers": [{ "url": "http://api.example.com/v1", "description": "Optional server description, e.g. Main (production) server" }, { "url": "http://staging-api.example.com", "description": "Optional server description, e.g. Internal staging server for testing" }],
        };

        const actualPaths = openApiOperationSplitter.getPathsObjectByOperation(api as OpenAPI.Document, "GET", "POST");

        expect(actualPaths).toBeTruthy();
        const pathNames = Object.keys(actualPaths);
        expect(pathNames.length).toBe(0);
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

    it('shoud get paths object by operation GET (v2)', async () => {
        const openApiOperationSplitter: OpenApiOperationSplitter = new OpenApiOperationSplitter();
        const api: OpenAPI.Document = await openApiOperationSplitter.parse('input/swagger.yaml');
        const actualPaths = openApiOperationSplitter.getPathsObjectByOperation(api, "GET");

        expect(actualPaths).toBeTruthy();
        const pathNames = Object.keys(actualPaths);
        expect(pathNames.length).toBe(8);
        expect(pathNames[0]).toBe('/pet/findByStatus');
    });

    it('shoud get paths object by multiple operations GET/POST (v2)', async () => {
        const openApiOperationSplitter: OpenApiOperationSplitter = new OpenApiOperationSplitter();
        const api: OpenAPI.Document = await openApiOperationSplitter.parse('input/swagger.yaml');
        const actualPaths = openApiOperationSplitter.getPathsObjectByOperation(api, "GET", "POST");

        expect(actualPaths).toBeTruthy();
        const pathNames = Object.keys(actualPaths);
        expect(pathNames.length).toBe(14);
        expect(pathNames[0]).toBe('/pet');
    });


    it('shoud get paths object by operation (v3) with other operations', async () => {
        const openApiOperationSplitter: OpenApiOperationSplitter = new OpenApiOperationSplitter();
        const api: OpenAPI.Document = await SwaggerParser.parse('input/swagger_v3.yaml');

        const actualPaths = openApiOperationSplitter.getPathsObjectByOperation(api, "GET");

        expect(actualPaths).toBeTruthy();
        const pathNames = Object.keys(actualPaths);
        expect(pathNames.length).toBe(8);
    });

    it('shoud throw error due to unsupported open api version', () => {
        const openApiOperationSplitter: OpenApiOperationSplitter = new OpenApiOperationSplitter();
        const api: any = {
            "blub": "5.0.0",
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
        expect(() => openApiOperationSplitter.getPathsObjectByOperation(api, "get")).toThrow('Unsupported Api');
    });

    it('should be throw error due to failed operation', () => {
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
        expect(() => openApiOperationSplitter.getPathsObjectByOperation(api, "GE")).toThrow('Unsupported open api operation');
    });

    it('should be have no paths due to no paths present in api', () => {
        const openApiOperationSplitter: OpenApiOperationSplitter = new OpenApiOperationSplitter();
        const api: OpenAPI.Document = {
            "openapi": "3.0.0",
            "info": { "title": "Sample API", "description": "Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.", "version": "0.1.9" },
            "servers": [{ "url": "http://api.example.com/v1", "description": "Optional server description, e.g. Main (production) server" }, { "url": "http://staging-api.example.com", "description": "Optional server description, e.g. Internal staging server for testing" }],
            "paths": {
            }
        };

        const actualPaths = openApiOperationSplitter.getPathsObjectByOperation(api, "get");

        expect(actualPaths).toBeTruthy();
        const pathNames = Object.keys(actualPaths);
        expect(pathNames.length).toBe(0);
    });

    it('should save api to file', async () => {
        const openApiOperationSplitter: OpenApiOperationSplitter = new OpenApiOperationSplitter();
        const api: OpenAPI.Document = {
            "openapi": "3.0.0",
            "info": { "title": "Sample API", "description": "Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.", "version": "0.1.9" },
            "servers": [{ "url": "http://api.example.com/v1", "description": "Optional server description, e.g. Main (production) server" }, { "url": "http://staging-api.example.com", "description": "Optional server description, e.g. Internal staging server for testing" }],
            "paths": {
            }
        };
        await openApiOperationSplitter.saveApiToYaml(api, 'output/test.yml');


    });
});