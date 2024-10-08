'use strict';

var Site = require('dw/system/Site');
var Logger = require('dw/system/Logger');
   
/**
* Retrieves payment instrument if customer is registered and has stored payment methods
* @param {Object} req middleware request object
* @param {string} uuid internal stored payment method id
* @returns {dw.customer.CustomerPaymentInstrument} - payment instrument
*/
function getCard(req, uuid) {
    var card = null;

    if (req.currentCustomer.raw.authenticated && req.currentCustomer.raw.registered) {
        // Collection: A collection of all payment instruments associated with the related customer.
        var wallet = req.currentCustomer.wallet.paymentInstruments;
        for (var i = 0; i < wallet.length; i++) {
            if (uuid.length === 0) {
                card = wallet[i];
                break;
            }
            if (uuid === wallet[i].UUID) {
                card = wallet[i];
                break;
            }
            if (uuid === 'newCard') {
                break;
            }
        }
    }
//Logger.debug('Existing card details:::{0}',JSON.stringify(card));
    return card;
}

/**
* Creates the request object for Aurus Pay Session ID web call
* @param {Object} req middleware request object
* @param {string} uuid internal stored payment method id
* @returns {JSON} - Session Id request JSON object
*/
function createSessionReqBody(req, uuid) {
    var card = getCard(req, uuid);
    var jsBody = {
        SessionRequest: {
            CardExpiryDate: card !== null ? card.creditCardExpirationMonth + '' + card.creditCardExpirationYear : '',
            CardIdentifier: card !== null ? card.raw.creditCardToken : '', //'2000000000000150' underArmour
            CardNumber: card !== null ? card.creditCardNumber : '',
            CardType: card !== null ? card.creditCardType : '',
            CorpID: Site.current.getCustomPreferenceValue('Aurus_corporateIdentifier') || '', // custom pref
            DomainId: Site.current.getCustomPreferenceValue('Aurus_domainId') || '', // custom pref
            KI: '',
            MerchantIdentifier: Site.current.getCustomPreferenceValue('Aurus_merchantIdentifier') || '',
            StoreId: Site.current.getCustomPreferenceValue('Aurus_storeId') || '', // custom pref
            TemplateId: Site.current.getCustomPreferenceValue('Aurus_templateId'),//card !== null ? '2' : '1', // determines which CC form is retrieved //'3'
            TerminalId: Site.current.getCustomPreferenceValue('Aurus_terminalId') || '', // custom pref
            URLType: Site.current.getCustomPreferenceValue('Aurus_urlType') || '' // custom pref
        }
    };
    var jsonbody = JSON.stringify(jsBody);
    Logger.debug('createSessionReqBody::::::{0}',jsonbody);
    return jsonbody;
}

// Changed By me
/**
* Creates the request object for Aurus Pay Session ID web call
* @param {Object} req middleware request object
* @param {string} uuid internal stored payment method id
* @returns {JSON} - Session Id request JSON object
*/
function createPayPalSessionReqBody() {
    var jsBody = {
        SessionRequest: {
            CardExpiryDate: '',
            CorpID: Site.current.getCustomPreferenceValue('Aurus_corporateIdentifier') || '', // custom pref
            DomainId: Site.current.getCustomPreferenceValue('Aurus_domainId') || '', // custom pref
            KI: '',
            MerchantIdentifier: Site.current.getCustomPreferenceValue('Aurus_merchantIdentifier') || '',
            StoreId: Site.current.getCustomPreferenceValue('Aurus_storeId') || '', // custom pref
            TemplateId: '1', // determines which CC form is retrieved
            TerminalId: Site.current.getCustomPreferenceValue('Aurus_terminalId') || '', // custom pref
            TokenType: '102',
            URLType: Site.current.getCustomPreferenceValue('Aurus_urlType') || '' // custom pref
        }
    };

    // var jsBody = {
    //     SessionRequest: {
    //         CardExpiryDate: '',
    //         CorpID: Site.current.getCustomPreferenceValue('corporateIdentifier') || '', // custom pref
    //         DomainId: Site.current.getCustomPreferenceValue('domainId') || '', // custom pref
    //         KI: '',
    //         MerchantIdentifier: Site.current.getCustomPreferenceValue('merchantIdentifier') || '',
    //         StoreId: Site.current.getCustomPreferenceValue('storeId') || '', // custom pref
    //         TemplateId: '1', // determines which CC form is retrieved
    //         TerminalId: Site.current.getCustomPreferenceValue('terminalId') || '', // custom pref
    //         TokenType: '102',
    //         URLType: '' // custom pref
    //     }
    // };
    
    var jsonbody = JSON.stringify(jsBody);
    Logger.debug('createPayPalSessionReqBody==>>{0}',jsonbody);
    return jsonbody;
}

