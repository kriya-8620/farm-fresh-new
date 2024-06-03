const User = require("../models/user");
const ExpressError=require("../utils/ExpressError.js");

module.exports.showSignup=(req, res) => {
    res.render("users/signup");
};

module.exports.submitSignup=async (req, res, next) => { 
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Farmfresh");
            res.redirect("/farmers");
        });

    } catch (err) {
        req.flash("error", "Given Username or Email already exists");
        res.redirect("/signup");
    }
};

module.exports.login=(req, res) => {
    res.render("users/login.ejs");
};

module.exports.submitLogin=async (req, res) => {
    try {
        // Retrieve the user's cart items from the database
        if (req.isAuthenticated()) {
            const cart = await User.findOne({ _id: req.user._id });
            
            if (cart) {
               req.session.cart = cart.cartItems;
                
            }
        }
        req.flash("success", "Welcome to Farmfresh");
        let redirectUrl = res.locals.redirectUrl || "/farmers";
        res.redirect(redirectUrl);
    } catch (error) {
        console.error('Error retrieving cart items:', error);
        req.flash("error", "An error occurred. Please try again.");
        res.redirect("/login");
    }
};

module.exports.logout=async(req, res) => {
    try {
        // Save the cart items in the database if the user is logged in
        if (req.isAuthenticated()) {
            await User.findOneAndUpdate(
                
                { items: req.user.cart },
                { new: true,upsert: true }
            );
        }
        
        req.logout((err) => {
            if (err) {
                console.error('Error logging out:', err);
                 throw new ExpressError(500,err);
            }
            req.flash("success", "You are logged out");
            res.redirect("/farmers");
        });
    } catch (error) {
        console.error('Error logging out:', error.message);
        throw new ExpressError(500,error);
    }
};