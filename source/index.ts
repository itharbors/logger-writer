'use strict';

import { dirname, isAbsolute } from 'path';
import { createWriteStream, WriteStream } from 'fs';

import { makeDir } from './utils';
import { ObjectQueue } from '@itharbors/structures';

// 日志等级
export enum logType {
    // 调试日志
    debug,
    // 普通日志
    normal,
    // 警告日志
    warn,
    // 错误日志
    error,
}

const printTypeMap = new Map;
printTypeMap.set(logType.debug, 'Debug');
printTypeMap.set(logType.normal, 'Normal');
printTypeMap.set(logType.warn, 'Warn');
printTypeMap.set(logType.error, 'Error');

type LoggerOption = {
    // 日志文件位置
    file: string;
    // 分页功能
    // page?: {
    //     // 当文件大小超出后，将现有文件归档
    //     size?: number;
    // };
};

export class LogWritter {
    private option: LoggerOption;
    private writing = false;
    private writeStream?: WriteStream;

    private async init(option: LoggerOption) {
        const dir = dirname(option.file);
        await makeDir(dir, { mode: 0o777 });

        // 创建 log 文件写入流
        this.writeStream = createWriteStream(option.file, { flags: 'a' });
        this.step();
    }

    constructor(option: LoggerOption) {
        if (!isAbsolute(option.file)) {
            throw new Error('LogWritter 需要传入绝对路径');
        }
        this.option = option;
        this.queue.enqueue(`Log Writter Startup: ${(new Date()).toISOString()}`);

        this.init(option);
    }

    // 等待写入的队列
    private queue = new ObjectQueue<string>();

    /**
     * 执行下一次写入
     */
    private step() {
        // 文件没有打开的时候，不存储
        if (!this.writeStream) {
            return;
        }
        // 正在写入的时候跳过，等待写完后触发
        if (this.writing) {
            return;
        }
        const message = this.queue.dequeue();
        if (!message) {
            return;
        }
        this.writing = true;
        this.writeStream.write(message, () => {
            this.writing = false;
            this.step();
        });
    }

    /**
     * 写入日志
     * @param type
     * @param message
     */
    write(type: logType, message: string) {
        // 增加时间前缀
        this.queue.enqueue(`\n${(new Date()).toISOString()} [${printTypeMap.get(type) || 'Normal'}] ${message}`);
        this.step();
    }
}
