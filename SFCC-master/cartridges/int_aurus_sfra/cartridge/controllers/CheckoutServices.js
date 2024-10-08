'use strict';

var checkoutServicesBase = require('app_storefront_base/cartridge/controllers/CheckoutServices');
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var server = require('server');
server.extend(checkoutServicesBase);

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

/**
 *  Handle Ajax payment (and billing) form submit
 */
server.replace(
    'SubmitPayment',
    server.middleware.https,
    csrfProtection.validateAjaxRequest,
    function (req, res, next) {
        var PaymentManager = require('dw/order/PaymentMgr');
        var HookManager = require('dw/system/HookMgr');
        var Resource = require('dw/web/Resource');
        var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');

        var viewData = {};
        var paymentForm = server.forms.getForm('billing');

        // verify billing form data
        var billingFormErrors = COHelpers.validateBillingForm(paymentForm.addressFields);
        var contactInfoFormErrors = COHelpers.validateFields(paymentForm.contactInfoFields);

        var formFieldErrors = [];
        if (Object.keys(billingFormErrors).length) {
            formFieldErrors.push(billingFormErrors);
        } else {
            viewData.address = {
                firstName: { value: paymentForm.addressFields.firstName.value },
                lastName: { value: paymentForm.addressFields.lastName.value },
                address1: { value: paymentForm.addressFields.address1.value },
                address2: { value: paymentForm.addressFields.address2.value },
                city: { value: paymentForm.addressFields.city.value },
                postalCode: { value: paymentForm.addressFields.postalCode.value },
                countryCode: { value: paymentForm.addressFields.country.value }
            };

            if (Object.prototype.hasOwnProperty.call(paymentForm.addressFields, 'states')) {
                viewData.address.stateCode = { value: paymentForm.addressFields.states.stateCode.value };
            }
        }

        if (Object.keys(contactInfoFormErrors).length) {
            formFieldErrors.push(contactInfoFormErrors);
        } else {
            // Changed By me
            // viewData.email = {
            //     value: paymentForm.contactInfoFields.email.value
            // };

            viewData.phone = { value: paymentForm.contactInfoFields.phone.value };
        }

        var paymentMethodIdValue = paymentForm.paymentMethod.value;
        if (!PaymentManager.getPaymentMethod(paymentMethodIdValue).paymentProcessor) {
            throw new Error(Resource.msg(
                'error.payment.processor.missing',
                'checkout',
                null
            ));
        }

        var paymentProcessor = PaymentManager.getPaymentMethod(paymentMethodIdValue).getPaymentProcessor();

        var paymentFormResult;
        if (HookManager.hasHook('app.payment.form.processor.' + paymentProcessor.ID.toLowerCase())) {
            paymentFormResult = HookManager.callHook('app.payment.form.processor.' + paymentProcessor.ID.toLowerCase(),
                'processForm',
                req,
                paymentForm,
                viewData
            );
        } else {
            paymentFormResult = HookManager.callHook('app.payment.form.processor.default_form_processor', 'processForm');
        }

        if (paymentFormResult.error && paymentFormResult.fieldErrors) {
            formFieldErrors.push(paymentFormResult.fieldErrors);
        }

        if (formFieldErrors.length || paymentFormResult.serverErrors) {
            // respond with form data and errors
            res.json({
                form: paymentForm,
                fieldErrors: formFieldErrors,
                serverErrors: paymentFormResult.serverErrors ? paymentFormResult.serverErrors : [],
                error: true
            });
            return next();
        }

        res.setViewData(paymentFormResult.viewData);

        this.on('route:BeforeComplete', function (req, res) { // eslint-disable-line no-shadow
            var BasketMgr = require('dw/order/BasketMgr');
            var HookMgr = require('dw/system/HookMgr');
            var PaymentMgr = require('dw/order/PaymentMgr');
            var PaymentInstrument = require('dw/order/PaymentInstrument');
            var Transaction = require('dw/system/Transaction');
            var AccountModel = require('*/cartridge/models/account');
            var OrderModel = require('*/cartridge/models/order');
            var URLUtils = require('dw/web/URLUtils');
            var Locale = require('dw/util/Locale');
            var basketCalculationHelpers = require('*/cartridge/scripts/helpers/basketCalculationHelpers');
            var hooksHelper = require('*/cartridge/scripts/helpers/hooks');
            var validationHelpers = require('*/cartridge/scripts/helpers/basketValidationHelpers');

            var currentBasket = BasketMgr.getCurrentBasket();
            var validatedProducts = validationHelpers.validateProducts(currentBasket);

            var billingData = res.getViewData();

            if (!currentBasket || validatedProducts.error) {
                delete billingData.paymentInformation;

                res.json({
                    error: true,
                    cartError: true,
                    fieldErrors: [],
                    serverErrors: [],
                    redirectUrl: URLUtils.url('Cart-Show').toString()
                });
                return;
            }

            var billingAddress = currentBasket.billingAddress;
            var billingForm = server.forms.getForm('billing');
            var paymentMethodID = billingData.paymentMethod.value;
            var result;

            billingForm.creditCardFields.cardNumber.htmlValue = '';
            billingForm.creditCardFields.securityCode.htmlValue = '';

            Transaction.wrap(function () {
                if (!billingAddress) {
                    billingAddress = currentBasket.createBillingAddress();
                }

                billingAddress.setFirstName(billingData.address.firstName.value);
                billingAddress.setLastName(billingData.address.lastName.value);
                billingAddress.setAddress1(billingData.address.address1.value);
                billingAddress.setAddress2(billingData.address.address2.value);
                billingAddress.setCity(billingData.address.city.value);
                billingAddress.setPostalCode(billingData.address.postalCode.value);
                if (Object.prototype.hasOwnProperty.call(billingData.address, 'stateCode')) {
                    billingAddress.setStateCode(billingData.address.stateCode.value);
                }
                billingAddress.setCountryCode(billingData.address.countryCode.value);

                if (billingData.storedPaymentUUID) {
                    billingAddress.setPhone(req.currentCustomer.profile.phone);
                    currentBasket.setCustomerEmail(req.currentCustomer.profile.email);
                } else {
                    billingAddress.setPhone(billingData.phone.value);
                    //currentBasket.setCustomerEmail(billingData.email.value);
                }
            });

            // if there is no selected payment option and balance is greater than zero
            if (!paymentMethodID && currentBasket.totalGrossPrice.value > 0) {
                var noPaymentMethod = {};

                noPaymentMethod[billingData.paymentMethod.htmlName] =
                    Resource.msg('error.no.selected.payment.method', 'payment', null);

                delete billingData.paymentInformation;

                res.json({
                    form: billingForm,
                    fieldErrors: [noPaymentMethod],
                    serverErrors: [],
                    error: true
                });
                return;
            }

            // Validate payment instrument
            var creditCardPaymentMethod = PaymentMgr.getPaymentMethod(PaymentInstrument.METHOD_CREDIT_CARD);
            var paymentCard = PaymentMgr.getPaymentCard(billingData.paymentInformation.cardType.value);

            var applicablePaymentCards = creditCardPaymentMethod.getApplicablePaymentCards(
                req.currentCustomer.raw,
                req.geolocation.countryCode,
                null
            );

            if (!applicablePaymentCards.contains(paymentCard)) {
                // Invalid Payment Instrument
                var invalidPaymentMethod = Resource.msg('error.payment.not.valid', 'checkout', null);
                delete billingData.paymentInformation;
                res.json({
                    form: billingForm,
                    fieldErrors: [],
                    serverErrors: [invalidPaymentMethod],
                    error: true
                });
                return;
            }

            // check to make sure there is a payment processor
            if (!PaymentMgr.getPaymentMethod(paymentMethodID).paymentProcessor) {
                throw new Error(Resource.msg(
                    'error.payment.processor.missing',
                    'checkout',
                    null
                ));
            }

            var processor = PaymentMgr.getPaymentMethod(paymentMethodID).getPaymentProcessor();

            if (HookMgr.hasHook('app.payment.processor.' + processor.ID.toLowerCase())) {
                result = HookMgr.callHook('app.payment.processor.' + processor.ID.toLowerCase(),
                    'Handle',
                    currentBasket,
                    billingData.paymentInformation
                );
            } else {
                result = HookMgr.callHook('app.payment.processor.default', 'Handle');
            }

            // need to invalidate credit card fields
            if (result.error) {
                delete billingData.paymentInformation;

                res.json({
                    form: billingForm,
                    fieldErrors: result.fieldErrors,
                    serverErrors: result.serverErrors,
                    error: true
                });
                return;
            }

            // Calculate the basket
            Transaction.wrap(function () {
                basketCalculationHelpers.calculateTotals(currentBasket);
            });

            // Re-calculate the payments.
            var calculatedPaymentTransaction = COHelpers.calculatePaymentTransaction(
                currentBasket
            );

            if (calculatedPaymentTransaction.error) {
                res.json({
                    form: paymentForm,
                    fieldErrors: [],
                    serverErrors: [Resource.msg('error.technical', 'checkout', null)],
                    error: true
                });
                return;
            }

            var usingMultiShipping = req.session.privacyCache.get('usingMultiShipping');
            if (usingMultiShipping === true && currentBasket.shipments.length < 2) {
                req.session.privacyCache.set('usingMultiShipping', false);
                usingMultiShipping = false;
            }
            // Changed By me
           // hooksHelper('app.customer.subscription', 'subscribeTo', [paymentForm.subscribe.checked, paymentForm.contactInfoFields.email.htmlValue], function () {});
           hooksHelper('app.customer.subscription', 'subscribeTo', [paymentForm.subscribe.checked, currentBasket.customerEmail], function () {});
            var currentLocale = Locale.getLocale(req.locale.id);

            var basketModel = new OrderModel(
                currentBasket,
                { usingMultiShipping: usingMultiShipping, countryCode: currentLocale.country, containerView: 'basket' }
            );

            var accountModel = new AccountModel(req.currentCustomer);
            var renderedStoredPaymentInstrument = COHelpers.getRenderedPaymentInstruments(
                req,
                accountModel
            );

            delete billingData.paymentInformation;

            res.json({
                renderedPaymentInstruments: renderedStoredPaymentInstrument,
                customer: accountModel,
                order: basketModel,
                form: billingForm,
                error: false
            });
        });

        return next();
    }
);

