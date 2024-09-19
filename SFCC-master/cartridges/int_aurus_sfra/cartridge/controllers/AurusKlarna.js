//AurusWallet.js 
'use strict';

var server = require('server');
var aurusPaySvc = require('*/cartridge/scripts/services/aurusPayServices');
var aurusPayHelper = require('*/cartridge/scripts/util/aurusPayHelper');
var BasketMgr = require('dw/order/BasketMgr');
var Logger = require('dw/system/Logger');
var formatMoney = require('dw/util/StringUtils').formatMoney;

/**
 * This function handles the getGenericJsonObj 
 * @param {Object} klarnaSessionId klarnaSession session id
 * @returns {Object} consumerObj - The generic JSON object with dynamic shipping address
 *@param {String} skipShippingAddress skipShippingAddress
 */
function getGenericJsonObj(klarnaSessionId) {
    var currentBasket = BasketMgr.getCurrentBasket();
    // Logger.debug('Total Tax amout of current basket:::{0}',currentBasket.getTotalTax().value);
    var shippingTotal = currentBasket.getShippingTotalPrice().getValue();
        Logger.debug('Current shipping fee: {0}', shippingTotal);
    Logger.debug('Total adjustedShippingTotalGrossPrice amount of current basket:::{0}', currentBasket.adjustedShippingTotalGrossPrice.value);
    // Logger.debug('currentBasket.getTotalTax().value:::{0}',currentBasket.getTotalTax().value);
    // Logger.debug('Total totalGrossPrice amount of current basket:::{0}',currentBasket.totalGrossPrice.value);
    if (!currentBasket) {
        Logger.error('No current basket found.');
        return null;
    }

    var billingAddress = currentBasket.billingAddress;
    var billing_address = {};

    if (billingAddress) {
        billing_address = {
            "firstName": billingAddress.firstName,
            "lastName": billingAddress.lastName,
            "emailAddress": currentBasket.customerEmail,
            "street": billingAddress.address1,
            "street2": billingAddress.address2,
            "city": billingAddress.city,
            "state": billingAddress.stateCode,
            "postalCode": billingAddress.postalCode,
            "countryCode": billingAddress.countryCode.value,
            "phoneNumber": billingAddress.phone
        };
    }

    var shippingAddress = currentBasket.shipments[0].shippingAddress;
    //shippingAddress checking if exist skipShippingAddress will be 0;
    var shipping_address = {};
    if (shippingAddress) {
        shipping_address = {
            "firstName": shippingAddress.firstName,
            "lastName": shippingAddress.lastName,
            "emailAddress": currentBasket.customerEmail,
            "street": shippingAddress.address1,
            "street2": shippingAddress.address2,
            "city": shippingAddress.city,
            "state": shippingAddress.stateCode,
            "postalCode": shippingAddress.postalCode,
            "countryCode": shippingAddress.countryCode.value,
            "phoneNumber": shippingAddress.phone
        }
    }


    var itemsArray = [];
    var totalTaxAmount = 0;
    var orderAmount = 0;//currentBasket.adjustedShippingTotalGrossPrice.value;
    var basketItems = currentBasket.getAllProductLineItems();
    var shippingTaxAmount = currentBasket.getAdjustedShippingTotalTax().value; // Get the total shipping tax
    var shippingTaxAmount1=currentBasket.getShippingTotalTax();
    Logger.debug('shippingTaxAmount1:::{0}', shippingTaxAmount1);
    Logger.debug('shippingTaxAmount:::{0}', shippingTaxAmount);
    // Add tax item
    itemsArray.push({
        "reference": "19-404",
        "name": "Tax",
        "quantity": "1",
        "totalAmount": currentBasket.getTotalTax().value,
        "type": "sales_tax",
        "additionalChargeIndicator": "0",
        "price": {
            "amount": currentBasket.getTotalTax().value,
            "currency_code": "USD"
        }
    });

    // Add discount item
    itemsArray.push({
        "reference": "19-407",
        "name": "discount",
        "quantity": "1",
        "totalAmount": '0',
        "type": "discount",
        "additionalChargeIndicator": "0",
        "price": {
            "amount": '0',
            "currency_code": "USD"
        }
    });
    // Add shipping_fee 
    itemsArray.push({
        "reference": "19-407",
        "name": "shipping_fee",
        "quantity": "1",
        "totalAmount": shippingTotal,
        "type": "shipping_fee",
        "additionalChargeIndicator": "0",
        "price": {
            "amount": shippingTotal,
            "currency_code": "USD"
        }
    });
    for (var i = 0; i < basketItems.length; i++) {
        var item = basketItems[i];
        var itemTotalAmount = item.adjustedGrossPrice.value;
        Logger.debug('itemTotalAmount:::{0}', itemTotalAmount);
        Logger.debug('item.basePrice.value:::{0}', item.basePrice.value);
        Logger.debug('item.quantity.value:::{0}', item.quantity.value +"---"+item.quantityValue);
        var itemTaxAmount = item.tax.value;

        totalTaxAmount += itemTaxAmount;
        orderAmount += itemTotalAmount;

        itemsArray.push({
            "reference": item.productID,
            "name": item.productName,
            "quantity": item.quantityValue.toString(),
            "totalAmount": item.basePrice.value*item.quantity.value,
            "totalDiscountAmount": '0', //itemDiscountAmount.toFixed(2),
            "totalTaxAmount": '0', //itemTaxAmount.toFixed(2),
            "type": "physical", // assuming all items are physical, adjust if necessary
            "additionalChargeIndicator": "0", // assuming no additional charge, adjust if necessary
            "taxRate": '0', //((itemTaxAmount / itemTotalAmount) * 100).toFixed(2), // calculate tax rate
            "price": {
                "amount": item.basePrice.value,
                "currency_code": "USD"
            }
        });
    }

    Logger.debug('itemsArray:::{0}', JSON.stringify(itemsArray));

    var consumerObj = {
        "sessionId": klarnaSessionId,
        "apmMatrix": "00010010000001100000000000000000",
        "env": "sandbox",
        "enablePayInFour": "1",
        "aurusClientId": "2888282061100021",
        "customer": {
            "isShippingPreference": "1",
            "skipShippingAddress": "1",
            "billing_address": billing_address,
            "shipping_address": shipping_address
        },
        // "store_pickup": {
        //     "shipping_method": "store pick-up",
        //     "shipping_type": "express",
        //     "first_name": "Klara",
        //     "last_name": "Joyce",
        //     "street_address": "Easton Station",
        //     "street_number": "3698",
        //     "postal_code": "43219",
        //     "city": "Columbus",
        //     "country": "US"
        // },
        "order": {
            "purchaseCountry": "US",
            "purchaseCurrency": "USD",
            "locale": "en-US",
            "items":itemsArray,
            // "items": [{
            //     "reference": "19-401",
            //     "name": "Mouse",
            //     "quantity": "1",
            //     "totalAmount": currentBasket.totalGrossPrice.value,
            //     "totalDiscountAmount": "0",
            //     "totalTaxAmount": "0",
            //     "type": "physical",
            //     "additionalChargeIndicator": "0",
            //     "taxRate": "0",
            //     "price": {
            //         "amount": currentBasket.totalGrossPrice.value,
            //         "currency_code": currentBasket.currencyCode
            //     }
            // }],
            "tax_amount": {
                "amount": currentBasket.getTotalTax().value,
                "currency_code": currentBasket.currencyCode
            },
            "order_amount": {
                "amount": currentBasket.totalGrossPrice.value,//currentBasket.totalGrossPrice.value
                "currency": currentBasket.currencyCode
            }
        },
        "payment_method": "pay_over_time"
    }
    return consumerObj;
}

