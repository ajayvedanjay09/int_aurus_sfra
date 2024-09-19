'use strict';
var aurusCheckout = require('./aurusCheckout');
var scrollAnimate = require('base/components/scrollAnimate');
window.console.log('test.js file called ');
var appleWalletDiv = '<div class="apple-pay-button-with-text apple-pay-button-black-with-text" onclick="applePayButtonClicked()">' +
    '<span class="text"></span> <span class="logo"></span>' +
    '</div>';

function showApplePayButton() {
    HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
    const buttons = document.getElementsByClassName("apple-pay-button-black-with-text");
    for (let button of buttons) {
        button.className += "block";
    }
}

function applePayButtonClicked() {
    var paymentRequest = "";
    if ((Aurus.getSkipShippingAddress != null && Aurus.getSkipShippingAddress != undefined && Aurus.getSkipShippingAddress != "") && (Aurus.getSkipBillingAddress != null && Aurus.getSkipBillingAddress != "" && Aurus.getSkipBillingAddress != undefined)) {
        if (Aurus.getSkipShippingAddress == "1" && Aurus.getSkipBillingAddress == "1") {
            paymentRequest = {
                countryCode: Aurus.getPurchaseCountry,
                requiredBillingContactFields: ["postalAddress", "email", "name", "phone"],
                // requiredShippingContactFields: ["postalAddress","email", "name", "phone"],
                currencyCode: Aurus.getCurrencyCode,
                total: {
                    label: 'Estimated Order Total',
                    amount: parseFloat(Aurus.getOrderAmount).toFixed(2),
                },
                lineItems: Aurus.getLineItems,
                // shippingMethods :  Aurus.getShippingMethod,
                supportedNetworks: ['amex', 'discover', 'masterCard', 'visa', 'privateLabel', 'maestro', 'jcb'],
                merchantCapabilities: ['supports3DS'],

            };
        } else if (Aurus.getSkipShippingAddress == "0" && Aurus.getSkipBillingAddress == "1") {
            paymentRequest = {
                countryCode: Aurus.getPurchaseCountry,
                requiredBillingContactFields: ["postalAddress", "email", "name", "phone"],
                // requiredShippingContactFields: ["postalAddress", "email", "name", "phone"],
                currencyCode: Aurus.getCurrencyCode,
                // shippingType: "storePickup",
                shippingContact: {
                    phoneNumber: Aurus.getShippingAddress.phoneNumber,
                    emailAddress: Aurus.getShippingAddress.emailAddress,
                    givenName: Aurus.getShippingAddress.firstName,
                    familyName: Aurus.getShippingAddress.lastName,
                    addressLines: [Aurus.getShippingAddress.street, Aurus.getShippingAddress.street2],
                    locality: Aurus.getShippingAddress.city,
                    administrativeArea: Aurus.getShippingAddress.state,
                    postalCode: Aurus.getShippingAddress.postalCode,
                    countryCode: Aurus.getShippingAddress.countryCode,
                },
                // shippingContactEditingMode: "storePickup",
                total: {
                    label: 'Estimated Order Total',
                    amount: parseFloat(Aurus.getOrderAmount).toFixed(2),
                },
                lineItems: Aurus.getLineItems,
                shippingMethods: Aurus.getShippingMethod,
                supportedNetworks: ['amex', 'discover', 'masterCard', 'visa', 'privateLabel', 'maestro', 'jcb'],
                merchantCapabilities: ['supports3DS'],
            };
        } else if (Aurus.getSkipShippingAddress == "1" && Aurus.getSkipBillingAddress == "0") {
            paymentRequest = {
                countryCode: Aurus.getPurchaseCountry,
                requiredBillingContactFields: ["postalAddress", "email", "name", "phone"],
                // requiredShippingContactFields: ["postalAddress", "email", "name", "phone"],
                currencyCode: Aurus.getCurrencyCode,
                // shippingType: "storePickup",
                billingContact: {
                    phoneNumber: Aurus.getBillingAddress.phoneNumber,
                    emailAddress: Aurus.getBillingAddress.emailAddress,
                    givenName: Aurus.getBillingAddress.firstName,
                    familyName: Aurus.getBillingAddress.lastName,
                    addressLines: [Aurus.getBillingAddress.street, Aurus.getBillingAddress.street2],
                    locality: Aurus.getBillingAddress.city,
                    administrativeArea: Aurus.getBillingAddress.state,
                    postalCode: Aurus.getBillingAddress.postalCode,
                    countryCode: Aurus.getBillingAddress.countryCode,
                },
                // shippingContactEditingMode: "storePickup",
                total: {
                    label: 'Estimated Order Total',
                    amount: parseFloat(Aurus.getOrderAmount).toFixed(2),
                },
                lineItems: Aurus.getLineItems,
                // shippingMethods :  Aurus.getShippingMethod,
                supportedNetworks: ['amex', 'discover', 'masterCard', 'visa', 'privateLabel', 'maestro', 'jcb'],
                merchantCapabilities: ['supports3DS'],
            };
        } else if (Aurus.getSkipShippingAddress == "0" && Aurus.getSkipBillingAddress == "0") {
            paymentRequest = {
                countryCode: Aurus.getPurchaseCountry,
                requiredBillingContactFields: ["postalAddress", "email", "name", "phone"],
                // requiredShippingContactFields: ["postalAddress", "email", "name", "phone"],
                currencyCode: Aurus.getCurrencyCode,
                // shippingType: "storePickup",
                shippingContact: {
                    phoneNumber: Aurus.getShippingAddress.phoneNumber,
                    emailAddress: Aurus.getShippingAddress.emailAddress,
                    givenName: Aurus.getShippingAddress.firstName,
                    familyName: Aurus.getShippingAddress.lastName,
                    addressLines: [Aurus.getShippingAddress.street, Aurus.getShippingAddress.street2],
                    locality: Aurus.getShippingAddress.city,
                    administrativeArea: Aurus.getShippingAddress.state,
                    postalCode: Aurus.getShippingAddress.postalCode,
                    countryCode: Aurus.getShippingAddress.countryCode,
                },
                billingContact: {
                    phoneNumber: Aurus.getBillingAddress.phoneNumber,
                    emailAddress: Aurus.getBillingAddress.emailAddress,
                    givenName: Aurus.getBillingAddress.firstName,
                    familyName: Aurus.getBillingAddress.lastName,
                    addressLines: [Aurus.getBillingAddress.street, Aurus.getBillingAddress.street2],
                    locality: Aurus.getBillingAddress.city,
                    administrativeArea: Aurus.getBillingAddress.state,
                    postalCode: Aurus.getBillingAddress.postalCode,
                    countryCode: Aurus.getBillingAddress.countryCode,
                },
                // shippingContactEditingMode: "storePickup",
                total: {
                    label: 'Estimated Order Total',
                    amount: parseFloat(Aurus.getOrderAmount).toFixed(2),
                },
                lineItems: Aurus.getLineItems,
                shippingMethods: Aurus.getShippingMethod,
                supportedNetworks: ['amex', 'discover', 'masterCard', 'visa', 'privateLabel', 'maestro', 'jcb'],
                merchantCapabilities: ['supports3DS'],
            };
        }
    } else if ((Aurus.getSkipShippingAddress == null || Aurus.getSkipShippingAddress == undefined || Aurus.getSkipShippingAddress == "") && (Aurus.getSkipBillingAddress == null || Aurus.getSkipBillingAddress == "" || Aurus.getSkipBillingAddress == undefined)) {
        paymentRequest = {
            countryCode: Aurus.getPurchaseCountry,
            requiredBillingContactFields: ["postalAddress", "email", "name", "phone"],
            // requiredShippingContactFields: ["postalAddress","email", "name", "phone"],
            currencyCode: Aurus.getCurrencyCode,
            total: {
                label: 'Estimated Order Total',
                amount: parseFloat(Aurus.getOrderAmount).toFixed(2),
            },
            lineItems: Aurus.getLineItems,
            supportedNetworks: ['amex', 'discover', 'masterCard', 'visa', 'privateLabel', 'maestro', 'jcb'],
            merchantCapabilities: ['supports3DS'],

        };
    } else if ((Aurus.getSkipShippingAddress == null || Aurus.getSkipShippingAddress == undefined || Aurus.getSkipShippingAddress == "") || (Aurus.getSkipBillingAddress == null || Aurus.getSkipBillingAddress == "" || Aurus.getSkipBillingAddress == undefined)) {
        paymentRequest = {
            countryCode: Aurus.getPurchaseCountry,
            requiredBillingContactFields: ["postalAddress", "email", "name", "phone"],
            // requiredShippingContactFields: ["postalAddress","email", "name", "phone"],
            currencyCode: Aurus.getCurrencyCode,
            total: {
                label: 'Estimated Order Total',
                amount: parseFloat(Aurus.getOrderAmount).toFixed(2),
            },
            lineItems: Aurus.getLineItems,
            supportedNetworks: ['amex', 'discover', 'masterCard', 'visa', 'privateLabel', 'maestro', 'jcb'],
            merchantCapabilities: ['supports3DS'],

        };
        window.parent.postMessage("AurusScriptError=Invalid_Shipping or Billing Flag", '*');
    }
    if (Aurus.getSkipRequiredShippingContact == "1") {
        paymentRequest.requiredShippingContactFields = ["email", "phone"];
    } else {
        paymentRequest.requiredShippingContactFields = ["postalAddress", "email", "name", "phone"];
    }
    var session = new ApplePaySession(6, paymentRequest); // version 6

    session.oncancel = (event) => {
        try {
            window.parent.postMessage("AurusApplePayCancelEvent=ApplePayCancelEvent", '*');
        } catch (e) {
            //if (e instanceof ReferenceError) {}
        }
    };

    session.onvalidatemerchant = (event) => {
        var validationURL = event.validationURL;
        getApplePaySession(validationURL).then(function (response) {
            session.completeMerchantValidation(response);
        });
    };

    session.onshippingmethodselected = (event) => {
        var shippingMethodData = '';
        var selectedShippingMethod = event.shippingMethod;
        Aurus._selectedShippingMethod = selectedShippingMethod;
        selectedShippingMethod = JSON.parse(JSON.stringify(selectedShippingMethod));
        selectedShippingMethod.eventType = "shippingMethod";
        try {
            window.parent.postMessage("AurusApplePayEvent=" + JSON.stringify(selectedShippingMethod), '*');
        } catch (e) {
            //if (e instanceof ReferenceError) {}
        }
        window.addEventListener("message", function (e) {
            var data = e.data;
            if (data.startsWith('ApplePayUpdatedShippingMethod')) {
                var splt = data.split('=');
                shippingMethodData = JSON.parse(splt[1]);
                const promis = new Promise(function (resolve, reject) {
                    if (typeof shippingMethodData === 'object' && shippingMethodData != null && Object.keys(shippingMethodData).length !== 0) {
                        if (shippingMethodData.shippingMethods != undefined && shippingMethodData.shippingMethods != "" && shippingMethodData.shippingMethods != null) {
                            Aurus._shippingMethod = shippingMethodData.shippingMethods;
                        }
                        Aurus._orderAmount = parseFloat(shippingMethodData.order.order_amount.amount).toFixed(2);
                        Aurus._subTotal = parseFloat(shippingMethodData.order.item_total.amount).toFixed(2);
                        //   Aurus._discount = parseFloat(shippingMethodData.order.discounts.amount).toFixed(2);
                        Aurus._estimatedTax = parseFloat(shippingMethodData.order.tax_amount.amount).toFixed(2);
                        Aurus._shippingCost = parseFloat(shippingMethodData.order.shipping_amount.amount).toFixed(2);
                        Aurus._giftWrap = parseFloat(shippingMethodData.order.gift_wrap.amount).toFixed(2);
                        //    Aurus._coupon = parseFloat(shippingMethodData.order.coupon.amount).toFixed(2);
                        Aurus._lineItems = Aurus.importLineItems(shippingMethodData);
                        resolve(shippingMethodData);
                    } else {
                        reject(shippingMethodData);
                    }
                    // };
                })
                promis.then(function (resolveData) {
                    var shippingMethodUpdate = {
                        "newTotal": {
                            "label": "Estimated Order Total",
                            "amount": Aurus.getOrderAmount,
                            "type": "final"
                        },
                        "newLineItems": Aurus.getLineItems,
                    };
                    session.completeShippingMethodSelection(shippingMethodUpdate);
                }).catch(function (rejectData) {
                    console.log(rejectData)
                })
            }
        });
    };

    session.onshippingcontactselected = (event) => {
            var custdata;
            var selectedShippingContact = JSON.stringify(event.shippingContact);
            selectedShippingContact = JSON.parse(selectedShippingContact);
            selectedShippingContact.eventType = "shippingContact";
            try {
                window.parent.postMessage("AurusApplePayEvent=" + JSON.stringify(selectedShippingContact), '*');
            } catch (e) {
                //if (e instanceof ReferenceError) {}
            }
            window.addEventListener("message", function (e) {
                var data = e.data;
                if (data.startsWith('ApplePayUpdatedShippingContact')) {
                    var splt = data.split('=');
                    custdata = JSON.parse(splt[1]);
                    const promis = new Promise(function (resolve, reject) {
                        if (typeof custdata === 'object' && custdata != null && Object.keys(custdata).length !== 0) {
                            if (custdata.shippingMethods != undefined && custdata.shippingMethods != "" && custdata.shippingMethods != null) {
                                Aurus._shippingMethod = custdata.shippingMethods;
                            } else {
                                Aurus._shippingMethod = [];
                            }
                            Aurus._orderAmount = parseFloat(custdata.order.order_amount.amount).toFixed(2);
                            Aurus._subTotal = parseFloat(custdata.order.item_total.amount).toFixed(2);
                            //    Aurus._discount = parseFloat(custdata.order.discounts.amount).toFixed(2);
                            Aurus._estimatedTax = parseFloat(custdata.order.tax_amount.amount).toFixed(2);
                            Aurus._shippingCost = parseFloat(custdata.order.shipping_amount.amount).toFixed(2);
                            Aurus._giftWrap = parseFloat(custdata.order.gift_wrap.amount).toFixed(2);
                            //  Aurus._coupon = parseFloat(custdata.order.coupon.amount).toFixed(2);
                            Aurus._lineItems = Aurus.importLineItems(custdata);
                            resolve(custdata);
                        } else {
                            reject(custdata);
                        }
                    })
                    promis.then(function (resolveData) {
                        if (custdata.shippingMethods != undefined && custdata.shippingMethods != "" && custdata.shippingMethods != null) {
                            for (i = 0; i < custdata.shippingMethods.length; i++) {
                                if (JSON.stringify(custdata.shippingMethods[i].selected) == "true") {
                                    Aurus._selectedShippingMethod = custdata.shippingMethods[i];
                                }
                            }
                        }
                        if (custdata.shippingAllowed == 1) {
                            var paymentRequestUpdate = {
                                "newTotal": {
                                    "label": "Estimated Order Total",
                                    "amount": Aurus.getOrderAmount,
                                    "type": "final"
                                },
                                "newLineItems": Aurus.getLineItems,
                                "newShippingMethods": Aurus.getShippingMethod,
                            };
                            session.completeShippingContactSelection(paymentRequestUpdate);
                        } else {
                            var shippingErrorObj = [];
                            var errorCode = "shippingContactInvalid";
                            for (i = 0; i < custdata.ShippingContactError.length; i++) {
                                var errorField = custdata.ShippingContactError[i].errorField;
                                var errorMessage = custdata.ShippingContactError[i].errorMessage;
                                var objdata = new ApplePayError(errorCode, errorField, errorMessage);
                                shippingErrorObj.push(objdata);
                            }
                            var paymentRequestUpdate = {
                                "newTotal": {
                                    "label": "Estimated Order Total",
                                    "amount": Aurus.getOrderAmount,
                                    "type": "pending"
                                },
                                "newLineItems": [],
                                "errors": shippingErrorObj
                            };
                            session.completeShippingContactSelection(paymentRequestUpdate);
                        }
                    }).catch(function (rejectData) {
                        console.log(rejectData)
                    })
                }
            });
        },

        session.onpaymentauthorized = (event) => {
            var jsondata = {
                "billingContact": event.payment.billingContact,
                "shippingContact": event.payment.shippingContact
            };
            var contactData = JSON.stringify(jsondata);
            contactData = JSON.parse(contactData);
            contactData.eventType = "contactDetails";
            contactData = JSON.stringify(contactData);
            var cdata = onApplePayUpdatedContact(contactData);
            const promis = new Promise(function (resolve, reject) {
                if (typeof cdata === 'object' && cdata != null && Object.keys(cdata).length !== 0) {
                    resolve(cdata);
                } else {
                    reject(cdata);
                }
            })
            promis.then(function (resolveData) {
                if (cdata.ContactAllowed == "0" && cdata.shippingAllowed == "0" && cdata.billingAllowed == "0") {
                    var ErrorObj = [];
                    var shippingErrorCode = "shippingContactInvalid";
                    var billingErrorCode = "billingContactInvalid";
                    for (i = 0; i < cdata.ContactError.length; i++) {
                        var errorField = cdata.ContactError[i].errorField;
                        var errorMessage = cdata.ContactError[i].errorMessage;
                        var objdata = new ApplePayError(shippingErrorCode, errorField, errorMessage);
                        ErrorObj.push(objdata);
                    }
                    for (i = 0; i < cdata.ShippingContactError.length; i++) {
                        var errorField = cdata.ShippingContactError[i].errorField;
                        var errorMessage = cdata.ShippingContactError[i].errorMessage;
                        var objdata = new ApplePayError(shippingErrorCode, errorField, errorMessage);
                        ErrorObj.push(objdata);
                    }
                    for (i = 0; i < cdata.BillingContactError.length; i++) {
                        var errorField = cdata.BillingContactError[i].errorField;
                        var errorMessage = cdata.BillingContactError[i].errorMessage;
                        var objdata = new ApplePayError(billingErrorCode, errorField, errorMessage);
                        ErrorObj.push(objdata);
                    }
                    var applepayreq = {
                        status: ApplePaySession.STATUS_FAILURE,
                        errors: ErrorObj
                    };
                    session.completePayment(applepayreq);
                } else if (cdata.ContactAllowed == "0" && cdata.shippingAllowed == "0" && cdata.billingAllowed == "1") {
                    var ErrorObj = [];
                    var shippingErrorCode = "shippingContactInvalid";
                    var billingErrorCode = "billingContactInvalid";
                    for (i = 0; i < cdata.ContactError.length; i++) {
                        var errorField = cdata.ContactError[i].errorField;
                        var errorMessage = cdata.ContactError[i].errorMessage;
                        var objdata = new ApplePayError(shippingErrorCode, errorField, errorMessage);
                        ErrorObj.push(objdata);
                    }
                    for (i = 0; i < cdata.ShippingContactError.length; i++) {
                        var errorField = cdata.ShippingContactError[i].errorField;
                        var errorMessage = cdata.ShippingContactError[i].errorMessage;
                        var objdata = new ApplePayError(shippingErrorCode, errorField, errorMessage);
                        ErrorObj.push(objdata);
                    }
                    var applepayreq = {
                        status: ApplePaySession.STATUS_FAILURE,
                        errors: ErrorObj
                    };
                    session.completePayment(applepayreq);
                } else if (cdata.ContactAllowed == "0" && cdata.shippingAllowed == "1" && cdata.billingAllowed == "0") {
                    var ErrorObj = [];
                    var shippingErrorCode = "shippingContactInvalid";
                    var billingErrorCode = "billingContactInvalid";
                    for (i = 0; i < cdata.ContactError.length; i++) {
                        var errorField = cdata.ContactError[i].errorField;
                        var errorMessage = cdata.ContactError[i].errorMessage;
                        var objdata = new ApplePayError(shippingErrorCode, errorField, errorMessage);
                        ErrorObj.push(objdata);
                    }
                    for (i = 0; i < cdata.BillingContactError.length; i++) {
                        var errorField = cdata.BillingContactError[i].errorField;
                        var errorMessage = cdata.BillingContactError[i].errorMessage;
                        var objdata = new ApplePayError(billingErrorCode, errorField, errorMessage);
                        ErrorObj.push(objdata);
                    }
                    var applepayreq = {
                        status: ApplePaySession.STATUS_FAILURE,
                        errors: ErrorObj
                    };
                    session.completePayment(applepayreq);
                } else if (cdata.ContactAllowed == "1" && cdata.shippingAllowed == "0" && cdata.billingAllowed == "0") {
                    var ErrorObj = [];
                    var shippingErrorCode = "shippingContactInvalid";
                    var billingErrorCode = "billingContactInvalid";
                    for (i = 0; i < cdata.ShippingContactError.length; i++) {
                        var errorField = cdata.ShippingContactError[i].errorField;
                        var errorMessage = cdata.ShippingContactError[i].errorMessage;
                        var objdata = new ApplePayError(shippingErrorCode, errorField, errorMessage);
                        ErrorObj.push(objdata);
                    }
                    for (i = 0; i < cdata.BillingContactError.length; i++) {
                        var errorField = cdata.BillingContactError[i].errorField;
                        var errorMessage = cdata.BillingContactError[i].errorMessage;
                        var objdata = new ApplePayError(billingErrorCode, errorField, errorMessage);
                        ErrorObj.push(objdata);
                    }
                    var applepayreq = {
                        status: ApplePaySession.STATUS_FAILURE,
                        errors: ErrorObj
                    };
                    session.completePayment(applepayreq);
                } else if (cdata.ContactAllowed == "1" && cdata.shippingAllowed == "1" && cdata.billingAllowed == "0") {
                    var ErrorObj = [];
                    var shippingErrorCode = "shippingContactInvalid";
                    var billingErrorCode = "billingContactInvalid";

                    for (i = 0; i < cdata.BillingContactError.length; i++) {
                        var errorField = cdata.BillingContactError[i].errorField;
                        var errorMessage = cdata.BillingContactError[i].errorMessage;
                        var objdata = new ApplePayError(billingErrorCode, errorField, errorMessage);
                        ErrorObj.push(objdata);
                    }
                    var applepayreq = {
                        status: ApplePaySession.STATUS_FAILURE,
                        errors: ErrorObj
                    };
                    session.completePayment(applepayreq);
                } else if (cdata.ContactAllowed == "1" && cdata.shippingAllowed == "0" && cdata.billingAllowed == "1") {
                    var ErrorObj = [];
                    var shippingErrorCode = "shippingContactInvalid";
                    var billingErrorCode = "billingContactInvalid";

                    for (i = 0; i < cdata.ShippingContactError.length; i++) {
                        var errorField = cdata.ShippingContactError[i].errorField;
                        var errorMessage = cdata.ShippingContactError[i].errorMessage;
                        var objdata = new ApplePayError(shippingErrorCode, errorField, errorMessage);
                        ErrorObj.push(objdata);
                    }

                    var applepayreq = {
                        status: ApplePaySession.STATUS_FAILURE,
                        errors: ErrorObj
                    };
                    session.completePayment(applepayreq);
                } else if (cdata.ContactAllowed == "0" && cdata.shippingAllowed == "1" && cdata.billingAllowed == "1") {
                    var ErrorObj = [];
                    var shippingErrorCode = "shippingContactInvalid";
                    for (i = 0; i < cdata.ContactError.length; i++) {
                        var errorField = cdata.ContactError[i].errorField;
                        var errorMessage = cdata.ContactError[i].errorMessage;
                        var objdata = new ApplePayError(shippingErrorCode, errorField, errorMessage);
                        ErrorObj.push(objdata);
                    }
                    var applepayreq = {
                        status: ApplePaySession.STATUS_FAILURE,
                        errors: ErrorObj
                    };
                    session.completePayment(applepayreq);
                } else if (cdata.ContactAllowed == "1" && cdata.shippingAllowed == "1" && cdata.billingAllowed == "1") {
                    const payment = event.payment;
                    Aurus._applePayPaymetData = payment;
                    session.completePayment(ApplePaySession.STATUS_SUCCESS);
                } else if (cdata.ContactAllowed == "0") {
                    var contactErrorObj = [];
                    var errorCode = "shippingContactInvalid";
                    for (i = 0; i < cdata.ContactError.length; i++) {
                        var errorField = cdata.ContactError[i].errorField;
                        var errorMessage = cdata.ContactError[i].errorMessage;
                        var objdata = new ApplePayError(errorCode, errorField, errorMessage);
                        contactErrorObj.push(objdata);
                    }
                    var applepayreq = {
                        status: ApplePaySession.STATUS_FAILURE,
                        errors: contactErrorObj
                    };
                    session.completePayment(applepayreq);
                } else if (cdata.billingAllowed == "0") {
                    var ErrorObj = [];
                    var errorCode = "billingContactInvalid";
                    for (i = 0; i < cdata.BillingContactError.length; i++) {
                        var errorField = cdata.BillingContactError[i].errorField;
                        var errorMessage = cdata.BillingContactError[i].errorMessage;
                        var objdata = new ApplePayError(errorCode, errorField, errorMessage);
                        ErrorObj.push(objdata);
                    }
                    var applepayreq = {
                        status: ApplePaySession.STATUS_FAILURE,
                        errors: ErrorObj
                    };
                    session.completePayment(applepayreq);
                } else if (cdata.shippingAllowed == "0") {
                    var shippingErrorObj = [];
                    var errorCode = "shippingContactInvalid";
                    for (i = 0; i < cdata.ShippingContactError.length; i++) {
                        var errorField = cdata.ShippingContactError[i].errorField;
                        var errorMessage = cdata.ShippingContactError[i].errorMessage;
                        var objdata = new ApplePayError(errorCode, errorField, errorMessage);
                        shippingErrorObj.push(objdata);
                    }
                    var applepayreq = {
                        status: ApplePaySession.STATUS_FAILURE,
                        errors: shippingErrorObj
                    };
                    session.completePayment(applepayreq);
                }
                // else if(cdata.ContactAllowed == "1" &&  cdata.shippingAllowed == "1" ){
                //         const payment = event.payment;
                //         Aurus._applePayPaymetData = payment;
                //         session.completePayment(ApplePaySession.STATUS_SUCCESS);
                // }	
                // else if(cdata.ContactAllowed == "1" || cdata.shippingAllowed == "1" ){
                //         const payment = event.payment;
                //         Aurus._applePayPaymetData = payment;
                //         session.completePayment(ApplePaySession.STATUS_SUCCESS);
                //     }
            }).catch(function (rejectData) {
                console.log(rejectData)
            })
        };

    session.begin();

}

