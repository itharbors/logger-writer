# Logger Writer

一个日志写入工具，主要负责日志文件写入这项单一的功能。

[![NPM](https://img.shields.io/npm/v/@itharbors/log-writer)](https://www.npmjs.com/package/@itharbors/log-writer)
[![CI Status](https://github.com/itharbors/logger-writer/actions/workflows/ci.yaml/badge.svg)](https://github.com/itharbors/logger-writer/actions/workflows/ci.yaml)

## 功能

- 增加日志前缀
- 日志文件拆分
- 写入文件时的系统优化

## 

```ts
import { join } from 'path';
import { LogWritter, logType } from '@itharbors/log-writer';

// 生成一个写入对象
const logger = new LogWritter({
    file: join(__dirname, './test.log'),
    maxLine: 
});

// 当前的日志文件
logger.file;

// 写入日志文件
logger.write(logType.debug, 'test-1');
```