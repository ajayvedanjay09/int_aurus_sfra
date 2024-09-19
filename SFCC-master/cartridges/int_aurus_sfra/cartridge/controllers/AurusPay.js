'use strict';

var server = require('server');
var aurusPaySvc = require('*/cartridge/scripts/services/aurusPayServices');
var aurusPayHelper = require('*/cartridge/scripts/util/aurusPayHelper');
var Logger = require('dw/system/Logger');

server.get('GetSession', server.middleware.https, function (req, res, next) {
    
    var session;
    try {
        var uuid = request.httpParameterMap.ccId.stringValue; // eslint-disable-line
        var isPayPal = request.httpParameterMap.paypal.stringValue; // eslint-disable-line
        var reqBody = isPayPal === 'true' ? aurusPayHelper.getPayPalReqBody() : aurusPayHelper.getSessionReqBody(req, uuid);
        session = aurusPaySvc.getSessionService().call(reqBody);
        Logger.debug('GetSession reqBody =={0}',reqBody);
        Logger.debug('GetSession is here=={0}',session);
    } catch (error) {
        Logger.info('ERROR: Error while executing aurusPayServices.js script.', error);
    }

    if (session.ok) {
        session = session.object.text;
    } else {
        session = null;
    }

    res.json({
        session: session
    });

    return next();
});

// server.get('GetBillerToken', server.middleware.https, function (req, res, next) {
//     var session;
//     try {
//         var uuid = request; // eslint-disable-line
//         var reqBody = aurusPayHelper.getPayPalTokenReqBody(req, uuid);
//         Logger.debug('GetBillerToken reqBody=={0}',reqBody);
//         session = aurusPaySvc.getBillingToken().call(reqBody);
//         Logger.debug('GetBillerToken session is here::::{0}',session);
//     } catch (error) {
//         Logger.info('ERROR: Error while executing aurusPayServices.js script.', error);
//     }
//     Logger.debug('GetBillerToken session getting=={0}',session);
//     if (session.ok) {
//         Logger.debug('session.object.text inside if =={0}',session.object.text);
//         session = session.object.text;
//     } else {
//         session = null;
//     }

//     res.json({
//         session: session
//     });

//     return next();
// });

// Changed By me

server.get('GetBillerToken', server.middleware.https, function (req, res, next) {
    var session;
    try {
        var BasketMgr = require('dw/order/BasketMgr');
        var currentBasket = BasketMgr.getCurrentBasket();
        Logger.debug('currentBasket.currencyCode: {0}', currentBasket.currencyCode);
        // First, get the PayPal session
        var payPalSessionReqBody = aurusPayHelper.getPayPalReqBody();
        var payPalSession = aurusPaySvc.getSessionService().call(payPalSessionReqBody);

        if (payPalSession.ok) {
            var payPalSessionId = JSON.parse(payPalSession.object.text).SessionResponse.SessionId;
            Logger.debug('PayPal Session ID: {0}', payPalSessionId);

            // Now create the BillerTokenReqBody with the session ID
            var billerTokenReqBody = aurusPayHelper.getPayPalTokenReqBody({
                sessionId: payPalSessionId,
                totalGrossPrice:currentBasket.totalGrossPrice.value,
                currencyCode:currentBasket.currencyCode
            });

            Logger.debug('billerTokenReqBody==>>>{0}', billerTokenReqBody);
            session = aurusPaySvc.getBillingToken().call(billerTokenReqBody);
            Logger.debug('GetBillerToken session is here::::{0}', session);
        } else {
            session = null;
        }
    } catch (error) {
        Logger.info('ERROR: Error while executing aurusPayServices.js script.', error);
    }

    if (session.ok){
        Logger.debug('session.object.text inside if =={0}', session.object.text);
        session = session.object.text;
    } else {
        session = null;
    }

    res.json({
        session: session
    });

    return next();
});

module.exports = server.exports();
