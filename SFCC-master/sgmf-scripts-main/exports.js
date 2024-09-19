'use strict';

const output = {};
output.webpack = require('webpack');
output.createJsPath = require('./lib/helpers').createJsPath;
output.createScssPath = require('./lib/helpers').createScssPath;

module.exports = output;
