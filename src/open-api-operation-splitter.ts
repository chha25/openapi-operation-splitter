import SwaggerParser from '@apidevtools/swagger-parser';
import { OpenAPI, OpenAPIV2, OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
import YAML from 'yaml';
import * as fs from 'fs';

export class OpenApiOperationSplitter {
    async parse(fileName: string): Promise<OpenAPI.Document> {
        let api: OpenAPI.Document = await SwaggerParser.parse(fileName);
        console.log("API name: %s, Version: %s", api.info.title, api.info.version);
        return api;
    }

    getPathsObjectByOperation(api: OpenAPI.Document, method: string): OpenAPIV2.PathsObject | OpenAPIV3.PathsObject {
        let operations: OpenAPI.Operation[] = [];
        const copyPath: OpenAPIV2.PathsObject | OpenAPIV3.PathsObject = { ...api.paths };
        const typedOperation = this.getHttpMethod(api, method);

        for (let pathName in api.paths) {
            console.log(pathName);
            if (!api.paths) {
                continue;
            }
            const pathObject = api.paths[pathName];
            if (!pathObject) {
                continue;
            }
            const operationByPathObject = pathObject[typedOperation];
            if (!operationByPathObject) {
                delete copyPath[pathName]
                continue;
            }
            for (let operation in pathObject) {
                if (operation !== typedOperation) {
                    delete copyPath[pathName]![operation]
                }
            }
            console.log(operationByPathObject);
            operations.push(operationByPathObject)
        }
        return copyPath;
    }

    async saveApiToYaml(api: OpenAPI.Document, fileName: string) {
        const bundledApi = await SwaggerParser.bundle(api);
        const jsonContent = JSON.stringify(bundledApi);

        const yamlObject = YAML.parse(jsonContent)
        const yamlStr = YAML.stringify(yamlObject);

        fs.writeFile(fileName, yamlStr, () => { });
    }

    private getHttpMethod(api: OpenAPI.Document, operation: string): OpenAPIV2.HttpMethods | OpenAPIV3.HttpMethods {
        operation = operation.toUpperCase();
        const apiVersion = this.getOpenApiVersion(api);
        let result;
        if (apiVersion === '2.0') {
            const typedKey = operation as keyof typeof OpenAPIV2.HttpMethods;
            result = OpenAPIV2.HttpMethods[typedKey];
        } else if (apiVersion === '3.0.0' || apiVersion === '3.0.1') {
            const typedKey = operation as keyof typeof OpenAPIV3.HttpMethods;
            result = OpenAPIV3.HttpMethods[typedKey];
        }
        if (!result) {
            throw new Error('Unsupported open api operation');
        }

        return result;
    }

    private getOpenApiVersion(api: OpenAPI.Document): string {
        if ('openapi' in api) {
            return api.openapi;
        } else if ('swagger' in api) {
            return api.swagger;
        }
        throw new Error('Unsupported Api');
    }
}