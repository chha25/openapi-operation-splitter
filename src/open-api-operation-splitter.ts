import SwaggerParser from "@apidevtools/swagger-parser";

export class OpenApiOperationSplitter {
    async parse(fileName: string) {
        let api = await SwaggerParser.parse(fileName);
        console.log("API name: %s, Version: %s", api.info.title, api.info.version);
    }

}