import SwaggerParser from '@apidevtools/swagger-parser';
import { OpenAPI } from "openapi-types";

export class OpenApiOperationSplitter {
    async parse(fileName: string) {
        let api: OpenAPI.Document = await SwaggerParser.parse(fileName);
        console.log("API name: %s, Version: %s", api.info.title, api.info.version);
        return api;
    }
}