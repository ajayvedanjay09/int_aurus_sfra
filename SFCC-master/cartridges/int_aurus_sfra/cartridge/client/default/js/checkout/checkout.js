/* eslint-disable no-redeclare */
/* eslint-disable block-scoped-var */
/* eslint-disable no-lonely-if */
'use strict';
// Changed By me
var customerHelpers = require('base/checkout/customer');
var addressHelpers = require('base/checkout/address');
var shippingHelpers = require('base/checkout/shipping');
var billingHelpers = require('./billing');
var summaryHelpers = require('base/checkout/summary');
var formHelpers = require('base/checkout/formErrors');
var scrollAnimate = require('base/components/scrollAnimate');
var aurusCheckout = require('../aurusCheckout');
var Aurus = require('../test');

/**
 * Create the jQuery Checkout Plugin.
 *
 * This jQuery plugin will be registered on the dom element in checkout.isml with the
 * id of "checkout-main".
 *
 * The checkout plugin will handle the different state the user interface is in as the user
 * progresses through the varying forms such as shipping and payment.
 *
 * Billing info and payment info are used a bit synonymously in this code.
 *
 */
(function ($) {
    $.fn.aurusPayCheckout = function () { // eslint-disable-line
        var plugin = this;
        var ottRequested = false;


        // Declare variables for storing responseHandler data
        var maskedCardNum = '';
        var expiryDate = '';
        var resCode = '';
        var resText = '';
        var ott = '';

        //
        // Collect form data from user input
        //
        var formData = {
            // Changed By me
            // Customer Data
            customer: {},

            // Shipping Address
            shipping: {},

            // Billing Address
            billing: {},

            // Payment
            payment: {},

            // Gift Codes
            giftCode: {},
        };

        //
        // The different states/stages of checkout
        //
        var checkoutStages = [
            'customer',
            'shipping',
            'payment',
            'placeOrder',
            'submitted',
        ];
        /**
         * This function initiates Ajax call within the Aurus iframe to retrieve the one time token (OTT)
         * This method needs to be called onSubmit button click present on Merchant's page.
         * @param {JSON} JSONdata the response data from the OTT request within the iFrame
         */
        function responseHandler(JSONdata) {
            var defer = $.Deferred(); // eslint-disable-line
            try {
                var $msg = $('#token-error');
                // Handle the Error Response here
                if (Number(JSONdata.response_code) > 0) {
                    $msg.text('ERROR: ' + JSONdata.response_code + ' - ' + JSONdata.response_text);
                    $('#buttonSubmit').prop('disabled', false);
                } else { // Handle the success response here like below:
                    $msg.text('SUCCESS');

                    $('#cardType').val(JSONdata.card_type);
                    maskedCardNum = 'dwfrm_billing_creditCardFields_cardNumber=' + JSONdata.masked_card_num + '&';
                    expiryDate = 'dwfrm_billing_creditCardFields_expirationDate=' + JSONdata.card_expiry_date + '&';
                    resCode = 'dwfrm_billing_creditCardFields_responseCode=' + JSONdata.response_code + '&';
                    resText = 'dwfrm_billing_creditCardFields_responseText=' + JSONdata.response_text + '&';
                    ott = 'dwfrm_billing_creditCardFields_ott=' + JSONdata.one_time_token;
                }
            } catch (error) {
                window.console.log('ERROR: ' + error);
            }
            defer.resolve();
            return defer.promise();
        }

        //Payment Stage function
        function executeTryBlock() {
            try {
                formHelpers.clearPreviousErrors('.payment-form');
                var shippingFormData = $('.single-shipping .shipping-form').serialize();

                $('body').trigger('checkout:serializeShipping', {
                    form: $('.single-shipping .shipping-form'),
                    data: shippingFormData,
                    callback: function (data) {
                        shippingFormData = data;
                    }
                });

                var billingAddressForm = $('#dwfrm_billing .billing-address-block :input').serialize();

                $('body').trigger('checkout:serializeBilling', {
                    form: $('#dwfrm_billing .billing-address-block'),
                    data: billingAddressForm,
                    callback: function (data) {
                        if (data) {
                            billingAddressForm = data;
                        }
                    }
                });

                var contactInfoForm = $('#dwfrm_billing .contact-info-block :input').serialize();

                $('body').trigger('checkout:serializeBilling', {
                    form: $('#dwfrm_billing .contact-info-block'),
                    data: contactInfoForm,
                    callback: function (data) {
                        if (data) {
                            contactInfoForm = data;
                        }
                    }
                });

                var activeTabId = $('.tab-pane.active').attr('id');

                var paymentInfoSelector = '#dwfrm_billing .' + activeTabId + ' .payment-form-fields :input';
                var paymentInfoForm = $(paymentInfoSelector).serialize();
                paymentInfoForm = paymentInfoForm + '&' + maskedCardNum + expiryDate + resCode + resText + ott;

                var paymentForm = shippingFormData + '&' + billingAddressForm + '&' + contactInfoForm + '&' + paymentInfoForm;
                // disable the next:Place Order button here
                $('body').trigger('checkout:disableButton', '.next-step-button button');
                var defer = $.Deferred(); // eslint-disable-line
                var test = $('#dwfrm_billing').attr('action');
                window.console.log('test...', test);
                // Ajax call to server side
                $.ajax({
                    url: $('#dwfrm_billing').attr('action'),
                    method: 'POST',
                    data: paymentForm,
                    success: function (data) {
                        // enable the next:Place Order button here
                        $('body').trigger('checkout:enableButton', '.next-step-button button');
                        // look for field validation errors
                        if (data.error) {
                            if (data.fieldErrors.length) {
                                data.fieldErrors.forEach(function (error) {
                                    if (Object.keys(error).length) {
                                        formHelpers.loadFormErrors('.payment-form', error);
                                    }
                                });
                            }

                            if (data.serverErrors.length) {
                                data.serverErrors.forEach(function (error) {
                                    $('.error-message').show();
                                    $('.error-message-text').text(error);
                                    scrollAnimate($('.error-message'));
                                });
                            }

                            if (data.cartError) {
                                window.location.href = data.redirectUrl;
                            }

                            defer.reject();
                        } else {
                            //
                            // Populate the Address Summary
                            //
                            $('body').trigger('checkout:updateCheckoutView', {
                                order: data.order,
                                customer: data.customer
                            });

                            if (data.renderedPaymentInstruments) {
                                $('.stored-payments').empty().html(
                                    data.renderedPaymentInstruments
                                );
                            }

                            if (data.customer.registeredUser &&
                                data.customer.customerPaymentInstruments.length
                            ) {
                                $('.cancel-new-payment').removeClass('checkout-hidden');
                            }

                            scrollAnimate();
                            defer.resolve(data);
                        }
                    },
                    error: function (err) {
                        // enable the next:Place Order button here
                        $('body').trigger('checkout:enableButton', '.next-step-button button');
                        if (err.responseJSON && err.responseJSON.redirectUrl) {
                            window.location.href = err.responseJSON.redirectUrl;
                        }
                    }
                });
            } catch (error) {
                window.console.log('ERROR: ' + error);
            }
        }

        /**
         * Updates the URL to determine stage
         * @param {number} currentStage - The current stage the user is currently on in the checkout
         */
        function updateUrl(currentStage) {
            history.pushState(
                checkoutStages[currentStage],
                document.title,
                location.pathname +
                '?stage=' +
                checkoutStages[currentStage] +
                '#' +
                checkoutStages[currentStage]
            );

            callAjax(currentStage);

        }
        /**
         * Updates the URL to determine stage
         * @param {number} currentStage - The current stage the user is currently on in the checkout
         */

        function callAjax(currentStage) {
            if (currentStage >= 2) {
                $('#AppleDiv').show();
                $('#paypalDiv').show();
                $('#klarnaButtonDiv_Top').show();
                $('#klarnaDiv').show();
                $('#googlepayDiv').show();

            } else {
                $('#AppleDiv').hide();
                $('#paypalDiv').hide();
                $('#klarnaButtonDiv_Top').hide();
                $('#klarnaDiv').hide();
                $('#googlepayDiv').hide();
            }
        }

        //
        // Local member methods of the Checkout plugin
        //
        var members = {

            // initialize the currentStage variable for the first time
            currentStage: 0,

            /**
             * Set or update the checkout stage (AKA the shipping, billing, payment, etc... steps)
             * @returns {Object} a promise
             */
            updateStage: function () {
                var stage = checkoutStages[members.currentStage];
                var defer = $.Deferred(); // eslint-disable-line
                // Changed By me
                if (stage === 'customer') {
                    //
                    // Clear Previous Errors
                    //
                    customerHelpers.methods.clearErrors();
                    //
                    // Submit the Customer Form
                    //
                    var customerFormSelector = customerHelpers.methods.isGuestFormActive() ? customerHelpers.vars.GUEST_FORM : customerHelpers.vars.REGISTERED_FORM;
                    var customerForm = $(customerFormSelector);
                    $.ajax({
                        url: customerForm.attr('action'),
                        type: 'post',
                        data: customerForm.serialize(),
                        success: function (data) {
                            $('body').trigger('checkout:updateCheckoutView', data);
                            if (data.redirectUrl) {
                                window.location.href = data.redirectUrl;
                            } else {
                                customerHelpers.methods.customerFormResponse(defer, data);
                            }
                        },
                        error: function (err) {
                            if (err.responseJSON && err.responseJSON.redirectUrl) {
                                window.location.href = err.responseJSON.redirectUrl;
                            }
                            // Server error submitting form
                            defer.reject(err.responseJSON);
                        },
                    });
                    return defer;
                } else if (stage === 'shipping') {
                    window.console.log('shipping stage');


                    //
                    // Clear Previous Errors
                    //
                    formHelpers.clearPreviousErrors('.shipping-form');

                    //
                    // Submit the Shipping Address Form
                    //
                    var isMultiShip = $('#checkout-main').hasClass('multi-ship');
                    var formSelector = isMultiShip ?
                        '.multi-shipping .active form' : '.single-shipping .shipping-form';
                    var form = $(formSelector);

                    if (isMultiShip && form.length === 0) {
                        // disable the next:Payment button here
                        $('body').trigger('checkout:disableButton', '.next-step-button button');
                        // in case the multi ship form is already submitted
                        var url = $('#checkout-main').attr('data-checkout-get-url');
                        $.ajax({
                            url: url,
                            method: 'GET',
                            success: function (data) {
                                // enable the next:Payment button here
                                $('body').trigger('checkout:enableButton', '.next-step-button button');
                                if (!data.error) {
                                    $('body').trigger('checkout:updateCheckoutView', {
                                        order: data.order,
                                        customer: data.customer
                                    });
                                    defer.resolve();
                                } else if (data.message && $('.shipping-error .alert-danger').length < 1) {
                                    var errorMsg = data.message;
                                    var errorHtml = '<div class="alert alert-danger alert-dismissible valid-cart-error ' +
                                        'fade show" role="alert">' +
                                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                                        '<span aria-hidden="true">&times;</span>' +
                                        '</button>' + errorMsg + '</div>';
                                    $('.shipping-error').append(errorHtml);
                                    scrollAnimate($('.shipping-error'));
                                    defer.reject();
                                } else if (data.redirectUrl) {
                                    window.location.href = data.redirectUrl;
                                }
                            },
                            error: function () {
                                // enable the next:Payment button here
                                $('body').trigger('checkout:enableButton', '.next-step-button button');
                                // Server error submitting form
                                defer.reject();
                            },
                        });
                    } else {
                        var shippingFormData = form.serialize();

                        $('body').trigger('checkout:serializeShipping', {
                            form: form,
                            data: shippingFormData,
                            callback: function (data) {
                                shippingFormData = data;
                            },
                        });
                        // disable the next:Payment button here
                        $('body').trigger('checkout:disableButton', '.next-step-button button');
                        $.ajax({
                            url: form.attr('action'),
                            type: 'post',
                            data: shippingFormData,
                            success: function (data) {
                                // enable the next:Payment button here
                                $('body').trigger('checkout:enableButton', '.next-step-button button');
                                shippingHelpers.methods.shippingFormResponse(defer, data);

                                $('body').trigger('checkout:updateCheckoutView', data);
                                if (!data.error) {
                                    $.ajax({
                                        url: 'AurusWallet-GetGenericJsonObj',
                                        method: 'GET',
                                        success: function (data) {
                                            window.console.log('getGenericJsonObj ==>>', data);
                                            var jq = $.noConflict();
                                            jq(document).ready(function () {
                                                Aurus.aurusInit(data.getGenericJsonObj, jq);
                                            });
                                        },
                                        error: function (xhr, status, error) {
                                            console.error("Error: " + error);
                                        }
                                    });
                                }
                            //     if (!data.error) {
                            //     $.ajax({
                            //         url: 'AurusKlarna-klarnaGetGenericJsonObj',
                            //         method: 'GET',
                            //         success: function (data) {
                            //             window.console.log('getGenericJsonObj ==>>', data);
                            //             var jq = $.noConflict();
                            //             jq(document).ready(function () {
                            //                 Aurus.aurusInit(data.getGenericJsonObj, jq);
                            //             });
                            //         },
                            //         error: function (xhr, status, error) {
                            //             console.error("Error: " + error);
                            //         }
                            //     });
                            //    }
                            },
                            error: function (err) {
                                // enable the next:Payment button here
                                $('body').trigger('checkout:enableButton', '.next-step-button button');
                                if (err.responseJSON && err.responseJSON.redirectUrl) {
                                    window.location.href = err.responseJSON.redirectUrl;
                                }
                                // Server error submitting form
                                defer.reject(err.responseJSON);
                            },
                        });

                    }
                    return defer;
                } else if (stage === 'payment') {
                    //
                    // Submit the Billing Address Form
                    //

                    // Function loads iFrame and iFrame events for Aurus OTT and pre-auth
                    aurusCheckout.methods.getCardToken();

                    // This will get triggered when Aurus will post the OTT response on Merchant's page
                    window.addEventListener('message', function (event) {
                        var data = event.data;
                        var splt;
                        var json;
                        if (data.startsWith('response')) {
                            splt = data.split('=');
                            json = JSON.parse(splt[1]);
                            responseHandler(json).done(function () {
                                executeTryBlock();
                            })
                        } else if (data.startsWith('enablePlaceOrder')) {
                            splt = data.split('=');
                            json = JSON.parse(splt[1]);
                            // TODO: if failure disable place order button
                            // var enableBtn = json ? true : false;
                            // enablePlaceOrderBtn(enableBtn);
                        }
                    });
                    executeTryBlock();
                } else if (stage === 'placeOrder') {
                    // disable the placeOrder button here
                    $('body').trigger('checkout:disableButton', '.next-step-button button');
                    $.ajax({
                        url: $('.place-order').data('action'),
                        method: 'POST',
                        success: function (data) {
                            // enable the placeOrder button here
                            $('body').trigger('checkout:enableButton', '.next-step-button button');
                            if (data.error) {
                                if (data.cartError) {
                                    window.location.href = data.redirectUrl;
                                    defer.reject();
                                } else {
                                    // go to appropriate stage and display error message
                                    defer.reject(data);
                                }
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
                }
                var p = $('<div>').promise(); // eslint-disable-line
                setTimeout(function () {
                    p.done(); // eslint-disable-line
                }, 500);
                return p; // eslint-disable-line
            },

            /**
             * Initialize the checkout stage.
             *
             * TODO: update this to allow stage to be set from server?
             */
            initialize: function () {
                // set the initial state of checkout
                members.currentStage = checkoutStages
                    .indexOf($('.data-checkout-stage').data('checkout-stage'));
                $(plugin).attr('data-checkout-stage', checkoutStages[members.currentStage]);

                $('body').on('click', '.submit-customer-login', function (e) {
                    e.preventDefault();
                    members.nextStage();
                });

                $('body').on('click', '.submit-customer', function (e) {
                    e.preventDefault();
                    members.nextStage();
                });

                //
                // Handle Payment option selection
                //
                $('input[name$="paymentMethod"]', plugin).on('change', function () {
                    $('.credit-card-form').toggle($(this).val() === 'CREDIT_CARD');
                });

                //
                // Handle Next State button click
                //
                $(plugin).on('click', '.next-step-button button', function () {
                    members.nextStage();
                });

                // Changed By me
                //
                // Handle Edit buttons on shipping and payment summary cards
                //
                $('.customer-summary .edit-button', plugin).on('click', function () {
                    members.gotoStage('customer');
                });

                $('.shipping-summary .edit-button', plugin).on('click', function () {
                    if (!$('#checkout-main').hasClass('multi-ship')) {
                        $('body').trigger('shipping:selectSingleShipping');
                    }

                    members.gotoStage('shipping');
                });

                $('.payment-summary .edit-button', plugin).on('click', function () {
                    members.gotoStage('payment');
                });

                //
                // remember stage (e.g. shipping)
                //
                updateUrl(members.currentStage);

                //
                // Listen for foward/back button press and move to correct checkout-stage
                //
                $(window).on('popstate', function (e) {
                    //
                    // Back button when event state less than current state in ordered
                    // checkoutStages array.
                    //
                    if (e.state === null ||
                        checkoutStages.indexOf(e.state) < members.currentStage) {
                        members.handlePrevStage(false);
                    } else if (checkoutStages.indexOf(e.state) > members.currentStage) {
                        // Forward button  pressed
                        members.handleNextStage(false);
                    }
                });

                //
                // Set the form data
                //
                plugin.data('formData', formData);
            },

            /**
             * The next checkout state step updates the css for showing correct buttons etc...
             */
            nextStage: function () {
                var promise = members.updateStage();

                promise.done(function () {
                    // Update UI with new stage
                    $('.error-message').hide();
                    members.handleNextStage(true);
                    window.console.log('nextStage sucess', members.currentStage);
                    //callAjax(members.currentStage);
                });

                promise.fail(function (data) {
                    // show errors
                    if (data) {
                        if (data.errorStage) {
                            members.gotoStage(data.errorStage.stage);

                            if (data.errorStage.step === 'billingAddress') {
                                var $billingAddressSameAsShipping = $(
                                    'input[name$="_shippingAddressUseAsBillingAddress"]'
                                );
                                if ($billingAddressSameAsShipping.is(':checked')) {
                                    $billingAddressSameAsShipping.prop('checked', false);
                                }
                            }
                        }

                        if (data.errorMessage) {
                            $('.error-message').show();
                            $('.error-message-text').text(data.errorMessage);
                        }
                    }
                });
            },

            /**
             * The next checkout state step updates the css for showing correct buttons etc...
             *
             * @param {boolean} bPushState - boolean when true pushes state using the history api.
             */
            handleNextStage: function (bPushState) {
                if (members.currentStage < checkoutStages.length - 1) {
                    // move stage forward
                    members.currentStage++;
                    //paypalDiv is showing in Next:Place Order and Place Order
                    window.console.log('members.currentStage in handlenextStage', members.currentStage);
                    //callAjax(members.currentStage);
                    //
                    // show new stage in url (e.g.payment)
                    //
                    if (bPushState) {
                        updateUrl(members.currentStage);
                    }
                }

                // Set the next stage on the DOM
                $(plugin).attr('data-checkout-stage', checkoutStages[members.currentStage]);
            },

            /**
             * Previous State
             */
            handlePrevStage: function () {
                if (members.currentStage > 0) {
                    // move state back
                    members.currentStage--;
                    //paypalDiv is hide at the time of Next:Payment button
                    window.console.log('members.currentStage handlePrevStage', members.currentStage);
                    //aurusCheckout.methods.getAurusSession();
                    updateUrl(members.currentStage);
                    //callAjax(members.currentStage);
                }

                $(plugin).attr('data-checkout-stage', checkoutStages[members.currentStage]);
            },

            /**
             * Use window history to go to a checkout stage
             * @param {string} stageName - the checkout state to goto
             */
            gotoStage: function (stageName) {
                window.console.log('gotoStage', members.currentStage);
                members.currentStage = checkoutStages.indexOf(stageName);
                //aurusCheckout.methods.getAurusSession();

                updateUrl(members.currentStage);
                //callAjax(members.currentStage);

                $(plugin).attr('data-checkout-stage', checkoutStages[members.currentStage]);
            },
        };
        window.console.log('members.currentStage before members initialize', members.currentStage);

        //
        // Initialize the checkout
        //
        members.initialize();

        return this;
    };
}(jQuery));


var exports = {

    showErrorMessage: function () {
        var urlString = window.location.href;
        var url = new URL(urlString);
        var paymentError = url.searchParams.get('paymentError');
        if (paymentError) {
            $('.error-message').show();
            $('.error-message-text').text(paymentError);
        }
    },

    initialize: function () {
       // Get and sets the iFrame src url for credit card checkout
    aurusCheckout.methods.getAurusSession();
    $('#checkout-main').aurusPayCheckout();

    // Handle saved cards for registered users
    if ($('.data-checkout-stage').data('customer-type') === 'registered') {
        // Attach change event to renew iFrame
        $('#paymentCardSelector').change(function () {
            var savedSelectedCard = $('#paymentCardSelector option:selected').data('uuid');
            aurusCheckout.methods.getAurusSession(savedSelectedCard);
        });
    }
    },

    updateCheckoutView: function () {
        $('body').on('checkout:updateCheckoutView', function (e, data) {
            if (data.csrfToken) {
                $("input[name*='csrf_token']").val(data.csrfToken);
            }
            customerHelpers.methods.updateCustomerInformation(data.customer, data.order);
            shippingHelpers.methods.updateMultiShipInformation(data.order);
            summaryHelpers.updateTotals(data.order.totals);
            data.order.shipping.forEach(function (shipping) {
                shippingHelpers.methods.updateShippingInformation(
                    shipping,
                    data.order,
                    data.customer,
                    data.options
                );
            });
            billingHelpers.methods.updateBillingInformation(
                data.order,
                data.customer,
                data.options
            );
            billingHelpers.methods.updatePaymentInformation(data.order, data.options);
            summaryHelpers.updateOrderProductSummaryInformation(data.order, data.options);
        });
    },

    disableButton: function () {
        $('body').on('checkout:disableButton', function (e, button) {
            $(button).prop('disabled', true);
        });
    },

    enableButton: function () {
        $('body').on('checkout:enableButton', function (e, button) {
            $(button).prop('disabled', false);
        });
    },
};
// Changed By me
[customerHelpers, billingHelpers, shippingHelpers, addressHelpers].forEach(function (library) {
    Object.keys(library).forEach(function (item) {
        if (typeof library[item] === 'object') {
            exports[item] = $.extend({}, exports[item], library[item]);
        } else {
            exports[item] = library[item];
        }
    });
});

module.exports = exports;