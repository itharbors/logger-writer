'use strict';

import { equal, ok } from 'assert';
import { join } from 'path';
import { existsSync, unlinkSync, readFileSync } from 'fs';

import { LogWritter, logType } from '../index';

describe(`LogWritter`, function () {

    describe('相对路径', () => {
        it('不允许传入相对路径', () => {
            try {
                new LogWritter({
                    file: './test.log',
                });
                ok(false);
            } catch (error) {
                ok(true);
            }
        });
    });

    describe('绝对路径', () => {
        it('文件传入绝对路径', async () => {
            try {
                const logger = new LogWritter({
                    file: join(__dirname, './test.1.log'),
                });
                await new Promise((resolve) => {
                    setTimeout(resolve, 100);
                });
                ok(true);
                if (existsSync(logger.file)) {
                    unlinkSync(logger.file);
                }
            } catch (error) {
                ok(false);
            }
        });
    });

    describe('输出日志文件', () => {

        it('写入一行日志，并检查', async () => {
            const file = join(__dirname, './test.2.log');
            const printStr = 'test';

            const logger = new LogWritter({
                file,
            });
            logger.write(logType.debug, printStr);

            await new Promise((resolve) => {
                setTimeout(resolve, 100);
            });

            const str = readFileSync(logger.file, 'utf8');
            ok(str.includes(printStr));
            ok(str.includes(`[Debug]`));
            if (existsSync(logger.file)) {
                unlinkSync(logger.file);
            }
        });

        it('写入多行日志，并检查', async () => {
            const file = join(__dirname, './test.3.log');
            const printStr1 = 'test1';
            const printStr2 = 'test2';
            const printStr3 = 'test3';
            const printStr4 = 'test3';

            const logger = new LogWritter({
                file,
            });
            logger.write(logType.debug, printStr1);
            logger.write(logType.normal, printStr2);
            logger.write(logType.warn, printStr3);
            logger.write(logType.error, printStr4);

            await new Promise((resolve) => {
                setTimeout(resolve, 100);
            });

            const str = readFileSync(logger.file, 'utf8');
            ok(
                str.includes(printStr1) &&
                str.includes(printStr2) &&
                str.includes(printStr3) &&
                str.includes(printStr4)
            );
            ok(
                str.includes(`[Debug]`) &&
                str.includes(`[Normal]`) &&
                str.includes(`[Warn]`) &&
                str.includes(`[Error]`)
            );
            if (existsSync(logger.file)) {
                unlinkSync(logger.file);
            }
        });
    });
});
