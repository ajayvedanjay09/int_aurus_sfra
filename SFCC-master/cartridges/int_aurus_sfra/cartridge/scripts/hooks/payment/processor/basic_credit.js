'use strict';

var collections = require('*/cartridge/scripts/util/collections');

var PaymentInstrument = require('dw/order/PaymentInstrument');
var PaymentMgr = require('dw/order/PaymentMgr');
var PaymentStatusCodes = require('dw/order/PaymentStatusCodes');
var Resource = require('dw/web/Resource');
var Transaction = require('dw/system/Transaction');
var Logger = require('dw/system/Logger');
/**
 * Creates a token. This should be replaced by utilizing a tokenization provider
 * @returns {string} a token
 */
function createToken() {
    return Math.random().toString(36).substr(2);
}

/**
 * Verifies that entered credit card information is a valid card. If the information is valid a
 * credit card payment instrument is created
 * @param {dw.order.Basket} basket Current users's basket
 * @param {Object} paymentInformation - the payment information
 * @return {Object} returns an error object
 */
function Handle(basket, paymentInformation) {
    var currentBasket = basket;
    var cardErrors = {};
    Logger.debug('cardnumber is =={0}',paymentInformation.cardNumber.value);
    Logger.debug('cardnumber is =={0}',paymentInformation.expirationMonth.value);
    Logger.debug('cardnumber is =={0}',paymentInformation.expirationYear.value);
    //var cardNumber = paymentInformation.cardNumber.value;
    //var cardSecurityCode = paymentInformation.securityCode.value;
    // var expirationMonth = paymentInformation.expirationMonth.value;
    // var expirationYear = paymentInformation.expirationYear.value;
    var serverErrors = [];
    var creditCardStatus;

    var cardType = paymentInformation.cardType.value;
    var paymentCard = PaymentMgr.getPaymentCard(cardType);

    // if (!paymentInformation.creditCardToken) {
    //     if (paymentCard) {
    //         creditCardStatus = paymentCard.verify(
    //             expirationMonth,
    //             expirationYear,
    //             cardNumber,
    //             cardSecurityCode
    //         );
    //     } else {
    //         cardErrors[paymentInformation.cardNumber.htmlName] =
    //             Resource.msg('error.invalid.card.number', 'creditCard', null);

    //         return { fieldErrors: [cardErrors], serverErrors: serverErrors, error: true };
    //     }

    //     if (creditCardStatus.error) {
    //         collections.forEach(creditCardStatus.items, function (item) {
    //             switch (item.code) {
    //                 case PaymentStatusCodes.CREDITCARD_INVALID_CARD_NUMBER:
    //                     cardErrors[paymentInformation.cardNumber.htmlName] =
    //                         Resource.msg('error.invalid.card.number', 'creditCard', null);
    //                     break;

    //                 case PaymentStatusCodes.CREDITCARD_INVALID_EXPIRATION_DATE:
    //                     cardErrors[paymentInformation.expirationMonth.htmlName] =
    //                         Resource.msg('error.expired.credit.card', 'creditCard', null);
    //                     cardErrors[paymentInformation.expirationYear.htmlName] =
    //                         Resource.msg('error.expired.credit.card', 'creditCard', null);
    //                     break;

    //                 case PaymentStatusCodes.CREDITCARD_INVALID_SECURITY_CODE:
    //                     cardErrors[paymentInformation.securityCode.htmlName] =
    //                         Resource.msg('error.invalid.security.code', 'creditCard', null);
    //                     break;
    //                 default:
    //                     serverErrors.push(
    //                         Resource.msg('error.card.information.error', 'creditCard', null)
    //                     );
    //             }
    //         });

    //         return { fieldErrors: [cardErrors], serverErrors: serverErrors, error: true };
    //     }
    // }

    Transaction.wrap(function () {
        var paymentInstruments = currentBasket.getPaymentInstruments(
            PaymentInstrument.METHOD_CREDIT_CARD
        );

        collections.forEach(paymentInstruments, function (item) {
            currentBasket.removePaymentInstrument(item);
        });

        var paymentInstrument = currentBasket.createPaymentInstrument(
            PaymentInstrument.METHOD_CREDIT_CARD, currentBasket.totalGrossPrice
        );

        paymentInstrument.setCreditCardHolder(currentBasket.billingAddress.fullName);
        paymentInstrument.setCreditCardNumber(paymentInformation.cardNumber.value);
        paymentInstrument.setCreditCardType(cardType);
        paymentInstrument.setCreditCardExpirationMonth(paymentInformation.expirationMonth.value);
        paymentInstrument.setCreditCardExpirationYear(paymentInformation.expirationYear.value);
        paymentInstrument.setCreditCardToken(
            paymentInformation.creditCardToken
                ? paymentInformation.creditCardToken
                : createToken()
        );
    });

    return { fieldErrors: cardErrors, serverErrors: serverErrors, error: false };
}

/**
 * Authorizes a payment using a credit card. Customizations may use other processors and custom
 *      logic to authorize credit card payment.
 * @param {number} orderNumber - The current order's number
 * @param {dw.order.PaymentInstrument} paymentInstrument -  The payment instrument to authorize
 * @param {dw.order.PaymentProcessor} paymentProcessor -  The payment processor of the current
 *      payment method
 * @return {Object} returns an error object
 */
function Authorize(orderNumber, paymentInstrument, paymentProcessor, aurusTokens) {
    var serverErrors = [];
    var fieldErrors = {};
    var error = false;

    try {
        Transaction.wrap(function () {
            paymentInstrument.paymentTransaction.setTransactionID(orderNumber);
            paymentInstrument.paymentTransaction.setPaymentProcessor(paymentProcessor);
            // Here is where we set the one time order token
            paymentInstrument.paymentTransaction.custom.aurusPayOOT = aurusTokens.aurusPayOOT;
            paymentInstrument.paymentTransaction.custom.aurusPayAPTN = aurusTokens.aurusPayAPTN;
            paymentInstrument.paymentTransaction.custom.aurusPayAPTID = aurusTokens.aurusPayAPTID;
        });
    } catch (e) {
        error = true;
        serverErrors.push(
            Resource.msg('error.technical', 'checkout', null)
        );
    }

    return { fieldErrors: fieldErrors, serverErrors: serverErrors, error: error };
}

exports.Handle = Handle;
exports.Authorize = Authorize;
exports.createToken = createToken;
