# OpenApi Operation Splitter
[![NodeJS](https://github.com/chha25/openapi-operation-splitter/actions/workflows/main.yml/badge.svg)](https://github.com/chha25/openapi-operation-splitter/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/chha25/openapi-operation-splitter/branch/master/graph/badge.svg?token=MS5QBY5G4X)](https://codecov.io/gh/chha25/openapi-operation-splitter)
![GitHub](https://img.shields.io/github/license/chha25/openapi-operation-splitter)
![npm](https://img.shields.io/npm/v/openapi-operation-splitter)
![GitHub top language](https://img.shields.io/github/languages/top/chha25/openapi-operation-splitter)

Module and library that can use for splitting a given swagger/open-api file by an operation. 

## Installation
```bash
npm i openapi-operation-splitter
```

## Cli
```bash
$ node_modules/.bin/openapi-operation-splitter --inputFile=passedValue --targetFileName=passedValue --operations=passedValue1 passedValue2
```
### Options

| Argument           | Alias | Type     | Description                             |
| ------------------ | ----- | -------- | --------------------------------------- |
| **inputFile**      |       | string   | Input file                              |
| **targetFileName** |       | string   | output file name                        |
| **operations**     |       | string[] | http operations that would be extracted |
| **help**           | **h** | boolean  | Prints this usage guide                 |
  

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
```