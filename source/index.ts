'use strict';

import { dirname } from 'path';
import { appendFile, closeSync } from 'fs';

import { makeDir, openFile } from './utils';
import { Queue } from './queue';

// 日志等级
enum logType {
    // 调试日志
    debug,
    // 普通日志
    normal,
    // 警告日志
    warn,
    // 错误日志
    error,
};

type LoggerOption = {
    // 日志文件位置
    file: string;
    // 分页功能
    page: {
        // 当文件大小超出后，将现有文件归档
        size: number;
    };
}

export class Logger {

    option: LoggerOption;
    fileFD: number = -1;
    writing: boolean = false;

    private async init(option: LoggerOption) {
        const dir = dirname(option.file);
        await makeDir(dir, { mode: 0o777 });
        this.fileFD = await openFile(option.file);
        this.step();
    }

    constructor(option: LoggerOption) {
        this.option = option;
        this.init(option);
    }

    // 等待写入的队列
    private queue = new Queue<string>();

    /**
     * 执行下一次写入
     */
    private step() {
        // 文件没有打开的时候，不存储
        if (this.fileFD === -1) {
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
        appendFile(this.fileFD, message, {}, () => {
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
        this.queue.enqueue(`${new Date} ${message}`);
        this.step();
    }

    /**
     * 销毁日志对象
     * 当不再使用日志对象的时候必须执行
     * 用于释放一些系统资源
     */
    destory() {
        closeSync(this.fileFD);
    }
}