/**
* Creates the request object for Aurus Pay Auth web call
* @param {Object} params used to pass down custom prefs
* @returns {JSON} - Auth request JSON object
*/
function createAuthReqBody(params) {
    Logger.debug('createAuthReqBody called with billing address =={0}',JSON.stringify(params.BillingAddress));
    var jsBody = {
        TransRequest: {
            ApprovalCode: '',
            AurusPayTicketNum: '000000000000000000',
            PostAuthCount: '00',
            CorpID: Site.current.getCustomPreferenceValue('Aurus_corporateIdentifier') || '', // custom pref
            ShippingAddress: params.ShippingAddress,
            ReferenceNumber: '',
            ThirdPartyURL: '',
            TransactionDate: '10092019',
            ProcessorToken: '',
            TransactionTime: '025226',
            PONumber: '',
            SettlementInfo: {
                MerchantTransactionCode: '',
                SalesCheckNumber: '',
                CreditPlan: '',
                TransactionDescription: '',
                PromotionCode: '',
                InCircleAmount: ''
            },
            PostAuthSequenceNo: '00',
            OrigTransactionIdentifier: '',
            LanguageIndicator: '00',
            CardExpiryDate: '',
            OrigAurusPayTicketNum: '',
            CurrencyCode: '840', // custom pref
            ECOMMInfo: params.ECOMMInfo,
            ClerkID: '',
            SubTransType: '0',
            WalletIdentifier: '',
            PODate: '',
            TransactionType: '04',
            KI: '',
            CardType: params.cardType,
            BillingAddress: params.BillingAddress,
            TransAmountDetails: params.TransAmountDetails,
            Level3ProductsData: params.Level3ProductsData,
            InvoiceNumber: params.orderNo
        }
    };
    var jsonbody = JSON.stringify(jsBody);
    Logger.debug('preauth request body==>>{0}',jsonbody);
    return jsonbody;
}
// Changed By me

