import SwaggerParser from '@apidevtools/swagger-parser';
import { OpenAPI, OpenAPIV2, OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';

export class OpenApiOperationSplitter {
    async parse(fileName: string): Promise<OpenAPI.Document> {
        let api: OpenAPI.Document = await SwaggerParser.parse(fileName);
        console.log("API name: %s, Version: %s", api.info.title, api.info.version);
        return api;
    }

    getPathItemsByOperation(api: OpenAPI.Document, method: string): OpenAPI.Operation[] {
        let operations: OpenAPI.Operation[] = [];
        for (let pathName in api.paths) {
            console.log(pathName);
            const typedOperation = this.getHttpMethod(api, method);
            if (api.paths === undefined || typedOperation === undefined) {
                continue;
            }
            const pathObject = api.paths[pathName];
            if (pathObject === undefined) {
                continue;
            }
            const operationByPathObject = pathObject[typedOperation];
            if (operationByPathObject === undefined) {
                continue;
            }
            console.log(operationByPathObject);
            operations.push(operationByPathObject)
        }
        return operations;
    }

    private getHttpMethod(api: OpenAPI.Document, operation: string) {
        const apiVersion = this.getOpenApiVersion(api);
        if (apiVersion === '3.0.0') {
            const typedKey = operation as keyof typeof OpenAPIV2.HttpMethods;
            return OpenAPIV2.HttpMethods[typedKey];
        }
    }

    private getOpenApiVersion(api: OpenAPI.Document): string {
        if ('openapi' in api) {
            return api.openapi;
        } else if ('swagger') {
            return api.swagger;
        }
        throw new Error('Unsupported Api');
    }
}