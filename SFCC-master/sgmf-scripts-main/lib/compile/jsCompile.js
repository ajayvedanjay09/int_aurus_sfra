'use strict';

const webpack = require('webpack');
const webpackConfig = require('../utils/webpackConfig');

module.exports = (packageFile, cwd, callback) => {
    const jsConfig = webpackConfig(packageFile, cwd, 'js');
    if (typeof jsConfig === Error) {
        return;
    }

    // According to stats documentation this two values mean to not show stats output
    // @link https://webpack.js.org/configuration/stats/
    const hideStats = jsConfig.stats === false || jsConfig.stats === 'none';

    webpack(jsConfig, (err, stats) => {
        if (err) {
            console.error(err);
            callback(1);
            return;
        }

        const hasErrors = stats.hasErrors();

        if (!hideStats) {
            console[hasErrors ? 'error' : 'log'](stats.toString(jsConfig.stats || {
                chunks: false,
                colors: true
            }));
        }
        callback(hasErrors ? 1 : 0);
    });
};
