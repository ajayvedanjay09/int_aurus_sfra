var formHelpers = require('base/checkout/formErrors');
var scrollAnimate = require('base/components/scrollAnimate');

// IE 11 does not support ‘startsWith’ with strings.
// Adding this prototype so that it supports the method.
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) { // eslint-disable-line
        position = position || 0; // eslint-disable-line
        return this.indexOf(searchString, position) === position;
    };
}

function getAurusPayPalSession(params) {
    return new Promise(function (resolve, reject) {
    $.ajax({
        url: 'AurusPay-GetSession',
        type: 'get',
        data: {
            paypal: 'true'
        },
        success: function (data) {
            if (!data.error) {
                var payLoad = JSON.parse(data.session);
                //window.console.log('PayPal Session Res',data);
                var sessionId = payLoad.SessionResponse.SessionId;
                resolve(sessionId); // Resolve with only SessionId
                window.console.log('PayPal Session payload sessionId--->>>>',sessionId);
            } else {
                window.console.log('Error retrieving Aurus Pay iFrame url and session');
                reject(new Error('Error retrieving Aurus Pay iFrame url and session'));
            }
        }
    });
});

}

// function getBillerToken(params) {
//     $.ajax({
//         url: 'AurusPay-GetBillerToken',
//         type: 'get',
//         success: function (data) {
//             if (!data.error) {
//                 var payLoad = JSON.parse(data.session);
//                 window.console.log('AurusPay GetBillerToken--->>>>',payLoad);
//             } else {
//                 window.console.log('Error retrieving Aurus Pay PayPal token');
//             }
//         }
//     });
// }

// Changed By me
function onclickPaypalButton() {
    paypal.Button.render({

        env: 'sandbox',
        commit: true,

        style: {
            label: 'paypal',
            size: 'responsive',
            color: 'gold',
            shape: 'rect',
            tagline: false,
            height: 46
        },
        payment: function() {
            return getBillerToken().then(function (payLoad) {
                window.console.log('EcomToken--------------', payLoad.GetBillerTokenResponse.EcomToken);
                return payLoad.GetBillerTokenResponse.EcomToken;
            });
        },

        onAuthorize: function(data, actions) {
            window.console.log('onAuthorize called---->>>>>>>>');
      //getSessionToken call to get OTT of paypal request
            getPayPalSessionToken();
            return actions.redirect();
        },

        onCancel: function(data, actions) {
            //	return actions.redirect();
        }

    }, '#aurus-paypal-containerId');
}

