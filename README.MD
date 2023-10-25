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
    // 存储文件，实际文件会加上后缀
    file: join(__dirname, './test.log'),
    // 每个文件存储的日志条数，这里的 line 不是文本里的实际行数
    maxLine: 200000,
    // 最多同时存在多少个日志文件，超出个数的文件会被自动删除
    maxFile: 100,
});

// 当前的日志文件
logger.file;

// 写入日志文件
logger.write(logType.debug, 'test-1');
```