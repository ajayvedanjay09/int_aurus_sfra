'use strict';

const { assert } = require('chai');
const path = require('path');
const helpers = require('../../../lib/helpers');

describe('aliases', () => {
    it('should find all correct file path', () => {
        const aliases = helpers.createAliases(require('../../fixtures/paths/entry/package.json'), path.resolve(__dirname, '../../fixtures/paths/entry'));
        assert.equal(Object.keys(aliases).length, 6);
        assert.isNotNull(aliases['cartridgeA/en_GB']);
        assert.isUndefined(aliases['cartridgeA/default']);
        assert.isTrue(aliases.cartridgeA.indexOf('/js') === -1);
    });

    it('should create all aliases with correct postFix', () => {
        const aliases = helpers.createAliases(require('../../fixtures/paths/entry/package.json'), path.resolve(__dirname, '../../fixtures/paths/entry'), '/client/default/js');
        assert.equal(Object.keys(aliases).length, 6);
        assert.isTrue(aliases.cartridgeA.indexOf(path.normalize('/cartridge/client/default/js')) >= 0);
        assert.isTrue(aliases['cartridgeA/en_GB'].indexOf(path.normalize('/cartridge/client/en_GB/js')) >= 0);
    });
});