function getBillerToken() {
     return new Promise(function (resolve, reject) {
        $.ajax({
            url: 'AurusPay-GetBillerToken',
            type: 'get',
            success: function (data) {
                if (!data.error) {
                    var payLoad = JSON.parse(data.session);
                    window.console.log('AurusPay GetBillerToken--->>>>', payLoad);
                    // window.console.log('EcomToken---->>>>>', payLoad.GetBillerTokenResponse.EcomToken);

                    // // Extract the approval URL
                    // var approvalLink = payLoad.GetBillerTokenResponse.WalletObject.links.find(link => link.rel === 'approval_url');
                    // if (approvalLink) {
                    //     var approvalUrl = approvalLink.href;
                    //     window.console.log('Approval URL:', approvalUrl);
                    // } else {
                    //     window.console.log('Approval URL not found');
                    // }

                    resolve(payLoad);
                } else {
                    window.console.log('Error retrieving Aurus Pay PayPal token');
                    reject(new Error('Error retrieving Aurus Pay PayPal token'));
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                reject(new Error('AJAX request failed: ' + textStatus + ', ' + errorThrown));
            }
        });
   });
}
//this function is for to get OTT 
function getPayPalSessionToken(){
    window.console.log('get session token for paypal');
    // $.ajax({
    //     url: 'AurusPay-GetSessionToken',
    //     type: 'get',
    //     success: function (data) {
    //         if (!data.error) {
    //             var payLoad = JSON.parse(data.session);
    //             window.console.log('AurusPay GetSessionTokenRequest--->>>>',payLoad);
    //         } else {
    //             window.console.log('Error retrieving Aurus Pay PayPal GetSessionToken for OTT');
    //         }
    //     }
    // });
}

/**
* Ajax call to get iframe url and attach to existing element
* @param {string} storedPaymentId uuid and internal id for payment instrument
*/
function getAurusSession(storedPaymentId) {
    var ccId = '';
    if (storedPaymentId !== undefined) {
        ccId = storedPaymentId.length > 0 ? storedPaymentId : '';
    }
    $.ajax({
        url: 'AurusPay-GetSession',
        type: 'get',
        data: {
            ccId: ccId
        },
        success: function (data) {
            if (!data.error) {
                var payLoad = JSON.parse(data.session);
                 window.console.log('getAurusSession payLoad',payLoad);
                $('#frame_carddetails').attr('src', payLoad.SessionResponse.IFrameUrl);
            } else {
                window.console.log('Error retrieving Aurus Pay iFrame url and session');
            }
        }
    });
}

/**
* Merchant needs to get this URL by doing substring of Aurus Iframe Url received in Session API.
* URL example: var aurusURL = 'https://uat48.auruspay.com';
* @returns {string} Aurus iframe Origin
*/
function getIframeUrl() {
    var aurusURL;
    if ($('#frame_carddetails').length) {
        var aurusLongURL = $('#frame_carddetails').attr('src');
        aurusURL = 'https://' + aurusLongURL.split('/')[2];
    }
    return aurusURL;
}

/**
* This function initiates Ajax call within the Aurus iframe to retrieve the one time token (OTT)
* This method needs to be called onSubmit button click present on Merchant's page.
*/
function getCardToken() {
    var aurusURL = getIframeUrl();
    var frame = document.getElementById('frame_carddetails');
    frame.contentWindow.postMessage('aurus-token', aurusURL);
}

// /**
// * This function initiates Ajax call within the Aurus iframe to retrieve the one time token (OTT)
// * This method needs to be called onSubmit button click present on Merchant's page.
// * @param {JSON} JSONdata the response data from the OTT request within the iFrame
// */
// function responseHandler(JSONdata) {
//     window.console.log('responseHandler called----->>>');
//     try {
//         var $msg = $('#token-error');
//         // Handle the Error Response here
//         if (Number(JSONdata.response_code) > 0) {
//             $msg.text('ERROR: ' + JSONdata.response_code + ' - ' + JSONdata.response_text);
//             $('#buttonSubmit').prop('disabled', false);
//         } else { // Handle the success response here like below:
//             window.console.log('responseHandler called SUCCESS----->>>');
//             $msg.text('SUCCESS');
//             // var $form = $('#dwfrm_billing');

//             // $form.append($('<input type="hidden" name="card_token">').val(JSONdata.card_token));
//             // $form.append($('<input type="hidden" name="card_holder_name">').val(JSONdata.card_holder_name));

//             $('#cardType').val(JSONdata.card_type);
//             var maskedCardNum = 'dwfrm_billing_creditCardFields_cardNumber=' + JSONdata.masked_card_num + '&';
//             var expiryDate = 'dwfrm_billing_creditCardFields_expirationDate=' + JSONdata.card_expiry_date + '&';
//             var resCode = 'dwfrm_billing_creditCardFields_responseCode=' + JSONdata.response_code + '&';
//             var resText = 'dwfrm_billing_creditCardFields_responseText=' + JSONdata.response_text + '&';
//             var ott = 'dwfrm_billing_creditCardFields_ott=' + JSONdata.one_time_token;
//             formHelpers.clearPreviousErrors('.payment-form');
//             window.console.log('responseHandler called SUCCESS----->>>',ott);
//             window.console.log('responseHandler called expiryDate----->>>',expiryDate);
//             window.console.log('responseHandler called resCode----->>>',resCode);
//             window.console.log('responseHandler called resText----->>>',resText);
//             var shippingFormData = $('.single-shipping .shipping-form').serialize();

//             $('body').trigger('checkout:serializeShipping', {
//                 form: $('.single-shipping .shipping-form'),
//                 data: shippingFormData,
//                 callback: function (data) {
//                     shippingFormData = data;
//                 }
//             });

//             var billingAddressForm = $('#dwfrm_billing .billing-address-block :input').serialize();

//             $('body').trigger('checkout:serializeBilling', {
//                 form: $('#dwfrm_billing .billing-address-block'),
//                 data: billingAddressForm,
//                 callback: function (data) {
//                     if (data) {
//                         billingAddressForm = data;
//                     }
//                 }
//             });

//             var contactInfoForm = $('#dwfrm_billing .contact-info-block :input').serialize();

//             $('body').trigger('checkout:serializeBilling', {
//                 form: $('#dwfrm_billing .contact-info-block'),
//                 data: contactInfoForm,
//                 callback: function (data) {
//                     if (data) {
//                         contactInfoForm = data;
//                     }
//                 }
//             });

//             var activeTabId = $('.tab-pane.active').attr('id');

//             var paymentInfoSelector = '#dwfrm_billing .' + activeTabId + ' .payment-form-fields :input';
//             var paymentInfoForm = $(paymentInfoSelector).serialize();
//             paymentInfoForm = paymentInfoForm + '&' + maskedCardNum + expiryDate + resCode + resText + ott;

//             var paymentForm = shippingFormData + '&' + billingAddressForm + '&' + contactInfoForm + '&' + paymentInfoForm;
//             window.console.log('paymentForm====>>',paymentForm);
//             // disable the next:Place Order button here
//             $('body').trigger('checkout:disableButton', '.next-step-button button');
//             var defer = $.Deferred();// eslint-disable-line
//             window.console.log('defer' ,defer);
//             var test= $('#dwfrm_billing').attr('action');
//             window.console.log('test...',test);
//             // Ajax call to server side
//             $.ajax({
//                 url: $('#dwfrm_billing').attr('action'),
//                 method: 'POST',
//                 data: paymentForm,
//                 success: function (data) {
//                     // enable the next:Place Order button here
//                     $('body').trigger('checkout:enableButton', '.next-step-button button');
//                     // look for field validation errors
//                     if (data.error) {
//                         if (data.fieldErrors.length) {
//                             data.fieldErrors.forEach(function (error) {
//                                 if (Object.keys(error).length) {
//                                     formHelpers.loadFormErrors('.payment-form', error);
//                                 }
//                             });
//                         }

//                         if (data.serverErrors.length) {
//                             data.serverErrors.forEach(function (error) {
//                                 $('.error-message').show();
//                                 $('.error-message-text').text(error);
//                                 scrollAnimate($('.error-message'));
//                             });
//                         }

//                         if (data.cartError) {
//                             window.location.href = data.redirectUrl;
//                         }

//                         defer.reject();
//                     } else {
//                         //
//                         // Populate the Address Summary
//                         //
//                         $('body').trigger('checkout:updateCheckoutView',
//                             { order: data.order, customer: data.customer });

//                         if (data.renderedPaymentInstruments) {
//                             $('.stored-payments').empty().html(
//                                 data.renderedPaymentInstruments
//                             );
//                         }

//                         if (data.customer.registeredUser
//                             && data.customer.customerPaymentInstruments.length
//                         ) {
//                             $('.cancel-new-payment').removeClass('checkout-hidden');
//                         }

//                         scrollAnimate();
//                         defer.resolve(data);
//                     }
//                 },
//                 error: function (err) {
//                     // enable the next:Place Order button here
//                     $('body').trigger('checkout:enableButton', '.next-step-button button');
//                     if (err.responseJSON && err.responseJSON.redirectUrl) {
//                         window.location.href = err.responseJSON.redirectUrl;
//                     }
//                 }
//             });
//         }
//     } catch (error) {
//         window.console.log('ERROR: ' + error);
//     }
// }

// This will get triggered when Aurus will post the OTT response on Merchant's page

window.addEventListener('message', function (event) {
    var aurusURL = getIframeUrl();
    var data = event.data;
    var splt;
    var json;
    if (event.origin !== aurusURL) {
        window.console.log('Wrong Origin...');
        return;
    }
    //  else if (data.startsWith('response')) {
    //     splt = data.split('=');
    //     json = JSON.parse(splt[1]);
    //     //responseHandler(json);
    // } else if (data.startsWith('enablePlaceOrder')) {
    //     splt = data.split('=');
    //     json = JSON.parse(splt[1]);
    //     // TODO: if failure disable place order button
    //     // var enableBtn = json ? true : false;
    //     // enablePlaceOrderBtn(enableBtn);
    else if (data.startsWith('iframeHeight')) {
         splt = data.split('=');
         json = splt[1];
         console.log("Iframe height:"+json); 
         $("#frame_carddetails").css("height",json);
    }
});

module.exports = {
    methods: {
        getCardToken: getCardToken,
        getAurusSession: getAurusSession,
        getAurusPayPalSession: getAurusPayPalSession,
        getBillerToken: getBillerToken,
        onclickPaypalButton:onclickPaypalButton
    }
};
