'use strict';

import { parse } from 'path';
import { mkdir, Mode, open, close, openSync, closeSync, readdir } from 'fs';

/**
 * 检查文件路径是否合法
 * 不合法直接 throw 错误
 * @param path
 */
export function checkPath(path: string) {
    if (process.platform === 'win32') {
        const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(
            path.replace(parse(path).root, '')
        );
        if (pathHasInvalidWinCharacters) {
            // error.code = 'EINVAL';
            throw new Error(`Path contains invalid characters: ${path}`);
        }
    }
}

/**
 * 获取文件权限，默认 777
 * @param options
 * @returns
 */
export function getMode(options: { mode: number } | number): Mode {
    if (typeof options === 'number') {
        return options;
    }
    if ('mode' in options) {
        return options.mode;
    }
    return 0o777;
}

/**
 * 创建文件夹，确保文件夹一定存在
 * @param dir
 * @param options
 * @returns
 */
export async function makeDir(
    dir: string,
    options: { mode: number } | number
): Promise<string | undefined> {
    checkPath(dir);
    return new Promise((resolve, reject) => {
        mkdir(
            dir,
            {
                mode: getMode(options),
                recursive: true,
            },
            function (error, path) {
                if (error) {
                    return reject;
                }
                resolve(path);
            }
        );
    });
}

/**
 * 读取一个文件夹内所有的文件
 * @param dir 
 * @returns 
 */
export async function readFiles(dir: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        readdir(dir, function (error, files) {
            if (error) {
                return reject(error);
            }
            resolve(files);
        });
    });
}

/**
 * 打开一个文件
 * @param file
 * @returns
 */
export function openFile(file: string): Promise<number> {
    return new Promise((resolve, reject) => {
        open(file, function (error, fd) {
            if (error) {
                return reject(error);
            }
            resolve(fd);
        });
    });
}