server.get('klarnaGetGenericJsonObj', server.middleware.https, function (req, res, next) {
    var klarnaSessionReqBody = aurusPayHelper.getPayPalReqBody();
    var klarnaSession = aurusPaySvc.getSessionService().call(klarnaSessionReqBody);

    if (!klarnaSession.ok) {
        Logger.error('Failed to get klarnaSession session.');
        res.setStatusCode(500);
        res.json({
            error: 'Failed to get klarnaSession session.'
        });
        return next();
    }

    var klarnaSessionId = JSON.parse(klarnaSession.object.text).SessionResponse.SessionId;
    Logger.debug('klarnaSessionId Session ID: {0}', klarnaSessionId);

    var jsonObject = getGenericJsonObj(klarnaSessionId);
    Logger.debug('jsonObject :::: {0}', JSON.stringify(jsonObject));
    if (!jsonObject) {
        res.setStatusCode(500);
        res.json({
            error: 'Failed to create JSON object.'
        });
        return next();
    }

    res.json({
        getGenericJsonObj: jsonObject
    });

    return next();
});


/**
 * This function handles the auth call
 * @param {Object} params contains shipping, billing, and OTT
 * @returns {Object} Pre auth object from service call
 */
function aurusPreAuth(params) {
    // Custom Scripts for Auth call
    var aurusPaySvc = require('*/cartridge/scripts/services/aurusPayServices');
    var aurusPayHelper = require('*/cartridge/scripts/util/aurusPayHelper');
    var Logger = require('dw/system/Logger');
    var auth;
    try {
        var reqBody = aurusPayHelper.createAuthReqBody(params);
        auth = aurusPaySvc.getAuthService().call(reqBody);
    } catch (error) {
        Logger.info('ERROR: Error while executing pre auth.', error);
    }

    if (auth.ok) {
        auth = JSON.parse(auth.object.text);
    } else {
        auth = null;
    }
    return auth;
}

