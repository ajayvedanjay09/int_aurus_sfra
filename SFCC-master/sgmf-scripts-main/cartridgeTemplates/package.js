'use strict';

module.exports = (cartridgeName) => ({
    name: cartridgeName,
    version: '0.0.1',
    description: 'New overlay cartridge',
    main: 'index.js',
    scripts: {
        lint: 'sgmf-scripts --lint js && sgmf-scripts --lint css',
        'lint:fix': 'sgmf-scripts --lint js --fix && sgmf-scripts --lint css --fix',
        upload: 'sgmf-scripts --upload -- ',
        uploadCartridge: 'sgmf-scripts --uploadCartridge ' + cartridgeName,
        'compile:js': 'sgmf-scripts --compile js',
        'compile:scss': 'sgmf-scripts --compile css'
    },
    devDependencies: {
        autoprefixer: '^10.4.16',
        'css-minimizer-webpack-plugin': '^5.0.1',
        'mini-css-extract-plugin': '^2.7.6',
        eslint: '^8.56.0',
        'eslint-config-airbnb-base': '^15.0.0',
        'eslint-plugin-import': '^2.29.0',
        stylelint: '^15.4.0',
        'stylelint-config-standard-scss': '^10.0.0',
        nyc: '^15.1.0',
        mocha: '^10.0.0',
        sinon: '^17.0.1',
        chai: '^3.5.0',
        proxyquire: '1.7.4',
        'sgmf-scripts': '^3.0.0',
        'css-loader': '^6.0.0',
        'postcss-loader': '^7.0.0',
        sass: '^1.69.7',
        'sass-loader': '^13.3.2',
        'webpack-remove-empty-scripts': '^1.0.4'
    },
    browserslist: [
        'last 2 versions',
        'ie >= 10'
    ]
});
