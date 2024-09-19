'use strict';

/**
 * @namespace Order
 */

var server = require('server');
server.extend(module.superModule);

var Resource = require('dw/web/Resource');
var URLUtils = require('dw/web/URLUtils');
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');

/**
 * Order-Confirm : This endpoint is invoked when the shopper's Order is Placed and Confirmed
 * @name Base/Order-Confirm
 * @function
 * @memberof Order
 * @param {middleware} - consentTracking.consent
 * @param {middleware} - server.middleware.https
 * @param {middleware} - csrfProtection.generateToken
 * @param {querystringparameter} - ID - Order ID
 * @param {querystringparameter} - token - token associated with the order
 * @param {category} - sensitive
 * @param {serverfunction} - get
 */
server.replace(
    'Confirm',
    consentTracking.consent,
    server.middleware.https,
    csrfProtection.generateToken,
    function(req, res, next) {
        var reportingUrlsHelper = require('*/cartridge/scripts/reportingUrls');
        var OrderMgr = require('dw/order/OrderMgr');
        var OrderModel = require('*/cartridge/models/order');
        var Locale = require('dw/util/Locale');

        var order;
        var orderId;
        var orderToken;

        var walletID = req.querystring.walletID; // Extract walletID from query string

        // Mapping walletID to messages
        var walletMessages = {
            '4': 'Paid using PayPal !!!',
            '11': 'Paid using Google Pay !!!',
            '14': 'Paid using Klarna !!!'
        };
        var walletMessage = walletMessages[walletID];


        if (!req.form.orderToken || !req.form.orderID) {
            if (!req.querystring.ID || !req.querystring.token) {
                res.render('/error', {
                    message: Resource.msg('error.confirmation.error', 'confirmation', null),
                });
                this.emit('route:Complete', req, res);
                return;
            // eslint-disable-next-line no-else-return
            } else {
                orderId = req.querystring.ID;
                orderToken = req.querystring.token;
            }
        } else {
            orderId = req.form.orderID;
            orderToken = req.form.orderToken;
        }

        order = OrderMgr.getOrder(orderId, orderToken);

        if (!order || order.customer.ID !== req.currentCustomer.raw.ID
        ) {
            res.render('/error', {
                message: Resource.msg('error.confirmation.error', 'confirmation', null),
            });

            this.emit('route:Complete', req, res);
            return;
        }
        var lastOrderID = Object.prototype.hasOwnProperty.call(req.session.raw.custom, 'orderID') ? req.session.raw.custom.orderID : null;
        if (lastOrderID === req.querystring.ID) {
            res.redirect(URLUtils.url('Home-Show'));
            this.emit('route:Complete', req, res);
            return;
        }

        var config = {
            numberOfLineItems: '*',
        };

        var currentLocale = Locale.getLocale(req.locale.id);

        var orderModel = new OrderModel(
            order,
            { config: config, countryCode: currentLocale.country, containerView: 'order' }
        );
        var passwordForm;

        var reportingURLs = reportingUrlsHelper.getOrderReportingURLs(order);
        if (!req.currentCustomer.profile) {
            passwordForm = server.forms.getForm('newPasswords');
            passwordForm.clear();
            res.render('checkout/confirmation/confirmation', {
                order: orderModel,
                returningCustomer: false,
                passwordForm: passwordForm,
                reportingURLs: reportingURLs,
                orderUUID: order.getUUID(),
                walletMessage: walletMessage
            });
        } else {
            res.render('checkout/confirmation/confirmation', {
                order: orderModel,
                returningCustomer: true,
                reportingURLs: reportingURLs,
                orderUUID: order.getUUID(),
                walletMessage: walletMessage
            });
        }
        req.session.raw.custom.orderID = req.querystring.ID; // eslint-disable-line no-param-reassign
        this.emit('route:Complete', req, res);
        return;
    }
);

module.exports = server.exports();
