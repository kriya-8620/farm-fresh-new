const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const passport = require('passport');
const { saveRedirectUrl } = require("../middleware");

const usersController=require("../controllers/users.js");

<<<<<<< HEAD

=======
>>>>>>> 4c7d39e3bbc23ed1d322c25e129c105b7c2abefd
router.get("/signup", wrapAsync(usersController.showSignup));



router.post("/signup", wrapAsync(usersController.submitSignup));

<<<<<<< HEAD

=======
>>>>>>> 4c7d39e3bbc23ed1d322c25e129c105b7c2abefd
router.get("/login", wrapAsync(usersController.login));

router.post("/login", 
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
<<<<<<< HEAD
        failureFlash: "Invalid username or password",
    }),wrapAsync(usersController.submitLogin));


=======
        failureFlash: true
    }), wrapAsync(usersController.submitLogin));
>>>>>>> 4c7d39e3bbc23ed1d322c25e129c105b7c2abefd

// Route for logging out
router.get('/logout', wrapAsync(usersController.logout));

<<<<<<< HEAD

router.get("/send-login-otp", wrapAsync(usersController.sendLoginOTP));
router.post("/verify-login-otp",wrapAsync(usersController.verifyLoginOTP)  
)

// Change the Password
router.get('/reset-password',
    saveRedirectUrl,
    wrapAsync(usersController.resetPassword));

router.post('/set-password',
    saveRedirectUrl,
    wrapAsync(usersController.setPassword));


router.get("/forgot-password", (req, res) => {
  res.render("users/forgot.ejs");
});

=======
>>>>>>> 4c7d39e3bbc23ed1d322c25e129c105b7c2abefd
module.exports = router;
