'use strict';

/**
* Initilizes 'aurusPay.https.getSession' LocalService service and returns it
* @returns {Object} - Service
*/
function initSessionService() {
    // Import LocalServiceRegistry Lib
    var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');

    // Aurus Pay Session Id
    var sessionService = LocalServiceRegistry.createService('aurusPay.https.getSession', {
        createRequest: function (svc, reqParams) {
            // Set HTTP Method and headers
            svc.setRequestMethod('POST');
            svc.addHeader('Content-type', 'application/json');
            return reqParams;
        },
        parseResponse: function (svc, response) {
            return response;
        },
        filterLogMessage: function (msg) {
            return msg;
        }
    });

    return sessionService;
}

/**
* Initilizes 'aurusPay.https.preAuth' LocalService service and returns it
* Handles preAuth ans postAuth
* @returns {Object} - Service
*/
function initAuthService() {
    // Import LocalServiceRegistry Lib
    var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');

    // Aurus Pay Session Id
    var authService = LocalServiceRegistry.createService('aurusPay.https.preAuth', {
        createRequest: function (svc, reqParams) {
            // Set HTTP Method and headers
            svc.setRequestMethod('POST');
            svc.addHeader('Content-type', 'application/json');
            return reqParams;
        },
        parseResponse: function (svc, response) {
            Logger.debug('authService response==={0}',JSON.stringify(response.text));
            return response;
        },
        filterLogMessage: function (msg) {
            return msg;
        }
    });
    var Logger = require('dw/system/Logger');
    Logger.debug('authService==={0}',authService);
    return authService;
}

// Changed By me
/**
 *
 * @param {*} params
 */
function initBillingTokenService() {
    var Logger = require('dw/system/Logger');
    Logger.debug('initBillingTokenService called');
    // Import LocalServiceRegistry Lib
    var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
    // Aurus Pay Session Id
    var authService = LocalServiceRegistry.createService('aurusPay.https.getPayPalToken', {
        createRequest: function (svc, reqParams) {
            Logger.debug('Service URL: {0}', svc.getURL());
            Logger.debug('initBillingTokenService reqParams==>>{0}',reqParams);
            // Set HTTP Method and headers
            svc.setRequestMethod('POST');
            svc.addHeader('Content-type', 'application/json');
            return reqParams;
        },
        parseResponse: function (svc, response) {
            Logger.debug('initBillingTokenService response==>>{0}',response.text);
            Logger.debug('initBillingTokenService response.statusCode==>>{0}',response.statusCode);
            return {
                status: response.statusCode,
                text: response.text
            };
        },
        filterLogMessage: function (msg) {
            return msg;
        }
    });
    Logger.debug('initBillingTokenService before return authService==>>{0}',authService);
    return authService;
}

module.exports = {
    getSessionService: initSessionService,
    getAuthService: initAuthService,
    getBillingToken: initBillingTokenService
};
