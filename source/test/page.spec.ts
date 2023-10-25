'use strict';

import { equal } from 'assert';
import { join } from 'path';
import { unlinkSync, readdirSync } from 'fs';

import { LogWritter, logType } from '../index';

describe(`分页测试`, function () {

    describe('基础功能', () => {
        it('2 行后分文件', async () => {
            const file = join(__dirname, './test_split.log');
            const logger = new LogWritter({
                file,
                maxLine: 2,
            });
            logger.write(logType.debug, 'test1');
            logger.write(logType.debug, 'test2');

            await new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });

            const names = readdirSync(__dirname);
            const logs = names.filter((name) => {
                return name.startsWith('test_split');
            });
            equal(logs.length, 2);
            logs.forEach((name) => {
                unlinkSync(join(__dirname, name));
            });
        });
        it('文件超出数量后删除', async () => {
            const file = join(__dirname, './test_split.log');
            const logger = new LogWritter({
                file,
                maxLine: 2,
                maxFile: 2,
            });
            logger.write(logType.debug, 'test1');
            logger.write(logType.debug, 'test2');
            logger.write(logType.debug, 'test3');
            logger.write(logType.debug, 'test4');

            await new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });

            const names = readdirSync(__dirname);
            const logs = names.filter((name) => {
                return name.startsWith('test_split');
            });
            equal(logs.length, 2);
            logs.forEach((name) => {
                unlinkSync(join(__dirname, name));
            });
        });
    });
});
