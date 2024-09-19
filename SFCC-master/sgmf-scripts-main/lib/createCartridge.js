'use strict';

const shell = require('shelljs');
const path = require('path');
const packageTemplate = require('../cartridgeTemplates/package');
const dw = require('../cartridgeTemplates/dw');
const dotProject = require('../cartridgeTemplates/dotProject');
const webpack = require('../cartridgeTemplates/webpack.config');
const projectProperties = require('../cartridgeTemplates/projectProperties');

module.exports = (cartridgeName, cwd) => {
    // create root directory
    const rootDir = path.join(cwd, cartridgeName);
    shell.mkdir(rootDir);

    // install npm dependencies
    console.log('Creating cartridge ' + cartridgeName);

    // create package.json file with the name provided
    const packageJson = packageTemplate(cartridgeName);
    shell.ShellString(JSON.stringify(packageJson, null, 2)).to(path.join(rootDir, 'package.json'));

    // created empty dw.json file
    shell.ShellString(JSON.stringify(dw, null, 2)).to(path.join(rootDir, 'dw.json'));

    // create webpack.config.js file
    shell.ShellString(webpack(cartridgeName))
        .to(path.join(rootDir, 'webpack.config.js'));

    // create folder structure
    shell.mkdir(path.join(rootDir, 'cartridges'));
    shell.mkdir(path.join(rootDir, 'cartridges', cartridgeName));
    const cartridgePath = path.join(rootDir, 'cartridges', cartridgeName, 'cartridge');
    shell.mkdir(cartridgePath);
    shell.mkdir(path.join(cartridgePath, 'controllers'));
    shell.mkdir(path.join(cartridgePath, 'models'));
    shell.mkdir(path.join(cartridgePath, 'templates'));
    shell.mkdir(path.join(cartridgePath, 'templates', 'default'));
    shell.mkdir(path.join(cartridgePath, 'templates', 'resources'));
    shell.mkdir(path.join(cartridgePath, 'client'));
    shell.mkdir(path.join(cartridgePath, 'client', 'default'));
    shell.mkdir(path.join(cartridgePath, 'client', 'default', 'js'));
    shell.mkdir(path.join(cartridgePath, 'client', 'default', 'scss'));

    // create .project file for cartrdige

    shell.ShellString(dotProject(cartridgeName))
        .to(path.join(rootDir, 'cartridges', cartridgeName, '.project'));

    // create .properties file for cartridge

    shell.ShellString(projectProperties(cartridgeName))
        .to(path.join(cartridgePath, cartridgeName + '.properties'));

    // create eslintrc.json file

    const eslintFile = {
        root: true,
        extends: 'airbnb-base/legacy'
    };

    shell.ShellString(JSON.stringify(eslintFile, null, 2)).to(path.join(rootDir, '.eslintrc.json'));

    // create stylelint file

    const stylelintFile = {
        extends: 'stylelint-config-standard',
        plugins: [
            'stylelint-scss'
        ]
    };

    shell.ShellString(JSON.stringify(stylelintFile, null, 2))
        .to(path.join(rootDir, '.stylelintrc.json'));

    // install npm dependencies
    console.log('Installing dependencies');

    shell.exec('npm install --prefix ' + rootDir);
};
