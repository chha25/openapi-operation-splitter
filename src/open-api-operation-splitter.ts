import SwaggerParser from '@apidevtools/swagger-parser';
import { OpenAPI, OpenAPIV2, OpenAPIV3 } from 'openapi-types';
import YAML from 'yaml';
import fs1 from 'fs';
import fs2 from 'fs';

export class OpenApiOperationSplitter {
    async parse(fileName: string): Promise<OpenAPI.Document> {
        let api: OpenAPI.Document = await SwaggerParser.parse(fileName);
        return api;
    }

    getPathsObjectByOperation(api: OpenAPI.Document, ignore: string, ...methods: string[]): OpenAPIV2.PathsObject | OpenAPIV3.PathsObject {
        const copyPath: OpenAPIV2.PathsObject | OpenAPIV3.PathsObject = { ...api.paths };
        const typedOperations = methods.map(method => this.getHttpMethod(api, method));

        for (let pathName in api.paths) {
            if (pathName.includes(ignore) && ignore !== "") {
                delete copyPath[pathName]
            } else {
                const pathObject = api.paths[pathName];
                for (let operation in pathObject) {
                    if (!typedOperations.includes(this.getHttpMethod(api, operation))) {
                        delete copyPath[pathName]![operation]
                    }
                }

                if (Object.keys(copyPath[pathName]!).length == 0) {
                    delete copyPath[pathName]
                }
            }
        }
        return copyPath;
    }

    async saveApiToYaml(api: OpenAPI.Document, fileName: string) {
        const bundledApi = await SwaggerParser.bundle(api);
        const jsonContent = JSON.stringify(bundledApi);

        const yamlObject = YAML.parse(jsonContent)
        const yamlStr = YAML.stringify(yamlObject);

        fs1.writeFile(fileName, yamlStr, () => { });
    }

    async saveApiToJson(api: OpenAPI.Document, fileName: string) {
        const bundledApi = await SwaggerParser.bundle(api);
        const jsonContent = JSON.stringify(bundledApi);

        fs2.writeFile(fileName, jsonContent, () => { });
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
