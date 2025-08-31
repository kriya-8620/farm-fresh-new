const { use } = require("passport");
const User = require("../models/user");
const ExpressError=require("../utils/ExpressError.js");
const sendOTP = require("../utils/sendOTP");
const crypto = require("crypto");



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

// controllers/usersController.js
module.exports.login = (req, res) => {
  try {
    sendOTP();
    res.render("users/login.ejs");

  } catch (err) {
    console.error("Render error:", err);
    res.send("Something went wrong while rendering the login page.");
  }
};



module.exports.submitLogin = async (req, res) => {
  try {
   res.redirect("/send-login-otp");
  
    const cart = await User.findById(req.user._id);
    if (cart) {
      req.session.cart = cart.cartItems;
    }

   
    req.flash("success", "Welcome to Farmfresh");
    const redirectUrl = res.locals.redirectUrl || "/farmers";
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Error retrieving cart items:", error);
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

               await User.findByIdAndUpdate(req.user._id, {
                  otpVerified: false});
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

// OTP Login
module.exports.sendLoginOTP = async (req, res) => {
  let user;
  if(req.user)
  {
    const user_id = req.user.user_id;
    user = await User.findOne({ user_id});

    if (!user.email) {
           req.flash("error", "Email not registered");
           return res.redirect("/login");
  }
  }

  if(!req.user)
  {
      const email = req.query.email; 
      
      user = await User.findOne({ email});
      
       if (!user) {
        req.flash("error", "Email not registered");
        return res.redirect("/forgot-password");
  }
  }
  
  const otp = crypto.randomInt(100000, 999999).toString();
  user.otp = otp;
  user.otpExpires = Date.now() + 5 * 60 * 1000;
  await user.save();
  
try{

await sendOTP(user.email, otp);

req.flash("success","OTP has been sent to your registered Email");
return res.render("users/otp.ejs");

}catch(err)
{
  req.flash("error","OTP Failed to send receipent");
 return res.render("users/login.ejs");
}
  
  /*req.flash("success", "OTP sent to your email");
  res.redirect("/verify-login-otp");*/
  
};

module.exports.verifyLoginOTP = async (req, res, next) => {
  const { otp } = req.body;

  const user = await User.findOne({ otp});
  
  
 
  if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
    req.flash("error", "Invalid or expired OTP");
    return res.redirect("/login");
  }

  user.otp = undefined;
  user.otpExpires = undefined;
  user.otpVerified=true;
  await user.save();

  req.login(user, (err) => {
    if (err) return next(err);
    req.flash("success", "Logged in via OTP");
    res.redirect("/farmers");
  });
};

module.exports.resetPassword=async(req,res,next)=>{

  const user_id = req.user.user_id;
  const user = await User.findOne({ user_id});

  // Optionally validate query params before rendering
  if (!user) {
    req.flash('error', 'User not Authenticated');
    return res.redirect('/login');
  }
  
  return res.render("users/reset.ejs");

}

module.exports.setPassword = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const user = await User.findOne({ user_id });
    const { newPassword } = req.body;

    if (!user) {
      req.flash('error', 'User not authenticated');
      return res.redirect('/login');
    }

    // Use passport-local-mongoose's setPassword method
    await user.setPassword(newPassword);
          user.otpVerified=false;
    await user.save();

    req.flash('success', 'Password updated successfully');
    res.redirect('/login');
  } catch (err) {
    console.error('Error setting password:', err);
    req.flash('error', 'Failed to update password');
    res.redirect('/set-new-password');
  }
};