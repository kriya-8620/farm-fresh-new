const User = require("../models/user");

module.exports.showCartItems=async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            const user = await User.findById(req.user._id);
            res.render('carts/cart-items-page', { cartItems: user.cartItems });
        } else {
            res.render('carts/cart-not-logged-in');
        }
    } catch (error) {
        console.error('Error fetching cart items:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports.submitCart=async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({ error: 'You need to log in to add items to your cart.' });
        }

        const { name, price } = req.body;

        // Find the user
        const user = await User.findById(req.user._id);
     
       
        // Check if the item is already in the cart
        const existingItem = user.cartItems.find(item => item.name === name);

        if (existingItem) {
            // If the item exists, increment its quantity
            existingItem.quantity += 1;
        } else {
            // If the item doesn't exist, add it to the cart
            user.cartItems.push({ name, price, quantity: 1 });
        }
          
        // Save the updated user document
        await user.save();
        

        res.status(200).json(user.cartItems);
    } catch (error) {
        console.error('Error adding item to cart:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports.showCheckout=async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            const user = await User.findById(req.user._id);
            if (user.cartItems.length > 0) {
                res.render('carts/checkout-page');
            } else {
                res.redirect('/cart-items');
            }
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error fetching cart items:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports.submitCheckout=async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            const user = await User.findById(req.user._id);
            if (user.cartItems.length > 0) {
                // Process the checkout (this could involve payment processing, etc.)
                user.cartItems = []; // Clear the cart after checkout
                await user.save();
                res.redirect('/checkout-success');
            } else {
                res.redirect('/cart-items');
            }
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during checkout:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports.showCheckoutSuccess=(req, res) => {
    res.render('carts/checkout-success');
};