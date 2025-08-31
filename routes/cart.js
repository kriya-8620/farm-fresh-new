const express = require("express");
const router = express.Router();

const wrapAsync=require("../utils/wrapAsync.js");
const cartsController=require("../controllers/carts.js");

// Route to render the cart items page
router.get('/cart-items', wrapAsync(cartsController.showCartItems));

// Routes
router.post('/addToCart',wrapAsync(cartsController.submitCart));

// Route to render the checkout page
router.get('/checkout', wrapAsync(cartsController.showCheckout));

// Route to handle the checkout process
router.post('/checkout', wrapAsync(cartsController.submitCheckout));


// Route to render the checkout success page
router.get('/checkout-success', wrapAsync(cartsController.showCheckoutSuccess));

module.exports = router;