server.replace('PlaceOrder',
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

        // Models for Auth call
        var BillingAddressModel = require('*/cartridge/models/billingAddress');
        var ShippingAddressModel = require('*/cartridge/models/shippingAddress');
        var EcommInfoModel = require('*/cartridge/models/ecommInfo');
        var TransAmountDetails = require('*/cartridge/models/transactionDetails');
        var Level3Products = require('*/cartridge/models/aurusLevelThreeProduct');

        var currentBasket = BasketMgr.getCurrentBasket();
        var validatedProducts = validationHelpers.validateProducts(currentBasket);

        if (!currentBasket || validatedProducts.error) {
            res.json({
                error: true,
                cartError: true,
                fieldErrors: [],
                serverErrors: [],
                redirectUrl: URLUtils.url('Cart-Show').toString()
            });
            return next();
        }

        if (req.session.privacyCache.get('fraudDetectionStatus')) {
            res.json({
                error: true,
                cartError: true,
                redirectUrl: URLUtils.url('Error-ErrorCode', 'err', '01').toString(),
                errorMessage: Resource.msg('error.technical', 'checkout', null)
            });

            return next();
        }

        var validationOrderStatus = hooksHelper('app.validate.order', 'validateOrder', currentBasket, require('*/cartridge/scripts/hooks/validateOrder').validateOrder);
        if (validationOrderStatus.error) {
            res.json({
                error: true,
                errorMessage: validationOrderStatus.message
            });
            return next();
        }

        // Check to make sure there is a shipping address
        if (currentBasket.defaultShipment.shippingAddress === null) {
            res.json({
                error: true,
                errorStage: {
                    stage: 'shipping',
                    step: 'address'
                },
                errorMessage: Resource.msg('error.no.shipping.address', 'checkout', null)
            });
            return next();
        }

        // Check to make sure billing address exists
        if (!currentBasket.billingAddress) {
            res.json({
                error: true,
                errorStage: {
                    stage: 'payment',
                    step: 'billingAddress'
                },
                errorMessage: Resource.msg('error.no.billing.address', 'checkout', null)
            });
            return next();
        }

        // Calculate the basket
        Transaction.wrap(function () {
            basketCalculationHelpers.calculateTotals(currentBasket);
        });

        // Re-validates existing payment instruments
        var validPayment = COHelpers.validatePayment(req, currentBasket);
        if (validPayment.error) {
            res.json({
                error: true,
                errorStage: {
                    stage: 'payment',
                    step: 'paymentInstrument'
                },
                errorMessage: Resource.msg('error.payment.not.valid', 'checkout', null)
            });
            return next();
        }

        // Re-calculate the payments.
        var calculatedPaymentTransactionTotal = COHelpers.calculatePaymentTransaction(currentBasket);
        if (calculatedPaymentTransactionTotal.error) {
            res.json({
                error: true,
                errorMessage: Resource.msg('error.technical', 'checkout', null)
            });
            return next();
        }

        // Creates a new order.
        var order = COHelpers.createOrder(currentBasket);
        if (!order) {
            res.json({
                error: true,
                errorMessage: Resource.msg('error.technical', 'checkout', null)
            });
            return next();
        }
        var paymentForm = server.forms.getForm('billing');

        // Next get Aurus OTT
        var ott = { value: paymentForm.creditCardFields.ott.value };
        var cardType = paymentForm.creditCardFields.cardType.value;
        var aurusCardType = cardType;

        // Test for Custom Aurus site prefs
        if (Site.current.getCustomPreferenceValue('Aurus_storeId') === null && Site.current.getCustomPreferenceValue('Aurus_merchantIdentifier') === null && Site.current.getCustomPreferenceValue('Aurus_terminalId') === null) {
            res.json({
                error: true,
                errorMessage: Resource.msg('error.technical', 'checkout', null)
            });
            return next();
        }

        // Prepare request body for auth call
        var aurusShippingAddress = new ShippingAddressModel({ shipping: order.defaultShipment.shippingAddress, email: order.customerEmail, phone: order.defaultShipment.shippingAddress.phone });
        var aurusEcommInfo = new EcommInfoModel(
            {
                storeId: Site.current.getCustomPreferenceValue('Aurus_storeId'),
                oneTimeToken: ott,
                merchantId: Site.current.getCustomPreferenceValue('Aurus_merchantIdentifier'),
                terminalId: Site.current.getCustomPreferenceValue('Aurus_terminalId'),
                cardId: '',
                oneOrderToken: ''
            }
        );
        var aurusBillingAddress = new BillingAddressModel({ billing: order.billingAddress, email: order.customerEmail, phone: order.billingAddress.phone });
        var aurusTransAmountDetails = new TransAmountDetails(order);
        var aurusProducts = new Level3Products(order);
        var aurusInvoiceNumber = order.orderNo;

        // Aurus PreAuth Call
        var authResult = aurusPreAuth({ ShippingAddress: aurusShippingAddress, ECOMMInfo: aurusEcommInfo, cardType: aurusCardType, BillingAddress: aurusBillingAddress, TransAmountDetails: aurusTransAmountDetails, orderNo: aurusInvoiceNumber, Level3ProductsData: aurusProducts });

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

        var aurusTokens = {
            aurusPayOOT: authResult.TransResponse.TransDetailsData.TransDetailData.ECOMMInfo !== null ? authResult.TransResponse.TransDetailsData.TransDetailData.ECOMMInfo.OneOrderToken : '',
            aurusPayAPTN: authResult.TransResponse.AurusPayTicketNum !== null ? authResult.TransResponse.AurusPayTicketNum : '',
            aurusPayAPTID: authResult.TransResponse.TransDetailsData.TransDetailData.AuruspayTransactionId !== null ? authResult.TransResponse.TransDetailsData.TransDetailData.AuruspayTransactionId : '',
            isEmpty: (authResult.TransResponse.TransDetailsData.TransDetailData.ECOMMInfo.OneOrderToken + authResult.TransResponse.AurusPayTicketNum + authResult.TransResponse.TransDetailsData.TransDetailData.AuruspayTransactionId).length === 0
        };

        // Handles payment authorization and attaches Aurus One Order Token (OOT) to Payment Transaction
        var handlePaymentResult = COHelpers.handlePayments(order, order.orderNo, aurusTokens);
        if (handlePaymentResult.error) {
            res.json({
                error: true,
                errorMessage: Resource.msg('error.technical', 'checkout', null)
            });
            return next();
        }

        // Save the credit card data to customer profile if save card is checked
        var billingData = paymentForm;
        billingData.saveCard = billingData.creditCardFields.saveCard.checked;
        billingData.cardIdentifier = authResult.TransResponse.TransDetailsData.TransDetailData.CardIdentifier;
        var paymentMethodID = order.paymentInstrument.paymentMethod;
        var processor = PaymentMgr.getPaymentMethod(paymentMethodID).getPaymentProcessor();

        if (HookMgr.hasHook('app.payment.form.processor.' + processor.ID.toLowerCase())) {
            HookMgr.callHook('app.payment.form.processor.' + processor.ID.toLowerCase(),
                'savePaymentInformation',
                req,
                order,
                billingData
            );
        } else {
            HookMgr.callHook('app.payment.form.processor.default', 'savePaymentInformation');
        }

        var fraudDetectionStatus = hooksHelper('app.fraud.detection', 'fraudDetection', currentBasket, require('*/cartridge/scripts/hooks/fraudDetection').fraudDetection);
        if (fraudDetectionStatus.status === 'fail') {
            Transaction.wrap(function () { OrderMgr.failOrder(order); });

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
        if (placeOrderResult.error) {
            res.json({
                error: true,
                errorMessage: Resource.msg('error.technical', 'checkout', null)
            });
            return next();
        }

        if (req.currentCustomer.addressBook) {
            // save all used shipping addresses to address book of the logged in customer
            var allAddresses = addressHelpers.gatherShippingAddresses(order);
            allAddresses.forEach(function (address) {
                if (!addressHelpers.checkIfAddressStored(address, req.currentCustomer.addressBook.addresses)) {
                    addressHelpers.saveAddress(address, req.currentCustomer, addressHelpers.generateAddressName(address));
                }
            });
        }

        COHelpers.sendConfirmationEmail(order, req.locale.id);

        // Reset usingMultiShip after successful Order placement
        req.session.privacyCache.set('usingMultiShipping', false);

        // TODO: Exposing a direct route to an Order, without at least encoding the orderID
        //  is a serious PII violation.  It enables looking up every customers orders, one at a
        //  time.
        // var Logger = require('dw/system/Logger');
        // Logger.debug('orderID----->>>{0}',order.orderNo);
        // Logger.debug('orderToken----->>>{0}',order.orderToken);
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
