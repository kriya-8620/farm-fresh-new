const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const passport = require('passport');
const { saveRedirectUrl } = require("../middleware");

const usersController=require("../controllers/users.js");

router.get("/signup", wrapAsync(usersController.showSignup));



router.post("/signup", wrapAsync(usersController.submitSignup));

router.get("/login", wrapAsync(usersController.login));

router.post("/login", 
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }), wrapAsync(usersController.submitLogin));

// Route for logging out
router.get('/logout', wrapAsync(usersController.logout));

module.exports = router;
