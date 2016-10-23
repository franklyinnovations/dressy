var config = require('../config');
var express = require('express');
var shopifyAPI = require('shopify-node-api');
var bodyParser = require('body-parser');
var app = express();
var Sentencer = require('sentencer');
var helpers = require('../helpers/functions');
var Chance = require('chance');

app.use(bodyParser.urlencoded({extended: true}));

// Models
var Shop = require('../models/shop');
// Session variable
var sess;
// dashboard
exports.dashboard = function (req, res) {
    var foods = [
        { name: 'Sushi', vendor: 'Set the Bar' },
        { name: 'Bread', vendor: 'Braker Brad' },
        { name: 'Sandwich', vendor: 'Muk Dunloud' }
    ];

    res.render('index', {
            foods: foods
        });
};

exports.createFoodMenu = function(req, res){
    sess = req.session;
    var chance = new Chance();
    var times = req.body.mTimes;
    var status = "Created " + times + " products for you!\n";

    chance.mixin({
        'product': function() {
            return {
                title: Sentencer.make("{{ an_adjective }} {{ noun }}"),
                vendor: Sentencer.make("{{ noun }}"),
                product_type: Sentencer.make("{{ noun }}"),
                body_html: chance.paragraph({sentences: 8}),
                tags:Sentencer.make("{{ adjective }}, {{ adjective }}, {{ adjective }}, {{ adjective }}"),
                metafields_global_title_tag : Sentencer.make("{{ an_adjective }} {{ noun }}"),
                metafields_global_description_tag : chance.paragraph({sentences: 2}),
                variants : [
                    {
                        inventory_management : chance.pickone(['', 'shopify']),
                        inventory_quantity : chance.integer({min:0, max: 10000}),
                        price : chance.dollar({min: 0, max: 5000}),
                        requires_shipping: chance.bool(),
                        weight: chance.floating({min: 0, max: 50, fixed: 2}),
                        weight_unit: chance.pickone(['lb','oz','g','kg']),
                        taxable: chance.bool()
                    }
                ],
                images : [
                    {
                        src: "http:\/\/lorempixel.com\/600\/600"
                    },
                    {
                        src: "http:\/\/lorempixel.com\/600\/600"
                    }
                ]
            };
        }
    });

    var Shopify = new shopifyAPI({
        shop: sess.shop,
        shopify_api_key: config.shopify.api_key,
        shopify_shared_secret: config.shopify.shared_secret,
        access_token: sess.token
    });

    for(var i = 0; i < times; i++){
        var name = Sentencer.make("{{ an_adjective }} {{ noun }}");
        var product = {
            "product": chance.product()
        };

        Shopify.post('/admin/products.json', product, function (err, data, headers) {
            console.log(product);
        });
    }

    res.send(status);

};


// uninstalling the app
exports.uninstall = function (req, res) {
    if (helpers.verify_webhook(req.headers, req.body)) {
        if (req.headers['x-shopify-shop-domain']) {
            var my_shop = req.headers['x-shopify-shop-domain'];
            if (helpers.is_shopify_store(my_shop)) {
                // find store and remove from database
                Shop.findOne({myshopify_domain: my_shop}, function (err, shopObj) {
                    if (shopObj) {
                        shopObj.remove(function (err) {
                            if (err) {
                                console.log('---> Error: removing store from database');
                                res.sendStatus(500);
                            }
                            else {
                                console.log(my_shop + ': uninstalled your app');
                                res.sendStatus(200);
                            }
                        });
                    }
                });
            }
            else console.log('---> Error: not shopify store');
        }
        else console.log('---> Error: not shopify store');
    }
    else console.log('---> Error: invalid shopify uninstall webhook request');
};