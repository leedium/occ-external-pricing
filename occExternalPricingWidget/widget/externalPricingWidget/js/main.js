/* global define */
/**
 * @project adyen
 * @file main.js
 * @company leedium
 * @createdBy davidlee
 * @contact support@leedium.com
 * @dateCreated 02/10/2018
 * @description Extends the storefront’s CartViewModel class by implementing a prepricing callback function.
 *              When a shopper modifies the shopping cart by adding or removing products or changing quantities,
 *              this function makes a call to the external pricing system to obtain prices for the items in the cart.
 **/

define([
    "knockout",
    "jquery",
    "pubsub",
    "ccConstants",
    "ccLogger",
], function (ko, $, pubsub, CCConstants, CCLogger) {
    "use strict";

    var POST = 'POST';
    var TYPE_JSON = 'json';
    var PRICING_URL = "https://sse.leedium.com/v1/leedium/externalPrice";
    // var PRICING_URL = "/ccstorex/custom/v1/leedium/externalPricing"

    return {
        onLoad: function (widget) {
            var pricingCallbackObj = {
                /**
                 *  Method gets called as soon as an item is added to the cart
                 *   only include items that do not have external prices applied
                 */
                prepricing: function () {
                    console.log('cart', widget.cart().items());
                    var cartObj = {
                        items: []
                    };
                    cartObj.items = widget.cart().items().reduce(function (a, item) {
                        if (typeof item.externalPrice() === 'undefined') {
                            a.push({
                                productId: item.productId,
                                catRefId: item.catRefId
                            });
                        }
                        return a;
                    }, []);

                    if (cartObj.items.length) {
                        console.log('PREPRICING', cartObj);
                        $.ajax({
                            type: POST,
                            dataType: TYPE_JSON,
                            contentType: 'application/json',
                            url: PRICING_URL,
                            data: JSON.stringify(cartObj),
                            success: function (data) {
                                if (data.items.length) {
                                    data.items.map(function (item) {
                                        widget.cart().items().map(function (cartItem) {
                                            if (
                                                cartItem.productId === item.productId &&
                                                cartItem.catRefId === item.catRefId &&
                                                item.externalPrice &&
                                                item.externalPriceQuantity
                                            ) {
                                                cartItem.externalPrice(item.externalPrice);
                                                cartItem.externalPriceQuantity(item.externalPriceQuantity);
                                            }
                                        })
                                    });
                                    widget.cart().markDirty();
                                    console.log(widget.cart())
                                }
                            },
                            error: function (err) {

                            }
                        })
                    }
                }
            };
            console.log('[External Pricing Widget]');
            widget.cart().setCallbackFunctions(pricingCallbackObj);
        }
    };
});
