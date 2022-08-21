# OpenApi Operation Splitter
[![NodeJS](https://github.com/chha25/openapi-operation-splitter/actions/workflows/main.yml/badge.svg)](https://github.com/chha25/openapi-operation-splitter/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/chha25/openapi-operation-splitter/branch/master/graph/badge.svg?token=MS5QBY5G4X)](https://codecov.io/gh/chha25/openapi-operation-splitter)
![GitHub](https://img.shields.io/github/license/chha25/openapi-operation-splitter)
![npm](https://img.shields.io/npm/v/openapi-operation-splitter)
![GitHub top language](https://img.shields.io/github/languages/top/chha25/openapi-operation-splitter)

Module and library that can use for splitting a given swagger/open-api file (YAML or JSON) by an operation.

## Installation
```bash
npm i openapi-operation-splitter
```

## Cli
```bash
$ node_modules/.bin/openapi-operation-splitter --inputFile=api-filename --targetFile=filename-with-extention --ignore path-to-ignore --operations=passedValue1 passedValue2
```
### Options

| Argument       | Alias | Type     | Description                                  |
|----------------| ----- | -------- |----------------------------------------------|
| **inputFile**  |       | string   | input file (JSON or YAML)                    |
| **targetFile** |       | string   | output file (e.g. target.json or target.yaml |
| **ignore**     |       | string   | optional: path to ignore (e.g. api-internal) |
| **operations** |       | string[] | http operations to extract                   |
| **help**       | **h** | boolean  | optional: Prints this usage guide            |


## Library Usage

```typescript
import { OpenApiOperationSplitter } from 'openapi-operation-splitter';

async function main() {
    const splitter = new OpenApiOperationSplitter();
    const api = await splitter.parse('inputFile.yml');
    const paths = splitter.getPathsObjectByOperation(api, "get");
    api.paths = paths;
    await splitter.saveApiToYaml(api, 'targetFile.yml');
}

main()
```

### BTW

If your output is a JSON file you could beautify it with:

```shell
python -m json.tool target.json > target-beauty.json 
```
