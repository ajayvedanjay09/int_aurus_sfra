'use strict';
var Aurus = require('./test');

window.jQuery = window.$ = require('jquery');

var spinner=require('base/components/spinner');

$(document).ready(function () {
    var actionUrl = aurusEndpoint; //var aurusEndpoint = "${URLUtils.url('AurusWallet-GetGenericJsonObj')}";
    console.log('actionUrl-->>', actionUrl);
    $.ajax({
        url: actionUrl,
        method: 'GET',
        data: {
            skipShippingAddress: '1',
        },
        success: function (data) {
            console.log('data.getGenericJsonObj--->>>', data.getGenericJsonObj);
            var jq = $.noConflict();
            jq(document).ready(function () {
                Aurus.aurusInit(data.getGenericJsonObj, jq);
            });
        },
        error: function (error) {
            console.error('Error fetching data:', error);
        }
    });
});

$('body').on('change', '.quantity-form > .quantity', function () {
    console.log('.quantity-form called to update quantity', aurusEndpoint);

    // Delay the AJAX call by 1 seconds (1000 milliseconds)
    setTimeout(function () {
        jQuery.noConflict();
        jQuery(document).ready(function ($) {
            $.ajax({
                url: aurusEndpoint,
                method: 'GET',
                data: {
                    skipShippingAddress: '1',
                },
                success: function (data) {
                    console.log('data.getGenericJsonObj--->>>', data.getGenericJsonObj);
                    var jq = $.noConflict();
                    jq(document).ready(function () {
                        Aurus.aurusInit(data.getGenericJsonObj, jq);
                    });
                },
                error: function (error) {
                    console.error('Error fetching data:', error);
                }
            });
        });
    }, 1000); // 1-second delay

});

$('body').on('click', '.update-cart-product-global', function (e) {
    console.log('updated');
    setTimeout(function () {
        jQuery.noConflict();
        jQuery(document).ready(function ($) {
            $.ajax({
                url: aurusEndpoint,
                method: 'GET',
                data: {
                    skipShippingAddress: '1',
                },
                success: function (data) {
                    console.log('data.getGenericJsonObj--->>>', data.getGenericJsonObj);
                    var jq = $.noConflict();
                    jq(document).ready(function () {
                        Aurus.aurusInit(data.getGenericJsonObj, jq);
                    });
                },
                error: function (error) {
                    console.error('Error fetching data:', error);
                }
            });
        });
    }, 1000); // 1-second delay
});

module.exports = Aurus;
