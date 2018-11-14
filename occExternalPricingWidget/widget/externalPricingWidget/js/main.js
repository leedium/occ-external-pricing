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
    'pageLayout/cart'
], function (ko, $, pubsub, CCConstants, CCLogger, cartViewModel) {
    "use strict";

    var POST = 'POST';
    var TYPE_JSON = 'json';
    var PRICING_URL = "https://sse.leedium.com/v1/webhook/externalPrice";

    var ERROR_EXTERNAL_PRICING = 51103;
    // var PRICING_URL = "/ccstorex/custom/v1/webhook/externalPricing"

    var cart = cartViewModel.getInstance();

    return {
        onLoad: function (widget) {
            //Subscribe to any Errors ths occur on the order Submission
            $.Topic(pubsub.topicNames.ORDER_SUBMISSION_FAIL).subscribe(function handleOrderFailure(orderObj) {
                if (orderObj.data.errors[j].errorCode === ERROR_EXTERNAL_PRICING) {
                    console.log(orderObj);
                    // todo handle this error;
                }
            });

            var pricingCallbackObj = {
                /**
                 *  Method gets called as soon as an item is added to the cart
                 *   only include items that do not have external prices applied
                 */
                prepricing: function () {
                    console.log('externalPricing:prepricing', cart);
                    var externalFound = false;
                    var cartObj = {
                        items: []
                    };
                    cartObj.items = widget.cart().items().reduce(function (a, item) {
                        if (typeof item.externalPrice() === 'undefined') {
                            a.push({
                                productId: item.productId,
                                catRefId: item.catRefId
                            });
                        } else {
                            externalFound = true;
                        }
                        return a;
                    }, []);

                    if (cartObj.items.length) {
                        $.ajax({
                            type: POST,
                            dataType: TYPE_JSON,
                            contentType: 'application/json',
                            url: PRICING_URL,
                            data: ko.toJSON(cart.items()),
                            success: function (cartData) {
                                cartData.items.map(function (externalItem) {
                                    cart.items().map(function (cartItem) {
                                        if (
                                            cartItem.productId === externalItem.productId &&
                                            cartItem.catRefId === externalItem.catRefId &&
                                            externalItem.externalPrice &&
                                            externalItem.externalPriceQuantity
                                        ) {
                                            cartItem.externalPrice(externalItem.externalPrice);
                                            cartItem.externalPriceQuantity(externalItem.externalPriceQuantity);
                                        }
                                    })
                                });
                                setTimeout(function () {
                                    widget.cart().markDirty();
                                }, 500);
                            },

                            function(err) {

                            }
                        })
                    }
                }
            };
            widget.cart().setCallbackFunctions(pricingCallbackObj);
        }
    };
});
