var express = require('express');
var router = express.Router();
var config = require('./config');

//controllers
var shop = require('./controllers/shop'); //login, payment
var the_app = require('./controllers/the_app'); //dashboard

//middleware
var auth = require('./middlewares/auth'); //login checker

// install routes
//https://thehackerfirm.myshopify.com/admin/oauth/authorize?redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&scope=read_products&client_id=9c028b59162eb68d55da9d0db2285432
router.get('/', the_app.homepage);
router.get('/shopify', auth.verify_shop_name, the_app.index);
router.get('/login', auth.hasNonce, shop.login);
router.get('/payments', auth.hasToken, shop.payments);
router.get('/charge', auth.hasCharge, shop.charge);
router.get('/dashboard', auth.hasToken, the_app.dashboard);


router.get('*', function(req,res,next){
    return res.status(404).render('404');
});

module.exports = router;