server.post('PlaceOrder',
    server.middleware.https,
    function (req, res, next) {
        var BasketMgr = require('dw/order/BasketMgr');
        var OrderMgr = require('dw/order/OrderMgr');
        var Resource = require('dw/web/Resource');
        var Transaction = require('dw/system/Transaction');
        var URLUtils = require('dw/web/URLUtils');
        var basketCalculationHelpers = require('*/cartridge/scripts/helpers/basketCalculationHelpers');
        var hooksHelper = require('*/cartridge/scripts/helpers/hooks');
        var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');
        var validationHelpers = require('*/cartridge/scripts/helpers/basketValidationHelpers');
        var addressHelpers = require('*/cartridge/scripts/helpers/addressHelpers');
        var HookMgr = require('dw/system/HookMgr');
        var PaymentMgr = require('dw/order/PaymentMgr');
        var Site = require('dw/system/Site');
        var Logger = require('dw/system/Logger');
        // Models for Auth call
        var BillingAddressModel = require('*/cartridge/models/billingAddress');
        var ShippingAddressModel = require('*/cartridge/models/shippingAddress');
        var EcommInfoModel = require('*/cartridge/models/ecommInfo');
        var TransAmountDetails = require('*/cartridge/models/transactionDetails');
        var Level3Products = require('*/cartridge/models/aurusLevelThreeProduct');

        var currentBasket = BasketMgr.getCurrentBasket();
        var validatedProducts = validationHelpers.validateProducts(currentBasket);

        // these values are coming from ajax call
        var BillingAddress = JSON.parse(request.httpParameterMap.BillingAddress.stringValue);
        var ShippingAddress = JSON.parse(request.httpParameterMap.ShippingAddress.stringValue);

        // Get the current billing and shipping addresses from the basket
        var billingAddress = currentBasket.billingAddress;
        var shippingAddress = currentBasket.defaultShipment.shippingAddress;

        Transaction.wrap(function () {
            // Update billing address only if it's not already set this is updated in case of ExpressCheckout
            if (!billingAddress) {
                billingAddress = currentBasket.createBillingAddress();
            }

            billingAddress.setFirstName(BillingAddress.BillingFirstName);
            billingAddress.setLastName(BillingAddress.BillingLastName);
            billingAddress.setAddress1(BillingAddress.BillingAddressLine1);
            billingAddress.setAddress2(BillingAddress.BillingAddressLine2);
            billingAddress.setCity(BillingAddress.BillingCity);
            billingAddress.setPostalCode(BillingAddress.BillingZip);
            billingAddress.setStateCode(BillingAddress.BillingState);
            billingAddress.setCountryCode(BillingAddress.BillingCountry);
            billingAddress.setPhone(BillingAddress.BillingMobileNumber);

            currentBasket.customerEmail = BillingAddress.BillingEmailId;

            // Update shipping address only if it's not already set this is updated in case of ExpressCheckout
            if (!shippingAddress) {
                shippingAddress = currentBasket.defaultShipment.createShippingAddress();
                shippingAddress.setFirstName(ShippingAddress.ShippingFirstName);
                shippingAddress.setLastName(ShippingAddress.ShippingLastName);
                shippingAddress.setAddress1(ShippingAddress.ShippingAddressLine1);
                shippingAddress.setAddress2(ShippingAddress.ShippingAddressLine2);
                shippingAddress.setCity(ShippingAddress.ShippingCity);
                shippingAddress.setPostalCode(ShippingAddress.ShippingZip);
                shippingAddress.setStateCode(ShippingAddress.ShippingState);
                shippingAddress.setCountryCode(ShippingAddress.ShippingCountry);
                shippingAddress.setPhone(ShippingAddress.ShippingMobileNumber);
            }
        });



        // Creates a new order.
        var order = COHelpers.createOrder(currentBasket);
        Logger.debug('Creates a new order: {0}', JSON.stringify(order));
        if (!order) {
            res.json({
                error: true,
                errorMessage: Resource.msg('error.technical', 'checkout', null)
            });
            Logger.debug('Creates a new order Error');
            return next();
        }

        //OneTimeToken is set in this variable
        var ott = {
            value: request.httpParameterMap.OneTimeToken.stringValue
        };
        Logger.debug('Creates a new order: {0}', ott);
        var cardType = request.httpParameterMap.cardType.stringValue;
        var aurusCardType = cardType;

        var aurusShippingAddress = new ShippingAddressModel({
            shipping: order.defaultShipment.shippingAddress,
            email: order.customerEmail,
            phone: order.defaultShipment.shippingAddress.phone
        });
        Logger.debug('aurusShippingAddress: {0}', JSON.stringify(aurusShippingAddress));
        var aurusEcommInfo = new EcommInfoModel({
            storeId: Site.current.getCustomPreferenceValue('Aurus_storeId'),
            oneTimeToken: ott,
            merchantId: Site.current.getCustomPreferenceValue('Aurus_merchantIdentifier'),
            terminalId: Site.current.getCustomPreferenceValue('Aurus_terminalId'),
            cardId: '',
            oneOrderToken: ''
        });
        Logger.debug('aurusEcommInfo: {0}', JSON.stringify(aurusEcommInfo));
        var aurusBillingAddress = new BillingAddressModel({
            billing: order.billingAddress,
            email: order.customerEmail,
            phone: order.billingAddress.phone
        });
        Logger.debug('aurusBillingAddress: {0}', JSON.stringify(aurusBillingAddress));
        var aurusTransAmountDetails = new TransAmountDetails(order);
        var aurusProducts = new Level3Products(order);
        var aurusInvoiceNumber = order.orderNo;

        // Aurus PreAuth Call

        var authResult = aurusPreAuth({
            ShippingAddress: aurusShippingAddress,
            ECOMMInfo: aurusEcommInfo,
            cardType: aurusCardType,
            BillingAddress: aurusBillingAddress,
            TransAmountDetails: aurusTransAmountDetails,
            orderNo: aurusInvoiceNumber,
            Level3ProductsData: aurusProducts
        });

        Logger.debug('authResult aurusPreAuth in Auruswallet-->>{0}', JSON.stringify(authResult));
        // Auth Success
        var aurusPayResponseCode = Number(authResult.TransResponse.TransDetailsData.TransDetailData.ResponseCode);
        if (aurusPayResponseCode > 0) {
            // Response code not 0000
            // Fail Order
            Transaction.wrap(function () {
                OrderMgr.failOrder(order, true);
            });

            res.json({
                error: true,
                AurusPayResponseCode: authResult.TransResponse.TransDetailsData.TransDetailData.ResponseCode,
                AurusPayResponseText: authResult.TransResponse.TransDetailsData.TransDetailData.ResponseText,
                errorMessage: authResult.TransResponse.TransDetailsData.TransDetailData.ResponseText + '\n Please Refresh the page'
            });

            return next();
        }
        //--------------------->>>>>>>>
        var aurusTokens = {
            aurusPayOOT: authResult.TransResponse.TransDetailsData.TransDetailData.ECOMMInfo !== null ? authResult.TransResponse.TransDetailsData.TransDetailData.ECOMMInfo.OneOrderToken : '',
            aurusPayAPTN: authResult.TransResponse.AurusPayTicketNum !== null ? authResult.TransResponse.AurusPayTicketNum : '',
            aurusPayAPTID: authResult.TransResponse.TransDetailsData.TransDetailData.AuruspayTransactionId !== null ? authResult.TransResponse.TransDetailsData.TransDetailData.AuruspayTransactionId : '',
            isEmpty: (authResult.TransResponse.TransDetailsData.TransDetailData.ECOMMInfo.OneOrderToken + authResult.TransResponse.AurusPayTicketNum + authResult.TransResponse.TransDetailsData.TransDetailData.AuruspayTransactionId).length === 0
        };
        Logger.debug('aurusTokens---->>{0}', JSON.stringify(aurusTokens));

        // Handles payment authorization and attaches Aurus One Order Token (OOT) to Payment Transaction
        var handlePaymentResult = COHelpers.handlePayments(order, order.orderNo, aurusTokens);
        Logger.debug('handlePaymentResult: {0}', JSON.stringify(handlePaymentResult));
        if (handlePaymentResult.error) {
            res.json({
                error: true,
                errorMessage: Resource.msg('error.technical', 'checkout', null)
            });
            Logger.debug('handlePaymentResult error: {0}');
            return next();
        }
        //--------------------->>>>>>>>

        var fraudDetectionStatus = hooksHelper('app.fraud.detection', 'fraudDetection', currentBasket, require('*/cartridge/scripts/hooks/fraudDetection').fraudDetection);
        Logger.debug('fraudDetectionStatus: {0}', JSON.stringify(fraudDetectionStatus));
        if (fraudDetectionStatus.status === 'fail') {
            Transaction.wrap(function () {
                OrderMgr.failOrder(order);
            });

            // fraud detection failed
            req.session.privacyCache.set('fraudDetectionStatus', true);

            res.json({
                error: true,
                cartError: true,
                redirectUrl: URLUtils.url('Error-ErrorCode', 'err', fraudDetectionStatus.errorCode).toString(),
                errorMessage: Resource.msg('error.technical', 'checkout', null)
            });

            return next();
        }

        // Places the order
        var placeOrderResult = COHelpers.placeOrder(order, fraudDetectionStatus);
        Logger.debug('placeOrderResult: {0}', JSON.stringify(placeOrderResult));
        if (placeOrderResult.error) {
            res.json({
                error: true,
                errorMessage: Resource.msg('error.technical', 'checkout', null)
            });
            Logger.debug('placeOrderResult: Error ');
            return next();
        }
        //--------------------->>>>>>>>
        if (req.currentCustomer.addressBook) {
            // save all used shipping addresses to address book of the logged in customer
            var allAddresses = addressHelpers.gatherShippingAddresses(order);
            allAddresses.forEach(function (address) {
                if (!addressHelpers.checkIfAddressStored(address, req.currentCustomer.addressBook.addresses)) {
                    addressHelpers.saveAddress(address, req.currentCustomer, addressHelpers.generateAddressName(address));
                }
            });
        }
        //--------------------->>>>>>>>
        //if (order.customerEmail && req.locale && req.locale.id) {
        COHelpers.sendConfirmationEmail(order, req.locale.id);
        //} else {
        //  Logger.warn('Missing customer email or locale information. Skipping email sending.');
        //}

        // Reset usingMultiShip after successful Order placement
        req.session.privacyCache.set('usingMultiShipping', false);

        // TODO: Exposing a direct route to an Order, without at least encoding the orderID
        //  is a serious PII violation.  It enables looking up every customers orders, one at a
        //  time.
        var Logger = require('dw/system/Logger');
        Logger.debug('orderID----->>>{0}', order.orderNo);
        Logger.debug('orderToken----->>>{0}', order.orderToken);
        res.json({
            error: false,
            orderID: order.orderNo,
            orderToken: order.orderToken,
            continueUrl: URLUtils.url('Order-Confirm').toString()
        });

        return next();
    }
);

module.exports = server.exports();