function getApplePaySession(url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        var createSessionUrl = Aurus._priEcstBaseURL;
        xhr.open('POST', createSessionUrl + 'createsessionApplePay');
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(JSON.parse(xhr.response));
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send("validationUrl=" + url);
    });
}

function authorize(token) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        var createAuthorizeUrl = jQuery("#priEcstBase_urlId").val();
        xhr.open('POST', createAuthorizeUrl + 'authorize');
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(token));
    });
}




var paypalCheckoutJs;
var jQuery;
var Aurus = {
    googlePayLoaded: false,
    klarnaClientToken: "",
    klarnaAuthToken: "",
    urlIndicator: "",
    klarnaPayMethodType: "",
    apiversion: "",
    priEcstBaseURL: "",
    secEcstBaseURL: "",
    ecstCdnURL: "",
    aurusSessionId: "",
    applePayPaymetData: "",
    orderAmount: "0.00",
    shippingCost: "0.00",
    subTotal: "0.00",
    discount: "0.00",
    estimatedTax: "0.00",
    shippingMethod: [],
    selectedShippingMethod: "",
    newOrdertotal: "0.00",
    newShippingCost: "0.00",
    giftWrap: "0.00",
    coupon: "0.00",
    ottResponseData: "",
    hostDomainURL: "",
    billerToken: "",
    PaypalOrderID: "",
    AltPaypal: "0",
    AltVenmo: "0",
    AltKlarna: "0",
    AltApplePay: "0",
    env: "",
    cid: "",
    currencyCode: "",
    purchaseCountry: "",
    billerFailed: false,
    sessionFailed: false,
    applePayAbort: false,
    walletID: "",
    checkOutData: "",
    shippingAddress: "",
    billingAddress: "",
    skipBillingAddressskipShippingAddress: "",
    skipBillingAddress: "",
    lineItems: "",
    additionalChargeIndicator: [],
    skipRequiredShippingContact: "",
    get getAdditionalChargeIndicator() {
        return this.additionalChargeIndicator;
    },
    set _additionalChargeIndicator(additionalChargeIndicator) {
        this.additionalChargeIndicator = additionalChargeIndicator;
    },
    get getLineItems() {
        return this.lineItems;
    },
    set _lineItems(lineItems) {
        this.lineItems = lineItems;
    },
    get getSkipShippingAddress() {
        return this.skipShippingAddress;
    },
    set _SkipShippingAddress(skipShippingAddress) {
        this.skipShippingAddress = skipShippingAddress;
    },
    get getSkipBillingAddress() {
        return this.skipBillingAddress;
    },
    set _SkipBillingAddress(skipBillingAddress) {
        this.skipBillingAddress = skipBillingAddress;
    },
    get getShippingAddress() {
        return this.shippingAddress;
    },
    set _ShippingAddress(shippingAddress) {
        this.shippingAddress = shippingAddress;
    },
    get getBillingAddress() {
        return this.billingAddress;
    },
    set _BillingAddress(billingAddress) {
        this.billingAddress = billingAddress;
    },
    get getalternatePaymentMatrix() {
        return JSON.parse(this.alternatePaymentMatrix);
    },
    set _AltPaypal(val) {
        this.AltPaypal = val;
    },
    get getAltPaypal() {
        return this.AltPaypal;
    },
    set _AltVenmo(val) {
        this.AltVenmo = val;
    },
    get getAltVenmo() {
        return this.AltVenmo;
    },
    set _AltKlarna(val) {
        this.AltKlarna = val;
    },
    get getAltKlarna() {
        return this.AltKlarna;
    },
    set _AltApplePay(val) {
        this.AltApplePay = val;
    },
    get getAltApplePay() {
        return this.AltApplePay;
    },
    get _apiversion() {
        return this.apiversion;
    },

    set _orderAmount(amt) {
        this.orderAmount = amt;
    },
    get getOrderAmount() {
        return this.orderAmount;
    },

    set _shippingCost(cost) {
        this.shippingCost = cost;
    },
    get getShippingCost() {
        return this.shippingCost;
    },
    set _newOrdertotal(val) {
        this.newOrdertotal = val;
    },
    get getNewOrdertotal() {
        return this.newOrdertotal;
    },
    set _newShippingCost(cost) {
        this.newShippingCost = cost;
    },
    get getNewShippingCost() {
        return this.newShippingCost;
    },

    set _selectedShippingMethod(val) {
        this.selectedShippingMethod = val;
    },
    get getSelectedShippingMethod() {
        return this.selectedShippingMethod;
    },
    set _subTotal(total) {
        this.subTotal = total;
    },
    get getSubTotal() {
        return this.subTotal;
    },

    set _discount(disc) {
        this.discount = disc;
    },
    get getDiscount() {
        return this.discount;
    },

    set _estimatedTax(eTax) {
        this.estimatedTax = eTax;
    },
    get getEstimatedTax() {
        return this.estimatedTax;
    },

    set _shippingMethod(smethod) {
        this.shippingMethod = smethod;
    },
    get getShippingMethod() {
        return this.shippingMethod;
    },

    set _currencyCode(val) {
        this.currencyCode = val;
    },
    get getCurrencyCode() {
        return this.currencyCode;
    },
    set _purchaseCountry(val) {
        this.purchaseCountry = val;
    },
    get getPurchaseCountry() {
        return this.purchaseCountry;
    },

    set _giftWrap(val) {
        this.giftWrap = val;
    },
    get getGiftWrap() {
        return this.giftWrap;
    },
    set _coupon(val) {
        this.coupon = val;
    },
    get getCoupon() {
        return this.coupon;
    },

    set _ottResponseData(ottResp) {
        this.ottResponseData = ottResp;
    },
    get getOttResponseData() {
        return this.ottResponseData;
    },
    set setKlarnaPayMethodType(setKlarnaPayMethodType) {
        this.klarnaPayMethodType = setKlarnaPayMethodType;
    },
    get getKlarnaPayMethodType() {
        return this.klarnaPayMethodType;
    },
    set _paypalData(pdata) {
        this.paypalCheckoutData = pdata;
    },
    set kct(kct) {
        this.klarnaClientToken = kct;
    },
    set kat(kat) {
        this.klarnaAuthToken = kat;
    },

    get getKlarnaClientToken() {
        return this.klarnaClientToken;
    },
    get getKlarnaAuthToken() {
        return this.klarnaAuthToken;
    },

    set _setEnv(data) {
        this.env = data;
    },
    get getEnv() {
        return this.env;
    },
    set _setCid(data) {
        this.cid = data;
    },
    get getCid() {
        return this.cid;
    },
    set _setBillerFailed(data) {
        this.billerFailed = data;
    },
    get getBillerFailed() {
        return this.billerFailed;
    },
    set _setWalletID(data) {
        this.walletID = data;
    },
    get getWalletID() {
        return this.walletID;
    },
    set _setSessionFailed(data) {
        this.sessionFailed = data;
    },
    get getSessionFailed() {
        return this.sessionFailed;
    },
    set _setApplePayAbort(data) {
        this.applePayAbort = data;
    },
    get getApplePayAbort() {
        return this.applePayAbort;
    },
    set _checkOutData(bToken) {
        this.checkOutData = bToken;
    },
    get getCheckOutData() {
        return this.checkOutData;
    },
    getcdate() {
        var now = new Date();
        return ('0' + (now.getMonth() + 1)).slice(-2) + '' + ('0' + now.getDate()).slice(-2) + '' + now.getFullYear();
    },

    getctime() {
        var now = new Date();
        return ('0' + now.getHours()).slice(-2) + '' + ('0' + (now.getMinutes())).slice(-2) + '' + ('0' + now.getSeconds()).slice(-2);
    },

    set _urlIndicator(_urlIndicator) {
        this.urlIndicator = _urlIndicator;
    },

    get getUrlIndicator() {
        return this.urlIndicator;
    },

    set _aurusSessionId(session) {
        this.aurusSessionId = session;
    },
    get getAurusSession() {
        return this.aurusSessionId;
    },
    get _priEcstBaseURL() {
        return this.priEcstBaseURL;
    },
    get _secEcstBaseURL() {
        return this.secEcstBaseURL;
    },
    get _ecstCdnURL() {
        return this.ecstCdnURL;
    },

    get _hostDomainURL() {
        return this.hostDomainURL;
    },
    get getSkipRequiredShippingContact() {
        return this.skipRequiredShippingContact;
    },
    set _skipRequiredShippingContact(skipRequiredShippingContact) {
        this.skipRequiredShippingContact = skipRequiredShippingContact;
    },

    aurusInit: function (custData, jquery) {
        window.console.log('custData:::::', custData);
        jQuery = jquery;
        Aurus._orderAmount = custData.order.order_amount.amount;
        Aurus._purchaseCountry = custData.order.purchaseCountry;
        Aurus._currencyCode = custData.order.purchaseCurrency;
        Aurus._aurusSessionId = custData.sessionId;
        Aurus._ShippingAddress = custData.customer.shipping_address;
        Aurus._BillingAddress = custData.customer.billing_address;
        Aurus._SkipShippingAddress = custData.customer.skipShippingAddress;
        Aurus._urlIndicator = custData.apmMatrix;
        Aurus._skipRequiredShippingContact = custData.customer.skipRequiredShippingContact;
        Aurus._setEnv = custData.env.toLowerCase();
        Aurus._setCid = custData.aurusClientId;
        if (this.getEnv == "live" || this.getEnv == "sandbox") {
            if (this.getEnv == "live") {
                Aurus.priEcstBaseURL = "https://pecst03.aurusepay.com/storeservices/ecom/";
                Aurus.secEcstBaseURL = "https://ecst03.auruspay.com/storeservices/ecom/";
                Aurus.ecstCdnURL = "https://pecst03.aurusepay.com/storeservices/";
                Aurus.hostDomainURL = "?d1=es43.auruspay.com&d2=es03.auruspay.com";
            } else if (this.getEnv == "sandbox") {
                Aurus.priEcstBaseURL = "https://uatps48.aurusepay.com/storeservices/ecom/";
                Aurus.secEcstBaseURL = "https://uatps48.aurusepay.com/storeservices/ecom/";
                Aurus.ecstCdnURL = "https://uatps48.aurusepay.com/storeservices/";
                Aurus.hostDomainURL = "?d1=uat42.auruspay.com&d2=uat42.auruspay.com";
            } else {
                window.parent.postMessage("AurusScriptError=Invalid_Environment", '*');
            }

            if (((this.getUrlIndicator).charAt(6) == '1') && (jQuery("#applepayDiv").length)) {
                jQuery(".apple-pay-button-with-text").attr("style", "display:block");
                this.enableApplePay(custData);
            } else {}

            if (((this.getUrlIndicator).charAt(14) == '1') && (jQuery("#venmoDiv").length)) {
                if (!jQuery('#venmoDiv').children().length > 0) {
                    jQuery("#venmoDiv").empty();
                    this.initVenmo();
                }
            } else {}

            if (((this.getUrlIndicator).charAt(3) == '1') && (jQuery("#paypalDiv").length)) {

                if (!jQuery('#paypalDiv').children().length > 0) {
                    jQuery("#paypalDiv").empty();
                    this.importPaypalURL(custData);

                } else {
                    //paypalCheckoutJs = true;
                    this.importPaypalURL(custData);
                }
                this.initPayPal(custData);
            } else {}

            if (((this.getUrlIndicator).charAt(13) == '1') && (jQuery("#klarnaDiv").length)) {
                jQuery("#klarnaDiv").empty();
                this.enableKlarna(custData);
            } else {}


            if (((this.getUrlIndicator).charAt(10) == '1') && (jQuery("#googlepayDiv").length)) {
                this.initGooglePay(custData);
            } else {
                console.log("GooglePay not Suppoerted");
            }

        } else {
            window.parent.postMessage("AurusScriptError=Invalid_Environment", '*');
        }

    },

    /* Google Pay Starts here*/

    googleGatewayId: "",
    googleMerchantId: "",
    googlePayPaymentData: "",

    set _googleGatewayId(gatewayId) {
        this.googleGatewayId = gatewayId;
    },
    get getGoogleGatewayId() {
        return this.googleGatewayId;
    },

    set _googleMerchantId(merchantId) {
        this.googleMerchantId = merchantId;
    },
    get getGoogleMerchantId() {
        return this.googleMerchantId;
    },
    set _gPayPaymetData(gpaydata) {
        this.googlePayPaymentData = gpaydata;
        Aurus._setWalletID = "11";
        Aurus.initWalletToken();
    },

    get gPayPaymetData() {
        return this.googlePayPaymentData;
    },

    initGooglePay: function (custData) {

        if (!jQuery('#googlepayDiv').children().length > 0) {
            var wAreaId = document.getElementById('googlepayDiv');
            wAreaId.innerHTML = ''
            var gPayDiv = document.createElement("div");
            gPayDiv.setAttribute("id", "aurus-google-pay-containerId");
            //gPayDiv.setAttribute("class", "aurus-sezzel-checkout");
            wAreaId.appendChild(gPayDiv);
        }
        //  if (jQuery("#googlePayDiv_Bottom").length) {
        //      if (!jQuery('#googlePayDiv_Bottom').children().length > 0) {
        //          var wAreaId = document.getElementById('googlePayDiv_Bottom');
        //          wAreaId.innerHTML = ''
        //          var gPayDiv = document.createElement("div");
        //          gPayDiv.setAttribute("id", "aurus-google-pay-containerId-bottom");
        //          gPayDiv.setAttribute("class", "aurus-sezzel-checkout");
        //          wAreaId.appendChild(gPayDiv);
        //      }
        //  }
        //Aurus._googleGatewayId="auruspay";
        //Aurus._googleMerchantId="22731101231178566";
        if (!Aurus.googlePayLoaded) {
            Aurus.importGooglePayurl();
            Aurus.googlePayLoaded = true; // Set the flag to true after loading
        }
    },

    importGooglePayurl: function () {

        let googlePayPaymentJS = document.createElement('script');
        googlePayPaymentJS.setAttribute("type", "text/javascript")
        googlePayPaymentJS.setAttribute("src", "https://pay.google.com/gp/p/js/pay.js")

        googlePayPaymentJS.onload = function () {
            onGooglePayLoaded();
        };
        document.head.append(googlePayPaymentJS);
    },

    initWalletToken: function () {

        var tokenReqdata = Aurus.getHostRequestJSON(Aurus.buildGooglePaySessionTokenRequestJson());
        Aurus.getSessionTokenPrimary(tokenReqdata, Aurus.googlepaySessionTokenResponseHandler);
    },

    buildGooglePaySessionTokenRequestJson: function () {
        //  alert("inside getBillerTokenRequestJson");
        var gPayTokenJson = "";
        gPayTokenJson = {
            "4.20": "840",
            "4.21": "840",
            "12.63": Aurus.aurusSessionId,
            "12.88": "1",
            "4.36": "28",
            "12.89": Aurus.getWalletID,
            "3.21": Aurus._apiversion,
            "12.90": this.toHex(Aurus.googlePayPaymentData),
            "1.1": "",
            "1.2": "",
            "2.1": "C0N43N4U45RLN8R1",
            "1.3": "",
            "1.4": Aurus.getCid,
            "2.2": "EE928BC346F8",
            "3.1": "8",
            "2.3": Aurus.srcIPAddress,
            "4.1": "132",
            "4.2": "000018",
            "3.4": "00",
            "3.5": "1.0",
            "3.6": "1.0",
            "3.8": "1",
            "4.18": this.getcdate(),
            "4.19": this.getctime()
        };

        return JSON.stringify(gPayTokenJson);
    },

    googlepaySessionTokenResponseHandler: function (data) {
        if (data.response_code == "00000" && data.response_text == "APPROVED") {
            //   Aurus.blankToken();
            digitalWalletResponseHandler(buildMerchantResponseJson(data));
        } else {
            //  Aurus.blankToken();
            Aurus._setSessionFailed = true;
            Aurus._setWalletID = "11";
            digitalWalletResponseHandler(buildMerchantResponseJson(data));
        }
    },

    /* Google Pay Ends hete */

    set _applePayPaymetData(applepayToken) {
        this.applePayPaymetData = applepayToken;
        Aurus.initappleWalletToken();
    },
    get getapplePayPaymetData() {
        return this.applePayPaymetData;
    },
    set _billerToken(bToken) {
        this.billerToken = bToken;
    },
    get geBillerToken() {
        return this.billerToken;
    },
    set _PaypalOrderID(orderID) {
        this.PaypalOrderID = orderID;
    },
    get getPaypalOrderID() {
        return this.PaypalOrderID;
    },

    enableKlarna: function (custData) {
        Aurus.setKlarnaPayMethodType = custData.paymentMethod;
        Aurus._setWalletID = "14",
            this.createKlarnaContainer(); // creating container for KlarnaPay
        var klarnaCustData = this.getCustInfoForKlarna(custData); // creating custDataObj for KlarnaPay
        this.getBillerToken(klarnaCustData, this.klarnaPayBillerTokenResponseHandler); // get client token, pay-Method-Type

    },

    createKlarnaContainer: function () {
        if (jQuery('#klarnaDiv').is(':empty')) {
            var klarnaContainer = document.createElement("div");
            klarnaContainer.setAttribute("id", "klarna_container");
            klarnaContainer.setAttribute("style", "width: 100%;");
            document.getElementById('klarnaDiv').appendChild(klarnaContainer);
        }
    },

    getCustInfoForPaypal: function (custData) {
        var consumerData;
        if (custData.customer.skipShippingAddress == 1) {
            consumerData = {
                "intent": custData.order.intent,
                "processing_instruction": "ORDER_SAVED_EXPLICITLY",
                "purchase_units": [{
                    "amount": {
                        "currency_code": custData.order.order_amount.currency,
                        "value": custData.order.order_amount.amount,
                    },
                    "invoice_number": custData.order.invoiceNumber,
                    "soft_descriptor": custData.order.softDescriptor
                }]
            };
        } else {
            consumerData = {
                "intent": custData.order.intent,
                "processing_instruction": "ORDER_SAVED_EXPLICITLY",

                "purchase_units": [{
                    "amount": {
                        "currency_code": custData.order.order_amount.currency,
                        "value": custData.order.order_amount.amount,
                    },
                    "invoice_number": custData.order.invoiceNumber,
                    "soft_descriptor": custData.order.softDescriptor,
                    "shipping": {
                        "name": {
                            "full_name": custData.customer.shipping_address.firstName.trim() + " " + custData.customer.shipping_address.lastName.trim()
                        },
                        "address": {
                            "address_line_1": custData.customer.shipping_address.street,
                            "address_line_2": custData.customer.shipping_address.street2,
                            "admin_area_2": custData.customer.shipping_address.city,
                            "admin_area_1": custData.customer.shipping_address.state,
                            "postal_code": custData.customer.shipping_address.postalCode,
                            "country_code": custData.customer.shipping_address.countryCode
                        }
                    }
                }]
            };
            if (custData.customer.isShippingPreference == 1) {
                consumerData.application_context = {
                    "shipping_preference": "SET_PROVIDED_ADDRESS"
                }
            }
        }
        console.log('consumerData===', consumerData);
        return consumerData;
    },


    getCustInfoForKlarna: function (custData) {
        var consumerData = {
            "purchase_country": "" + custData.order.purchaseCountry + "",
            "purchase_currency": "" + custData.order.purchaseCurrency + "",
            "locale": "" + custData.order.locale + "",
            "order_amount": "" + custData.order.order_amount.amount + "",
            "order_tax_amount": "" + custData.order.tax_amount.amount + "",
            "order_lines": [],
            "billing_address": {
                "given_name": custData.customer.billing_address.firstName,
                "family_name": custData.customer.billing_address.lastName,
                "email": custData.customer.billing_address.emailAddress,
                "street_address": custData.customer.billing_address.street,
                "street_address2": custData.customer.billing_address.street2,
                "postal_code": custData.customer.billing_address.postalCode,
                "city": custData.customer.billing_address.city,
                "region": custData.customer.billing_address.state,
                "phone": custData.customer.billing_address.phoneNumber,
                "country": custData.customer.billing_address.countryCode
            }
        }
        if ((custData.isBopis != "" && custData.isBopis != undefined && custData.isBopis != null) || (custData.isBopac != "" && custData.isBopac != undefined && custData.isBopac != null)) {
            if (custData.isBopis == "0" && custData.isBopac == "0") {
                var shipping_address = {
                    "given_name": custData.customer.shipping_address.firstName,
                    "family_name": custData.customer.shipping_address.lastName,
                    "email": custData.customer.shipping_address.emailAddress,
                    "street_address": custData.customer.shipping_address.street,
                    "street_address2": custData.customer.shipping_address.street2,
                    "postal_code": custData.customer.shipping_address.postalCode,
                    "city": custData.customer.shipping_address.city,
                    "region": custData.customer.shipping_address.state,
                    "phone": custData.customer.shipping_address.phoneNumber,
                    "country": custData.customer.shipping_address.countryCode
                }
                consumerData.shipping_address = shipping_address;
            }
        } else {
            var shipping_address = {
                "given_name": custData.customer.shipping_address.firstName,
                "family_name": custData.customer.shipping_address.lastName,
                "email": custData.customer.shipping_address.emailAddress,
                "street_address": custData.customer.shipping_address.street,
                "street_address2": custData.customer.shipping_address.street2,
                "postal_code": custData.customer.shipping_address.postalCode,
                "city": custData.customer.shipping_address.city,
                "region": custData.customer.shipping_address.state,
                "phone": custData.customer.shipping_address.phoneNumber,
                "country": custData.customer.shipping_address.countryCode
            }
            consumerData.shipping_address = shipping_address;
        }


        for (var i = 0; i < (custData.order.items.length); i++) {
            var obj = {
                "reference": "" + custData.order.items[i].reference + "",
                "quantity": custData.order.items[i].quantity,
                "total_amount": custData.order.items[i].totalAmount,
                "name": "" + custData.order.items[i].name + "",
                "total_discount_amount": custData.order.items[i].totalDiscountAmount,
                "total_tax_amount": custData.order.items[i].totalTaxAmount,
                "type": "" + custData.order.items[i].type + "",
                "unit_price": custData.order.items[i].price.amount,
                "tax_rate": custData.order.items[i].taxRate
            }
            consumerData['order_lines'].push(obj);

        }

        if (custData.store_pickup) {
            var shippingMethod = "";
            if ((custData.isBopis != "" && custData.isBopis != undefined && custData.isBopis != null) || (custData.isBopac != "" && custData.isBopac != undefined && custData.isBopac != null)) {
                if (custData.isBopis == "1") {
                    shippingMethod = "store pick-up"
                } else if (custData.isBopac == "1") {
                    shippingMethod = "pick-up point"
                } else if (custData.isBopac == "1" && custData.isBopis == "1") {
                    shippingMethod = "store pick-up";
                } else {
                    shippingMethod = "";
                }
            } else {
                shippingMethod = ""
            }
            var attachment = {
                "content_type": "application/vnd.klarna.internal.emd-v2+json",
                "body": {
                    "other_delivery_address": [{
                        "shipping_method": shippingMethod,
                        "shipping_type": "normal",
                        "first_name": custData.customer.billing_address.firstName,
                        "last_name": custData.customer.billing_address.lastName,
                        "street_address": custData.store_pickup.street_address,
                        "street_number": custData.store_pickup.street_number,
                        "postal_code": custData.store_pickup.postal_code,
                        "city": custData.store_pickup.city,
                        "country": custData.store_pickup.country,

                    }]
                }

            }
            if (shippingMethod != "") {
                consumerData.attachment = attachment;
            }
        }
        return consumerData;
    },

    getBillerToken: function (custData, responseHandler) {
        var url = Aurus._priEcstBaseURL + "altbillertoken" + Aurus._hostDomainURL;
        var requestData = Aurus.getHostRequestJSON(Aurus.buildBillerRequestPayload(custData));
        this.ajaxCall(requestData, url, responseHandler);
    },

    buildBillerRequestPayload: function (custData) {
        var payload = {
            "1.1": "",
            "1.2": "",
            "1.3": "",
            "1.4": Aurus.getCid,
            "4.1": "130",
            "12.73": "1",
            "12.63": Aurus.getAurusSession,
            "4.36": "33",
            "4.15": "1",
            "12.89": Aurus.getWalletID,
            "3.21": Aurus._apiversion,
            "12.90": this.toHex(JSON.stringify(custData)),
            "2.1": "C0N43N4U45RLN8R1",
            "12.102": "4",
            "2.2": "000C29BFD6C0",
            "2.3": Aurus.srcIPAddress,
            "4.18": this.getcdate(),
            "4.19": this.getctime()
        };
        return JSON.stringify(payload);

    },


    ajaxCall: function (requestData, url, responseHandler) {
        jQuery.ajax({
            url: url,
            async: false,
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: requestData,
            success: function (data) {
                responseHandler(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {}
        });
    },
    enableApplePay: function (custData) {
        this.initApplePay(custData);
    },

    initApplePay: function (custData) {
        if (window.ApplePaySession) {
            if (ApplePaySession.canMakePayments) {
                if (!!document.getElementById("applepayDiv")) {
                    document.getElementById("applepayDiv").innerHTML = "";
                    document.getElementById("applepayDiv").insertAdjacentHTML('afterbegin', appleWalletDiv);
                } else {}

                if (!!document.getElementById("applepayDiv_Bottom")) {
                    document.getElementById("applepayDiv_Bottom").innerHTML = "";
                    document.getElementById("applepayDiv_Bottom").insertAdjacentHTML('afterbegin', appleWalletDiv);
                }
                showApplePayButton();
            }
        } else {}

        // Aurus._lineItems =this.importLineItems(custData);
        Aurus._orderAmount = parseFloat(custData.order.order_amount.amount).toFixed(2);
        Aurus._shippingCost = parseFloat(custData.order.shipping_amount.amount).toFixed(2);
        Aurus._subTotal = parseFloat(custData.order.item_total.amount).toFixed(2);
        //  Aurus._discount = parseFloat(custData.order.discounts.amount).toFixed(2);
        Aurus._estimatedTax = parseFloat(custData.order.tax_amount.amount).toFixed(2);
        if (custData.shippingMethods != undefined && custData.shippingMethods != "" && custData.shippingMethods != null) {
            Aurus._shippingMethod = custData.shippingMethods;
        }
        Aurus._giftWrap = parseFloat(custData.order.gift_wrap.amount).toFixed(2);
        //  Aurus._coupon = parseFloat(custData.order.coupon.amount).toFixed(2);
        Aurus.importApplePayurl();
        Aurus._lineItems = this.importLineItems(custData);
        Aurus.checkBillingAddress(custData);
    },

    checkBillingAddress: function (custData) {
        if (Aurus.getBillingAddress != "" && Aurus.getBillingAddress != null && Aurus.getBillingAddress != undefined) {
            if (
                (Aurus.getBillingAddress.firstName != "" && Aurus.getBillingAddress.lastName != "" && Aurus.getBillingAddress.emailAddress != "" && Aurus.getBillingAddress.phoneNumber != "" && Aurus.getBillingAddress.street != "" && Aurus.getBillingAddress.city != "" && Aurus.getBillingAddress.state != "" && Aurus.getBillingAddress.postalCode != "" && Aurus.getBillingAddress.countryCode != "") &&
                (Aurus.getBillingAddress.firstName != null && Aurus.getBillingAddress.lastName != null && Aurus.getBillingAddress.emailAddress != null && Aurus.getBillingAddress.phoneNumber != null && Aurus.getBillingAddress.street != null && Aurus.getBillingAddress.city != null && Aurus.getBillingAddress.state != null && Aurus.getBillingAddress.postalCode != null && Aurus.getBillingAddress.countryCode != null) &&
                (Aurus.getBillingAddress.firstName != undefined && Aurus.getBillingAddress.lastName != undefined && Aurus.getBillingAddress.emailAddress != undefined && Aurus.getBillingAddress.phoneNumber != undefined && Aurus.getBillingAddress.street != undefined && Aurus.getBillingAddress.city != undefined && Aurus.getBillingAddress.state != undefined && Aurus.getBillingAddress.postalCode != undefined && Aurus.getBillingAddress.countryCode != undefined)
            ) {
                Aurus._SkipBillingAddress = "0";
            } else {
                Aurus._SkipBillingAddress = "1";
            }
        } else {
            Aurus._SkipBillingAddress = "1";
        }
    },

    importLineItems: function (custData) {
        var lineItems = '';
        if (custData.order.coupon != null && custData.order.coupon != undefined && custData.order.discounts != null && custData.order.discounts != undefined) {
            Aurus._discount = parseFloat(custData.order.discounts.amount).toFixed(2);
            Aurus._coupon = parseFloat(custData.order.coupon.amount).toFixed(2);
            lineItems = [{
                    "label": "Subtotal",
                    "amount": Aurus.getSubTotal,
                    "type": "final"
                },
                {
                    "label": "Gift Wrap",
                    "amount": Aurus.getGiftWrap,
                    "type": "final"
                },
                {
                    "label": "Coupon",
                    "amount": Aurus.getCoupon,
                    "type": "final"
                },
                {
                    "label": "Discount",
                    "amount": Aurus.getDiscount,
                    "type": "final"
                },
                {
                    "label": "Shipping",
                    "amount": Aurus.getShippingCost,
                    "type": "final"
                },
                {
                    "label": "Estimated Tax",
                    "amount": Aurus.getEstimatedTax,
                    "type": "final"
                },
            ];
        } else {

            lineItems = [{
                    "label": "Subtotal",
                    "amount": Aurus.getSubTotal,
                    "type": "final"
                },
                {
                    "label": "Gift Wrap",
                    "amount": Aurus.getGiftWrap,
                    "type": "final"
                },
                {
                    "label": "Shipping",
                    "amount": Aurus.getShippingCost,
                    "type": "final"
                },
                {
                    "label": "Estimated Tax",
                    "amount": Aurus.getEstimatedTax,
                    "type": "final"
                },
            ];

        }

        if (custData.order.items != "" && custData.order.items != undefined && custData.order.items != null) {
            var jObj = [];
            for (i = 0; i < custData.order.items.length; i++) {
                var obj;
                if (custData.order.items[i].additionalChargeIndicator == "1") {
                    obj = {
                        "label": custData.order.items[i].name,
                        "amount": custData.order.items[i].totalAmount,
                    }
                    lineItems.push(obj);
                    jObj.push(obj);
                }
            }
            Aurus._additionalChargeIndicator = jObj;
            // lineItems.push(jObj);
        }

        return lineItems;
    },

    importApplePayurl: function () {

        var applePayCss = document.getElementsByTagName('head')[0];
        var csslink = document.createElement('link');
        csslink.rel = 'stylesheet';
        csslink.type = 'text/css';
        csslink.href = Aurus._ecstCdnURL + 'css/applePayLbrands.css';
        csslink.media = 'all';
        applePayCss.appendChild(csslink);
    },
    getApplePayRequestJson: function () {
        var gPayTokenJson = "";
        gPayTokenJson = {
            "4.20": "840",
            "4.21": "840",
            "12.63": Aurus.aurusSessionId,
            "12.88": "1",
            "12.89": "7",
            "3.21": Aurus._apiversion,
            "12.90": this.toHex(JSON.stringify(Aurus.applePayPaymetData)),
            "1.1": "",
            "1.2": "",
            "2.1": "C0N43N4U45RLN8R1",
            "1.3": "",
            "1.4": Aurus.getCid,
            "2.2": "EE928BC346F8",
            "3.1": "8",
            "2.3": Aurus.srcIPAddress,
            "4.1": "132",
            "4.2": "000018",
            "3.4": "00",
            "3.5": "1.0",
            "3.6": "1.0",
            "3.8": "1",
            "4.18": this.getcdate(),
            "4.19": this.getctime()
        };

        return JSON.stringify(gPayTokenJson);

    },
    initappleWalletToken: function () {
        var url = Aurus._priEcstBaseURL + 'altsessiontoken' + Aurus._hostDomainURL;
        var requestData = Aurus.getHostRequestJSON(Aurus.getApplePayRequestJson());
        this.ajaxCall(requestData, url, Aurus.applepayTokenResponseHandler);
    },
    applepayTokenResponseHandler: function (data) {
        if (data.response_code == "00000" && data.response_text == "APPROVAL") {
            Aurus.blankToken();
            Aurus._setWalletID = "7";
            digitalWalletResponseHandler(buildMerchantResponseJson(data));
        } else {
            Aurus.blankToken();
            Aurus._setWalletID = "7";
            Aurus._setSessionFailed = true;
            digitalWalletResponseHandler(buildMerchantResponseJson(data));
        }



    },
    klarnaPayBillerTokenResponseHandler: function (data) {
        if (data.response_code == "00000" && data.response_text == "APPROVAL") {
            Aurus.kct = data.billerToken;
            Aurus.renderKlarnaElements();
        } else {
            Aurus._setBillerFailed = true;
            Aurus._setWalletID = "14",
                digitalWalletResponseHandler(buildMerchantResponseJson(data));
        }


    },

    renderKlarnaElements: function () {
        var importscript = document.createElement('script');
        importscript.setAttribute("type", "text/javascript");
        importscript.setAttribute("src", "https://x.klarnacdn.net/kp/lib/v1/api.js");
        document.getElementsByTagName("head")[0].appendChild(importscript);
        if (jQuery("#klarnaButtonDiv_Top").length) {
            jQuery("#KlarnaButton").remove();
            var klarnaButtonDiv = document.createElement("div");
            klarnaButtonDiv.setAttribute("style", "width: 100%;");
            klarnaButtonDiv.setAttribute("id", "KlarnaButton");
            document.getElementById('klarnaButtonDiv_Top').appendChild(klarnaButtonDiv);

            var klarnaButton = document.createElement("button");
            klarnaButton.setAttribute("class", "authorize");
            klarnaButton.setAttribute("style", " height: 50px;  background-color: #000000; color: white;  border: none; width: 100%; ");
            klarnaButtonDiv.appendChild(klarnaButton);

            var firstTXT = document.createElement("span");
            firstTXT.setAttribute("class", "Span");
            firstTXT.innerHTML = 'Buy with ';
            klarnaButton.appendChild(firstTXT);

            var secTXT = document.createElement("img");
            secTXT.setAttribute("class", "img");
            secTXT.setAttribute("style", "width: 56px;margin-bottom: 0px;");
            secTXT.setAttribute("src", Aurus._ecstCdnURL + "images/klarna.svg");
            klarnaButton.appendChild(secTXT);

            // var KlarnaLegalText_Lbrands = document.createElement("label");
            // KlarnaLegalText_Lbrands.setAttribute("class", "KLARNA_Legal_Text");
            // KlarnaLegalText_Lbrands.innerHTML = "By clicking Buy with Klarna.I am instructing Victoria's Secret to send my order and billing information to Klarna and understand that information will be subjected to the Klarna Terms and Klarna Privacy Policy";
            // KlarnaLegalText_Lbrands.setAttribute("style", "width: 100%;");
            // klarnaButtonDiv.appendChild(KlarnaLegalText_Lbrands);
        }
        if (jQuery("#klarnaButtonDiv_Bottom").length) {
            if (jQuery('#klarnaButtonDiv_Bottom').is(':empty')) {
                var klarnaButtonDiv = document.createElement("div");
                klarnaButtonDiv.setAttribute("style", "width: 100%;");
                document.getElementById('klarnaButtonDiv_Bottom').appendChild(klarnaButtonDiv);

                var klarnaButton = document.createElement("button");
                klarnaButton.setAttribute("class", "authorize");
                klarnaButton.setAttribute("style", " height: 50px;  background-color: #000000; color: white;  border: none; width: 100%; ");
                klarnaButtonDiv.appendChild(klarnaButton);

                var firstTXT = document.createElement("span");
                firstTXT.setAttribute("class", "Span");
                firstTXT.innerHTML = 'Buy with ';
                klarnaButton.appendChild(firstTXT);

                var secTXT = document.createElement("img");
                secTXT.setAttribute("class", "img");
                secTXT.setAttribute("style", "width: 56px;margin-bottom: 0px;");
                secTXT.setAttribute("src", Aurus._ecstCdnURL + "images/klarna.svg");
                klarnaButton.appendChild(secTXT);

                var KlarnaLegalText_Lbrands = document.createElement("label");
                KlarnaLegalText_Lbrands.setAttribute("class", "KLARNA_Legal_Text");
                KlarnaLegalText_Lbrands.innerHTML = "By clicking Buy with Klarna.I am instructing Victoria's Secret to send my order and billing information to Klarna and understand that information will be subjected to the Klarna Terms and Klarna Privacy Policy";
                KlarnaLegalText_Lbrands.setAttribute("style", "width: 100%;");
                klarnaButtonDiv.appendChild(KlarnaLegalText_Lbrands);
            }
        }

    },
    PayPalBillerTokenResponseHandler: function (data) {
        if (data.response_code == "00000" && data.response_text == "APPROVAL") {
            Aurus._PaypalOrderID = data.billerToken;

        } else {
            Aurus._setBillerFailed = true;
            Aurus._setWalletID = "4",
                digitalWalletResponseHandler(buildMerchantResponseJson(data));
        }

    },
    buildPayPalSessionTokenRequestJson: function () {
        var paypalJson = {
            "cartId": Aurus.getAurusSession,
            "walletAuthToken": Aurus.PaypalOrderID
        };
        var payload = {
            "12.63": Aurus.getAurusSession,
            "12.88": "1",
            "12.89": "4",
            "12.102": "4",
            "3.21": Aurus._apiversion,
            "12.90": this.toHex(JSON.stringify(paypalJson)),
            "12.97": "T1824667292",
            "1.1": "",
            "1.2": "",
            "2.1": "0000000",
            "3.1": "8",
            "1.3": "",
            "1.4": Aurus.getCid,
            "2.2": "0000000",
            "2.3": Aurus.srcIPAddress,
            "4.1": "132",
            "4.2": "000036",
            "3.4": "00",
            "3.5": "1.0",
            "3.6": "1.0",
            "3.8": "1",
            "4.18": this.getcdate(),
            "4.19": this.getctime(),
            "12.71": Aurus.ecomUrlType,
            "12.132": Aurus.pageType

        };
        return JSON.stringify(payload);
    },
    paypalSessionTokenResponseHandler: function (data) {
        if (data.response_code == "00000" && data.response_text == "APPROVED") {
            Aurus.blankToken();
            digitalWalletResponseHandler(buildMerchantResponseJson(data));
        } else {
            Aurus.blankToken();
            Aurus._setSessionFailed = true;
            Aurus._setWalletID = "4";
            digitalWalletResponseHandler(buildMerchantResponseJson(data));
        }

    },
    blankToken: function () {
        Aurus._PaypalOrderID = "";
        Aurus.kct = "";
        Aurus.vct = "";
        Aurus.applePayPaymetData = "";
    },
    klarnaAuthTokenHandler: function (response) {
        if (response.approved == true) {
            Aurus.kat = response.authorization_token;
            this.getSessionToken(Aurus.getKlarnaAuthToken, this.klarnaPaySessionTokenResponseHandler);
        }
    },

    getSessionToken: function (token, responseHandler) {
        var url = Aurus._priEcstBaseURL + "altsessiontoken" + Aurus._hostDomainURL;
        var requestData = Aurus.getHostRequestJSON(Aurus.buildSessionTokenRequestPayload(token));
        this.ajaxCall(requestData, url, responseHandler);

    },


    buildSessionTokenRequestPayload: function (ecomToken) {
        var ecomTokenJson = {
            "walletAuthToken": ecomToken
        };
        var payload = {
            "12.97": "",
            "4.11": "",
            "12.74": "",
            "12.98": "",
            "3.21": Aurus._apiversion,
            "12.90": this.toHex(JSON.stringify(ecomTokenJson)),
            "12.71": "",
            "12.102": "0",
            "12.109": "",
            "4.20": "840",
            "6.45": "Sample for klarnapay",
            "4.21": "840",
            "12.85": "",
            "12.63": Aurus.getAurusSession,
            "12.88": "1",
            "12.89": "14",
            "1.1": "",
            "1.2": "",
            "1.3": "",
            "1.4": Aurus.getCid,
            "2.1": "C0N43N4U45RLN8R1",
            "2.2": "000C29BFD6C0",
            "3.1": "8",
            "2.3": Aurus.srcIPAddress,
            "4.1": "132",
            "4.2": "114848",
            "3.4": "00",
            "3.5": "1.0",
            "3.6": "1.0",
            "3.8": "1",
            "4.18": this.getcdate(),
            "4.19": this.getctime()

        };
        return JSON.stringify(payload);

    },

    klarnaPaySessionTokenResponseHandler: function (data) {
        if (data.response_text == "APPROVAL" && data.response_code == "00000") {
            Aurus.blankToken();
            var oneTimeToken = data.one_time_token;
            digitalWalletResponseHandler(buildMerchantResponseJson(data));
        } else {
            Aurus.blankToken();
            Aurus._setWalletID = "14";
            Aurus._setSessionFailed = true;
            digitalWalletResponseHandler(buildMerchantResponseJson(data));
        }
    },

    toHex: function (str) {
        var byteArray = this.toUTF8Array(str);
        return byteArray.map(function (byte) {
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('');
    },

    getHostRequestJSON(json) {
        return "formFactorId=" + this.tid + "&txnDateTime=" + this.getcdate() + this.getctime() + "&encryptionFlag=00&payload=STX" + this.toHex(json) + "ETX";
    },

    toUTF8Array: function (str) {
        var utf8 = [];
        for (var i = 0; i < str.length; i++) {
            var charcode = str.charCodeAt(i);
            if (charcode < 0x80) utf8.push(charcode);
            else if (charcode < 0x800) {
                utf8.push(0xc0 | (charcode >> 6),
                    0x80 | (charcode & 0x3f));
            } else if (charcode < 0xd800 || charcode >= 0xe000) {
                utf8.push(0xe0 | (charcode >> 12),
                    0x80 | ((charcode >> 6) & 0x3f),
                    0x80 | (charcode & 0x3f));
            } else {
                i++;
                charcode = 0x10000 + (((charcode & 0x3ff) << 10) |
                    (str.charCodeAt(i) & 0x3ff));
                utf8.push(0xf0 | (charcode >> 18),
                    0x80 | ((charcode >> 12) & 0x3f),
                    0x80 | ((charcode >> 6) & 0x3f),
                    0x80 | (charcode & 0x3f));
            }
        }
        return utf8;
    },

    //VenmoIntegration Starts here

    venmoClientToken: "",
    venmoPayNonce: "",

    set vct(vct) {
        this.venmoClientToken = vct;
    },
    get getVenmoClientToken() {
        return this.venmoClientToken;
    },
    set _venmoPayNonce(kat) {
        this.venmoPayNonce = kat;
    },
    get getVenmoPayNonce() {
        return this.venmoPayNonce;
    },

    initPayPal: function (paypalConsumerDtl) {
        this.createPaypalContainer();
        Aurus._paypalData = paypalConsumerDtl;
        jQuery.ajaxSetup({
            cache: true
        });
        getScripts([paypalCheckoutJs], function () {

            paypal.Buttons({

                style: {
                    layout: 'horizontal',
                    color: 'black',
                    shape: 'rect',
                    label: 'pay',
                    size: 'responsive',
                    tagline: 'false'
                },
                // Set up the transaction
                createOrder: function (data, actions) {
                    Aurus._setWalletID = "4",
                        Aurus.getBillerToken(Aurus.getCustInfoForPaypal(Aurus.paypalCheckoutData), Aurus.PayPalBillerTokenResponseHandler);
                    return Aurus.getPaypalOrderID;
                },

                // Finalize the transaction
                onApprove: function (data, actions) {
                    Aurus._PaypalOrderID = data.orderID;
                    var tokenReqdata = Aurus.getHostRequestJSON(Aurus.buildPayPalSessionTokenRequestJson());
                    Aurus.getSessionTokenPrimary(tokenReqdata, Aurus.paypalSessionTokenResponseHandler);
                }
            }).render('#paypal-button-container');

            if (jQuery("#paypalDiv_Bottom").length) {
                paypal.Buttons({
                    style: {
                        layout: 'horizontal',
                        color: 'black',
                        shape: 'rect',
                        label: 'pay',
                        size: 'responsive',
                        tagline: 'false'
                    },
                    // Set up the transaction
                    createOrder: function (data, actions) {
                        Aurus._setWalletID = "4",
                            Aurus.getBillerToken(Aurus.getCustInfoForPaypal(Aurus.paypalCheckoutData), Aurus.PayPalBillerTokenResponseHandler);
                        return Aurus.getPaypalOrderID;
                    },

                    // Finalize the transaction
                    onApprove: function (data, actions) {
                        Aurus._PaypalOrderID = data.orderID;
                        var tokenReqdata = Aurus.getHostRequestJSON(Aurus.buildPayPalSessionTokenRequestJson());
                        Aurus.getSessionTokenPrimary(tokenReqdata, Aurus.paypalSessionTokenResponseHandler);
                    }
                }).render('#paypal-button-container_bottom');
            }

        });
        jQuery.ajaxSetup({
            cache: false
        });

    },
    importPaypalURL: function (custData) {

        if (custData.customer.skipShippingAddress == 1) {
            if (this.getEnv == "live") {
                paypalCheckoutJs = "https://www.paypal.com/sdk/js?client-id=AfQUYZxO_oL-qSfMnvqTzWk_lANnQzu_YIsddRZ4AFQTH58YP-Cl6DkZZwWzY-XkxeVEaf95w3mJ4_ci&intent=order&disable-funding=credit,card&commit=false";
            } else if (this.getEnv == "sandbox") {
                paypalCheckoutJs = "https://www.paypal.com/sdk/js?client-id=AbsRowaCV-7remgpCSWWAYIxv1ZnIN20UAumnWFYgCS561CZoSA-BoPUGoBnMiXHAODT6yT7srfQAuQz&intent=order&disable-funding=credit,card&commit=false";
            } else {
                window.parent.postMessage("AurusScriptError=Invalid_Environment", '*');
            }
        } else {
            if (this.getEnv == "live") {
                paypalCheckoutJs = "https://www.paypal.com/sdk/js?client-id=AfQUYZxO_oL-qSfMnvqTzWk_lANnQzu_YIsddRZ4AFQTH58YP-Cl6DkZZwWzY-XkxeVEaf95w3mJ4_ci&intent=order&disable-funding=credit,card&commit=true";
            } else if (this.getEnv == "sandbox") {
                paypalCheckoutJs = "https://www.paypal.com/sdk/js?client-id=AbsRowaCV-7remgpCSWWAYIxv1ZnIN20UAumnWFYgCS561CZoSA-BoPUGoBnMiXHAODT6yT7srfQAuQz&intent=order&disable-funding=credit,card&commit=true";
            } else {
                window.parent.postMessage("AurusScriptError=Invalid_Environment", '*');
            }
        }

        if (jQuery('script[src="' + paypalCheckoutJs + '"]').length < 1) {
            jQuery("head").append(paypalCheckoutJs);
        }

    },
    createPaypalContainer: function () {
        if (!jQuery('#paypalDiv').children().length > 0) {
            var paypalContainer = document.createElement("div");
            paypalContainer.setAttribute("id", "paypal-button-container");
            paypalContainer.setAttribute("style", "width: 100%;");
            document.getElementById('paypalDiv').appendChild(paypalContainer);
        }
        if (jQuery("#paypalDiv_Bottom").length) {
            if (!jQuery('#paypalDiv_Bottom').children().length > 0) {
                var paypalContainer = document.createElement("div");
                paypalContainer.setAttribute("id", "paypal-button-container_bottom");
                paypalContainer.setAttribute("style", "width: 100%;");
                document.getElementById('paypalDiv_Bottom').appendChild(paypalContainer);
            }
        }
    },
    initVenmo: function () {

        if (jQuery('#venmoDiv').is(':empty')) {
            var venmoImage = document.createElement('img')
            venmoImage.setAttribute("id", "venmo-button")
            venmoImage.setAttribute("style", "display: none; width:100% ;")
            venmoImage.setAttribute("src", Aurus._ecstCdnURL + "images/blue_venmo_button_active_280x48.svg")
            venmoImage.onload = function () {

            };
            document.getElementById("venmoDiv").appendChild(venmoImage)
        }

        if (jQuery("#venmoDiv_Bottom").length) {
            if (!jQuery('#venmoDiv_Bottom').children().length > 0) {
                var venmoImage = document.createElement('img')
                venmoImage.setAttribute("id", "venmo-button_Bottom")
                venmoImage.setAttribute("style", "display: none; width:100% ;")
                venmoImage.setAttribute("src", Aurus._ecstCdnURL + "images/blue_venmo_button_active_280x48.svg")
                venmoImage.onload = function () {

                };
                document.getElementById("venmoDiv_Bottom").appendChild(venmoImage)
            }
        }
        Aurus._setWalletID = "15",
            this.getBillerToken("", this.venmoBillerTokenResponseHandler);

    },

    venmoBillerTokenResponseHandler: function (data) {
        if (data.response_code == "00000" && data.response_text == "APPROVAL") {
            Aurus.vct = data.billerToken;
            var clientMinJs = "https://js.braintreegateway.com/web/3.73.1/js/client.min.js";
            var venmoMinJs = "https://js.braintreegateway.com/web/3.73.1/js/venmo.min.js";
            var dataCollectorJs = "https://js.braintreegateway.com/web/3.73.1/js/data-collector.min.js";


            getScripts([clientMinJs, venmoMinJs, dataCollectorJs], function () {

                braintree.client.create({
                    authorization: Aurus.getVenmoClientToken
                }, function (clientErr, clientInstance) {

                    if (clientErr) {
                        return;
                    }
                    braintree.venmo.create({
                        client: clientInstance,
                        authorization: Aurus.getVenmoClientToken,
                        allowDesktop: true,
                        allowNewBrowserTab: true
                    }, function (venmoErr, venmoInstance) {
                        if (venmoErr) {
                            return;
                        }

                        if (!venmoInstance.isBrowserSupported()) {
                            return;
                        }

                        displayVenmoButton(venmoInstance);

                        if (venmoInstance.hasTokenizationResult()) {
                            venmoInstance.tokenize(function (tokenizeErr, payload) {
                                if (err) {
                                    handleVenmoError(tokenizeErr);
                                } else {
                                    handleVenmoSuccess(payload);
                                }
                            });
                            return;
                        }
                    });
                });

            });
        } else {
            Aurus._setBillerFailed = true;
            Aurus._setWalletID = "15",
                digitalWalletResponseHandler(buildMerchantResponseJson(data));
        }
    },
    getVenmoSessionToken: function (payload) {
        Aurus._venmoPayNonce = payload.nonce;

        var reqdata = Aurus.getHostRequestJSON(Aurus.buildSessionTokenRequestPayloadVenmo(Aurus.getVenmoPayNonce));
        this.getSessionTokenPrimary(reqdata, this.venmoSessionTokenResponseHandler);
    },
    buildSessionTokenRequestPayloadVenmo: function (ecomToken) {
        var ecomTokenJson = {
            "walletAuthToken": ecomToken
        };
        var payload = {
            "4.15": "1",
            "12.89": "15",
            "3.21": Aurus._apiversion,
            "12.90": this.toHex(JSON.stringify(ecomTokenJson)),
            "1.1": "",
            "1.2": "",
            "1.3": "",
            "1.4": Aurus.getCid,
            "2.1": "C0N43N4U45RLN8R1",
            "12.102": "",
            "2.2": "000C29BFD6C0",
            "2.3": Aurus.srcIPAddress,
            "4.1": "132",
            "4.18": this.getcdate(),
            "4.19": this.getctime(),
            "12.63": Aurus.getAurusSession
        };
        return JSON.stringify(payload);
    },
    getSessionTokenPrimary: function (reqData, responseHandler) {
        jQuery.ajax({
            url: Aurus._priEcstBaseURL + "altsessiontoken" + Aurus._hostDomainURL,
            async: false,
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: reqData,
            success: function (data) {
                responseHandler(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Aurus.getSessionTokenSecondary(reqData, responseHandler);
            }
        });

    },
    getSessionTokenSecondary: function (reqData, responseHandler) {
        jQuery.ajax({
            url: Aurus._secEcstBaseURL + "altsessiontoken" + Aurus._hostDomainURL,
            async: true,
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: reqData,
            success: function (data) {
                responseHandler(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {}
        });
    },
    venmoSessionTokenResponseHandler: function (data) {
        if (data.response_code == "00000" && data.response_text == "APPROVAL") {
            Aurus.blankToken();
            digitalWalletResponseHandler(buildMerchantResponseJson(data));
        } else {
            Aurus.blankToken();
            Aurus._setWalletID = "15";
            Aurus._setSessionFailed = true;
            digitalWalletResponseHandler(buildMerchantResponseJson(data));
        }
    }
}

function getScripts(scripts, callback) {
    var progress = 0;
    scripts.forEach(function (script) {
        jQuery.getScript(script, function () {
            if (++progress == scripts.length) callback();
        });
    });
}

function importVenmoScripts() {
    var isClientJsLoaded = false;
    var isVenmoMinJsLoaded = false;
    var isDataCollectorJsLoaded = false;
    var venmoscript1 = document.createElement('script')
    venmoscript1.setAttribute("type", "text/javascript")
    venmoscript1.setAttribute("src", "https://js.braintreegateway.com/web/3.62.0/js/client.min.js")
    venmoscript1.onload = function () {
        isClientJsLoaded = true;
    };
    document.getElementsByTagName("head")[0].appendChild(venmoscript1)
}

function displayVenmoButton(venmoInstance) {
    var venmoButton = document.getElementById('venmo-button');
    venmoButton.style.display = 'block';
    venmoButton.addEventListener('click', function () {
        venmoButton.disabled = true;
        venmoInstance.tokenize(function (tokenizeErr, payload) {
            venmoButton.removeAttribute('disabled');

            if (tokenizeErr) {
                handleVenmoError(tokenizeErr);
            } else {
                handleVenmoSuccess(payload);
            }
        });
    });

    if (jQuery("#venmoDiv_Bottom").length) {
        var venmoButton2 = document.getElementById('venmo-button_Bottom');
        venmoButton2.style.display = 'block';
        venmoButton2.addEventListener('click', function () {
            venmoButton2.disabled = true;
            venmoInstance.tokenize(function (tokenizeErr, payload) {
                venmoButton2.removeAttribute('disabled');

                if (tokenizeErr) {
                    handleVenmoError(tokenizeErr);
                } else {
                    handleVenmoSuccess(payload);
                }
            });
        });
    }
}

function handleVenmoError(err) {
    //if (err.code === 'VENMO_CANCELED') {} else if (err.code === 'VENMO_APP_CANCELED') {} else {}
}

function handleVenmoSuccess(payload) {
    Aurus.getVenmoSessionToken(payload);

}



window.klarnaAsyncCallback = function () {

    Klarna.Payments.init({
        client_token: Aurus.getKlarnaClientToken
    });

    Klarna.Payments.load({
        container: "#klarna_container",
        payment_method_category: Aurus.getKlarnaPayMethodType

    }, function (res) {
        //document.write(res);
    });

    jQuery(function () {
        jQuery("button.authorize").on('click', function () {
            Klarna.Payments.authorize({
                    payment_method_category: Aurus.getKlarnaPayMethodType
                },
                function (res) {
                    Aurus.klarnaAuthTokenHandler(res);

                })
        })
    })

}



function buildMerchantResponseJson(data) {
    var merchantResponseJson = {
        "GetSessionTokenResponse": {
            "CardNumber": "" + checkProperty(data, 'masked_card_num') + "",
            "ProfileId": "" + checkProperty(data, 'profileId') + "",
            "ResponseCode": "" + checkProperty(data, 'response_code') + "",
            "RequestId": "" + checkProperty(data, 'requestId') + "",
            "MerchantSessionId": "" + checkProperty(data, 'merchantSessionId') + "",
            "ProcessorToken": "" + checkProperty(data, 'processorToken') + "",
            "ProcessorPayerId": "" + checkProperty(data, 'processorPayerId') + "",
            "ECOMMInfo": {
                "OneTimeToken": "" + checkProperty(data, 'one_time_token') + "",
                "StoreId": "" + checkProperty(data, 'sid') + "",
                "MerchantIdentifier": "" + checkProperty(data, 'mid') + "",
                "TerminalId": "" + checkProperty(data, 'tid') + ""
            },
            "Pay_Wallet": "" + checkProperty(data, 'payWalletData') + "",
            "CardToken": "" + checkProperty(data, 'cardToken') + "",
            "BillingAddress": {
                "BillingAddressLine1": "" + checkProperty(data, 'billingaddr1') + "",
                "BillingAddressLine2": "" + checkProperty(data, 'billingaddr2') + "",
                "BillingCountry": "" + checkProperty(data, 'billingcountry') + "",
                "BillingEmailId": "" + checkProperty(data, 'billingemailid') + "",
                "BillingCity": "" + checkProperty(data, 'billingcity') + "",
                "BillingMobileNumber": "" + checkProperty(data, 'billingcellno') + "",
                "BillingFirstName": "" + checkProperty(data, 'billingfn') + "",
                "BillingLastName": "" + checkProperty(data, 'billingln') + "",
                "BillingZip": "" + checkProperty(data, 'billingzip') + "",
                "BillingState": "" + checkProperty(data, 'billingstate') + "",
                "BillingMiddleName": "" + checkProperty(data, 'billingmn') + ""
            },
            "CardType": "" + checkProperty(data, 'card_type') + "",
            "SubCardType": "" + checkProperty(data, 'subcard_type') + "",
            "TransactionIdentifier": "" + checkProperty(data, 'transactionIdentifier') + "",
            "CardExpiryDate": "" + checkProperty(data, 'CardExpiryDate') + "",
            "ShippingAddress": {
                "ShippingAddressLine1": "" + checkProperty(data, 'shippingaddr1') + "",
                "ShippingEmailId": "" + checkProperty(data, 'shippingemailid') + "",
                "ShippingMiddleName": "" + checkProperty(data, 'shippingmn') + "",
                "ShippingFirstName": "" + checkProperty(data, 'shippingfn') + "",
                "ShippingZip": "" + checkProperty(data, 'shippingzip') + "",
                "ShippingCountry": "" + checkProperty(data, 'shippingcountry') + "",
                "ShippingCity": "" + checkProperty(data, 'shippingcity') + "",
                "ShippingState": "" + checkProperty(data, 'shippingstate') + "",
                "ShippingMobileNumber": "" + checkProperty(data, 'shippingcellno') + "",
                "ShippingAddressLine2": "" + checkProperty(data, 'shippingaddr2') + "",
                "ShippingLastName": "" + checkProperty(data, 'shippingln') + ""
            },
            "ResponseText": "" + checkProperty(data, 'response_text') + "",
            "CartId": "" + checkProperty(data, 'cartId') + "",
            "WalletIdentifier": "" + checkProperty(data, 'WalletIdentifier') + "",
            "ShippingMethod": "" + checkProperty(data, 'ShippingMethod') + "",
            "ModifiedOrder": {
                "OrderTotal": "" + +"",
                "Subtotal": "" + +"",
                "Discount": "" + +"",
                "TaxAmount": "" + +"",
                "ShippingAmount": "" + +"",
                "Gift_Wrap": "" + +"",
                "Coupon": "" + +"",
                "AdditionalTax": "" + [] + "",
            },
        }
    };
    if (Aurus.getBillerFailed || Aurus.getSessionFailed) {
        merchantResponseJson.GetSessionTokenResponse.WalletIdentifier = Aurus.getWalletID;
        Aurus._setBillerFailed = false;
        Aurus._setSessionFailed = false;
    }
    if (Aurus.getWalletID == "7") {
        merchantResponseJson.GetSessionTokenResponse.ShippingMethod = Aurus.getSelectedShippingMethod;
        merchantResponseJson.GetSessionTokenResponse.ModifiedOrder.OrderTotal = Aurus.getOrderAmount;
        merchantResponseJson.GetSessionTokenResponse.ModifiedOrder.Subtotal = Aurus.getSubTotal;
        merchantResponseJson.GetSessionTokenResponse.ModifiedOrder.Discount = Aurus.getDiscount;
        merchantResponseJson.GetSessionTokenResponse.ModifiedOrder.TaxAmount = Aurus.getEstimatedTax;
        merchantResponseJson.GetSessionTokenResponse.ModifiedOrder.ShippingAmount = Aurus.getShippingCost;
        merchantResponseJson.GetSessionTokenResponse.ModifiedOrder.Gift_Wrap = Aurus.getGiftWrap;
        merchantResponseJson.GetSessionTokenResponse.ModifiedOrder.Coupon = Aurus.getCoupon;
        merchantResponseJson.GetSessionTokenResponse.ModifiedOrder.AdditionalTax = Aurus.getAdditionalChargeIndicator;
    }
    return merchantResponseJson;
}

function checkProperty(data, property) {
    if (data.hasOwnProperty(property)) {
        return data[property];
    } else {
        return "";
    }
}

function postAurusScriptLoadedEvent() {
    try {
        window.parent.postMessage("AurusScriptLoaded=true", '*');
    } catch (e) {
        //if (e instanceof ReferenceError) {}
    }
}
/* GooglePay Support Js starts */

const baseRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
    emailRequired: true
};

const allowedCardNetworks = ["AMEX", "DISCOVER", "JCB", "MASTERCARD", "VISA"];
const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

const tokenizationSpecification = {
    type: 'PAYMENT_GATEWAY',
    parameters: {
        'gateway': 'auruspay',
        'gatewayMerchantId': "22731101231178566"
    }

    /* type: 'DIRECT',
     parameters: {
     protocolVersion: 'ECv2',
     publicKey: 'BOxnUMXdAh5VSr4jXwTKR/RS7zXyDbYkGkarLg0Mc4F8HLA5N20EY5kK1Mq4m2oZo/MtANLV6oCcU2Vt7e8Af3I='
  }     */
};

const baseCardPaymentMethod = {
    type: 'CARD',
    parameters: {
        allowedAuthMethods: allowedCardAuthMethods,
        allowedCardNetworks: allowedCardNetworks,
        billingAddressRequired: true,
        "billingAddressParameters": {
            "format": "FULL",
            "phoneNumberRequired": true

        }
    }
};

const cardPaymentMethod = Object.assign({},
    baseCardPaymentMethod, {
        tokenizationSpecification: tokenizationSpecification
    }
);

//let paymentsClient = null;
function getGoogleIsReadyToPayRequest() {
    return Object.assign({},
        baseRequest, {
            allowedPaymentMethods: [baseCardPaymentMethod]
        }
    );
}

function getGooglePaymentDataRequest() {
    const paymentDataRequest = Object.assign({}, baseRequest);
    paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
    paymentDataRequest.transactionInfo = getGoogleTransactionInfo();
    paymentDataRequest.merchantInfo = {
        //merchantId: Aurus.getGoogleMerchantId, 
        merchantName: 'Aurusinc' //optional
    };
    return paymentDataRequest;
}

function getGooglePaymentsClient() {
    //if ( paymentsClient === null ) {
    var paymentsClient = new google.payments.api.PaymentsClient({
        environment: 'TEST'
    }); /*TEST OR PRODUCTION*/
    //}
    return paymentsClient;
}

function onGooglePayLoaded() {
    const paymentsClient = getGooglePaymentsClient();
    paymentsClient.isReadyToPay(getGoogleIsReadyToPayRequest())
        .then(function (response) {
            if (response.result) {
                addGooglePayButton();
            }
        })
        .catch(function (err) {
            console.error(err);
        });
}

function addGooglePayButton() {
    const paymentsClient = getGooglePaymentsClient();
    const button =
        paymentsClient.createButton({
            onClick: onGooglePaymentButtonClicked,
            buttonSizeMode: 'fill',
            buttonType: 'plain'
        }); //buttonColor: 'black'
    // const button_bottom =
    //     paymentsClient.createButton({onClick: onGooglePaymentButtonClicked,buttonSizeMode:'fill',buttonType: 'plain'});

    document.getElementById('aurus-google-pay-containerId').appendChild(button);
    //document.getElementById('aurus-google-pay-containerId-bottom').appendChild(button_bottom);


    /*if(document.getElementsByClassName("gpay-button")[0]){
    
     document.getElementsByClassName("gpay-button")[0].setAttribute('style','width:10px');
    
    }*/


}

function getGoogleTransactionInfo() {
    return {
        currencyCode: Aurus.getCurrencyCode,
        totalPriceStatus: 'FINAL',
        totalPrice: parseFloat(Aurus.getOrderAmount).toFixed(2),
    };
}

function prefetchGooglePaymentData() {
    const paymentDataRequest = getGooglePaymentDataRequest();
    paymentDataRequest.transactionInfo = {
        totalPriceStatus: 'NOT_CURRENTLY_KNOWN',
        currencyCode: Aurus.getCurrencyCode
    };
    const paymentsClient = getGooglePaymentsClient();
    paymentsClient.prefetchPaymentData(paymentDataRequest);
}

function onGooglePaymentButtonClicked() {
    const paymentDataRequest = getGooglePaymentDataRequest();
    paymentDataRequest.transactionInfo = getGoogleTransactionInfo();

    const paymentsClient = getGooglePaymentsClient();
    paymentsClient.loadPaymentData(paymentDataRequest)
        .then(function (paymentData) {
            processPayment(paymentData);

        })
        .catch(function (err) {
            console.error(err);
        });
}

function processPayment(paymentData) {

    /*var paymentToken = paymentData.paymentMethodData.tokenizationData.token;*/

    var paymentToken = JSON.stringify(paymentData);

    Aurus._gPayPaymetData = paymentToken;


    // document.write(paymentToken);
}


/* GooglePay Support Js Ends*/

postAurusScriptLoadedEvent();





function digitalWalletResponseHandler(JSONdata) {
    // Merchant Response handler for Session Token
    console.log("Inside digitalWalletResponseHandler" + JSON.stringify(JSONdata));
    var responseCode = JSONdata.GetSessionTokenResponse.ResponseCode;
    console.log('JSONdata.GetSessionTokenResponse.BillingAddress------>>>>', JSONdata.GetSessionTokenResponse.BillingAddress);
    console.log('JSONdata.GetSessionTokenResponse.ShippingAddress------>>>>', JSONdata.GetSessionTokenResponse.ShippingAddress);
    if (responseCode == "00000") {
        //alert(JSON.stringify(JSONdata));
        console.log("Success : Session Token Received - " + JSONdata.GetSessionTokenResponse.ECOMMInfo.OneTimeToken);
        console.log("Success : CardType - " + JSONdata.GetSessionTokenResponse.CardType);
        console.log("Success : WalletIdentifier - " + JSONdata.GetSessionTokenResponse.WalletIdentifier);
        var WalletIdentifier = JSONdata.GetSessionTokenResponse.WalletIdentifier;
        var defer = $.Deferred();
        $.ajax({
            url: aurusWalletPlaceOrder, //var aurusWalletPlaceOrder = "${URLUtils.url('AurusWallet-PlaceOrder')}";
            method: 'POST',
            data: {
                OneTimeToken: JSONdata.GetSessionTokenResponse.ECOMMInfo.OneTimeToken,
                cardType: JSONdata.GetSessionTokenResponse.CardType,
                BillingAddress: JSON.stringify(JSONdata.GetSessionTokenResponse.BillingAddress),
                ShippingAddress: JSON.stringify(JSONdata.GetSessionTokenResponse.ShippingAddress),
                WalletIdentifier: WalletIdentifier
            },
            success: function (data) {
                // enable the placeOrder button here
                $('body').trigger('checkout:enableButton', '.next-step-button button');
                if (data.errorMessage) {
                    $('.error-message').show();
                    $('.error-message-text').text(data.errorMessage);
                    scrollAnimate($('.error-message'));
                } else {
                    if (data.apm) {
                        var params = data.continueUrl.slice(data.continueUrl.indexOf('?') + 1).split('&');
                        var redirect = $('<form>')
                            .appendTo(document.body)
                            .attr({
                                method: 'GET',
                                action: data.continueUrl,
                            });

                        Object.keys(params).forEach(function (keys) {
                            var param = params[keys].split('=');
                            $('<input>')
                                .appendTo(redirect)
                                .attr({
                                    name: param[0],
                                    value: param[1],
                                });
                        });

                        $('<input>')
                            .appendTo(redirect)
                            .attr({
                                name: 'orderID',
                                value: data.orderID,
                            });

                        $('<input>')
                            .appendTo(redirect)
                            .attr({
                                name: 'orderToken',
                                value: data.orderToken,
                            });

                        redirect.submit();
                        defer.resolve(data);
                    } else {
                        var redirect = $('<form>')
                            .appendTo(document.body)
                            .attr({
                                method: 'POST',
                                action: data.continueUrl,
                            });

                        $('<input>')
                            .appendTo(redirect)
                            .attr({
                                name: 'orderID',
                                value: data.orderID,
                            });

                        $('<input>')
                            .appendTo(redirect)
                            .attr({
                                name: 'orderToken',
                                value: data.orderToken,
                            });

                        redirect.submit();
                        defer.resolve(data);
                    }
                }
            },
            error: function () {
                // enable the placeOrder button here
                $('body').trigger('checkout:enableButton', $('.next-step-button button'));
            },
        });

        return defer;


    } else {
        //failure response handling
        // alert(JSONdata.GetSessionTokenResponse.ResponseText+' PLEASE CONTACT TO AURUS');
        $('.error-message').show();
        $('.error-message-text').text(JSONdata.GetSessionTokenResponse.ResponseText);
        scrollAnimate($('.error-message'));
    }
}


module.exports = Aurus;