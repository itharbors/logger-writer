'use strict';

const { spawnAsync } = require('./utils');

const exec = async function () {
    await spawnAsync('tsc');
    await spawnAsync(
        'esbuild',
        './source/index.js',
        '--outfile=./build/logger-writer.mjs',
        '--bundle',
        '--format=esm',
        '--platform=node',
    );
};

exec();