/**
* Creates request oject for Aurus Pay Biller Token web call
* @param {*} params
* @returns {JSON} - Auth request JSON object
*/
function createBillerTokenReqBody(params) {
    var URLUtils = require('dw/web/URLUtils');
    // var jsBody = {
    //     GetBillerTokenRequest: {
    //         TransactionType: '80',
    //         WalletIdentifier: '4',
    //         WalletObject: {
    //             experience_profile_id: 'XP-YD7S-4CVY-P8FT-MDAN',
    //             payer: {
    //                 payment_method: 'PAYPAL'
    //             },
    //             plan: {
    //                 type: 'MERCHANT_INITIATED_BILLING',
    //                 merchant_preferences: {
    //                     return_url: URLUtils.url('Checkout-Begin').toString() + '?stage=placeOrder#placeOrder',
    //                     cancel_url: URLUtils.url('Cart-Show').toString(),
    //                     accepted_pymt_type: 'INSTANT',
    //                     skip_shipping_address: false,
    //                     immutable_shipping_address: true
    //                 }
    //             },
    //             shipping_address: {
    //                 line1: '505 Millennium Dr',
    //                 line2: '',
    //                 city: 'Allen',
    //                 state: 'TX',
    //                 postal_code: '75013',
    //                 country_code: 'US',
    //                 recipient_name: 'Jorge'
    //             }
    //         },
    //         ECOMMInfo: {
    //             StoreId: Site.current.getCustomPreferenceValue('Aurus_storeId') || '',
    //             MerchantIdentifier: Site.current.getCustomPreferenceValue('Aurus_merchantIdentifier') || '',
    //             TerminalId: Site.current.getCustomPreferenceValue('Aurus_terminalId') || ''
    //             // StoreId: Site.current.getCustomPreferenceValue('storeId') || '',
    //             // MerchantIdentifier: Site.current.getCustomPreferenceValue('merchantIdentifier') || '',
    //             // TerminalId: Site.current.getCustomPreferenceValue('terminalId') || ''
    //         },
    //         TransactionTime: '',
    //         TransactionDate: ''
    //     }
    // };

    // var jsBody = {
    //     GetBillerTokenRequest: {
    //         CorpID: Site.current.getCustomPreferenceValue('Aurus_corporateIdentifier') || '', // custom pref
    //         ADSDKSpecVer: '6.14.9',
    //         ECOMMInfo: {
    //             StoreId: Site.current.getCustomPreferenceValue('Aurus_storeId') || '',
    //             MerchantIdentifier: Site.current.getCustomPreferenceValue('Aurus_merchantIdentifier') || '',
    //             TerminalId: Site.current.getCustomPreferenceValue('Aurus_terminalId') || ''
    //         },
    //         SessionId: params.sessionId,
    //         SubWalletIdentifier: '4',
    //         TransactionDate: '',
    //         TransactionTime: '',
    //         TransactionType: '80',
    //         WalletIdentifier: '4',
    //         WalletObject: {
    //             intent: 'AUTHORIZE',
    //             processing_instruction: 'ORDER_SAVED_EXPLICITLY',
    //             purchase_units: [
    //                 {
    //                     amount: {
    //                         currency_code:params.currencyCode,
    //                         value: params.totalGrossPrice
    //                     }
    //                 }
    //             ]
    //         }
    //     }
    // };
    
    var jsBody = {
    GetBillerTokenRequest: {
        TransactionTime: "235552",
         ADSDKSpecVer: "6.12.8",
         TransactionType: "80",
         CorpID: Site.current.getCustomPreferenceValue('Aurus_corporateIdentifier') || '',
         WalletObject: {
             shipping_address: {
                 country_code: "US",
                 city: "abc",
                 state: "CA",
                 recipient_name: "Alfredo  xyz",
                 postal_code: "91331",
                 line2: "",
                 line1: "12924 abc St"
             },
             plan: {
                 merchant_preferences: {
                     skip_shipping_address: false,
                     return_url: 'https://'+request.getHttpHost()+URLUtils.url('Checkout-Begin').toString() + '?stage=placeOrder#placeOrder',
                     immutable_shipping_address: false,
                     cancel_url: 'https://'+request.getHttpHost()+URLUtils.url('Cart-Show').toString(),
                     accepted_pymt_type: "INSTANT"
                 },
                 type: "MERCHANT_INITIATED_BILLING"
             },
             payer: {
                 payment_method: "PAYPAL"
             }
         },
         SessionId: params.sessionId,
         WalletIdentifier: "4",
         ECOMMInfo: {
             MerchantIdentifier: Site.current.getCustomPreferenceValue('Aurus_merchantIdentifier') || '',
             StoreId: Site.current.getCustomPreferenceValue('Aurus_storeId') || '',
             TerminalId: Site.current.getCustomPreferenceValue('Aurus_terminalId') || ''
         },
         TransactionDate: "06202024"
     }
    };

    var jsonbody = JSON.stringify(jsBody);
    Logger.debug('biller token request body==>>{0}',jsonbody);
    return jsonbody;
}

module.exports = {
    getSessionReqBody: createSessionReqBody,
    getPayPalReqBody: createPayPalSessionReqBody,
    createAuthReqBody: createAuthReqBody,
    getPayPalTokenReqBody: createBillerTokenReqBody,
};
