'use strict';

import { dirname, basename, isAbsolute, extname, join } from 'path';
import { createWriteStream, unlinkSync, WriteStream } from 'fs';

import { makeDir, readFiles } from './utils';
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
    // 当一个文件超出函数后，自动分文件
    maxLine?: number;
    // 最多存储多少文件，超出文件数量后，会自动删除最早的文件
    maxFile?: number;
};

/**
 * File: ${name}_${year}${month}${date}_${num}.${ext}
 */
export class LogWritter {
    private option: {
        // 存储文件的文件夹
        dir: string;
        // 写入文件的扩展名
        ext: string;
        // 文件前缀（后缀会自动增加）
        file: string;

        maxLine: number;
        maxFile: number;
    };
    private writing = false;
    private writeStream?: WriteStream;
    private writeLine = 0;

    public file: string = '';

    private async init() {
        await makeDir(this.option.dir, { mode: 0o777 });
        const files = await readFiles(this.option.dir);

        let time = new Date();
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let date = time.getDate();

        let dateStr = `${year}${month}${date}`;
        let num = 0;
        let fileList: string[] = [];

        // 递增日志文件名，每次启动后缀自增 1
        for (const file of files) {
            const splitStr = file.split('-');
            if (
                splitStr[0] !== this.option.file ||
                splitStr[1] !== dateStr
            ) {
                continue;
            }
            fileList.push(file);
            let fileNum = parseInt(splitStr[2]);
            if (num <= fileNum) {
                num = fileNum + 1;
            }
        }

        // 删除超出文件最大数量的日志文件
        while (fileList.length >= this.option.maxFile) {
            const file = join(this.option.dir, fileList.shift()!);

            try {
                unlinkSync(file);
            } catch(error) {
                console.log(error);
            }
        }

        this.file = join(this.option.dir, `${this.option.file}-${dateStr}-${num}${this.option.ext}`);

        // 创建 log 文件写入流
        this.writeStream = createWriteStream(this.file, { flags: 'a' });
        this.writeStream.write(`Log Writter Startup: ${(new Date()).toISOString()}`);
        this.step();
    }

    constructor(option: LoggerOption) {
        if (!isAbsolute(option.file)) {
            throw new Error('LogWriter needs to be passed an absolute path.');
        }

        const ext = extname(option.file);
        this.option = {
            dir: dirname(option.file),
            ext,
            file: basename(option.file, ext).replace(/-/g, '_'),
            maxLine: option.maxLine || 1000000,
            maxFile: option.maxFile || 100,
        };

        if (
            typeof this.option.maxFile !== 'number' ||
            this.option.maxFile <= 0
        ) {
            this.option.maxFile = 100;
        }

        if (
            typeof this.option.maxLine !== 'number' ||
            this.option.maxLine < 2
        ) {
            this.option.maxLine = 1000000;
        }

        this.init();
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
        this.writeLine++;
        this.writeStream.write('\n' + message, () => {
            this.writing = false;

            if (this.writeLine >= this.option.maxLine) {
                this.writeLine = 0;
                this.writeStream = undefined;
                this.init();
            } else {
                this.step();
            }
            
        });

    }

    /**
     * 写入日志
     * @param type
     * @param message
     */
    write(type: logType, message: string) {
        // 增加时间前缀
        this.queue.enqueue(`${(new Date()).toISOString()} [${printTypeMap.get(type) || 'Normal'}] ${message}`);
        this.step();
    }
}
