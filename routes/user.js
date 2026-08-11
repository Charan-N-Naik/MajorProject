const express=require("express");
const router=express.Router();
const User=require("../model/user");
const wrapAsyc=require("../utils/wrapAsyc");
const passport = require("passport");
const {savedRedirectUrl}=require('../middlewares/islogedin')
const usersController=require("../controller/users")






router.route("/signup")
.get(usersController.renderSingupForm)
.post(
    wrapAsyc(usersController.signUp)
);


router.route("/login")
.get(usersController.renderLoginForm)
.post(
    savedRedirectUrl,// this meddel ware can access the redirecturl fromm the user
    passport.authenticate(
        "local",
        {failureRedirect:'/login',failureFlash:true}// passport autonticate automatically autonticat the user if fail it redirect "/login page " and flash the failure all are done by the passport autonticate middleware
    ),
    usersController.login
   
);

router.get("/logout",
    usersController.logout
);

const { sendOTP } = require("../utils/otpService");

router.get("/otp-login", (req, res) => {
    res.render("users/otp-request.ejs");
});

router.post("/send-otp", wrapAsyc(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        req.flash("error", "Email not registered!");
        return res.redirect("/otp-login");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins
    await user.save();

    try {
        await sendOTP(email, otp);
        req.session.verifyEmail = email;
        req.flash("success", "OTP sent successfully to your email!");
        res.redirect("/verify-otp");
    } catch (err) {
        console.error(err);
        req.flash("error", "Failed to send OTP email. Please check your config.");
        res.redirect("/otp-login");
    }
}));

router.get("/verify-otp", (req, res) => {
    if (!req.session.verifyEmail) {
        req.flash("error", "Please request an OTP first.");
        return res.redirect("/otp-login");
    }
    res.render("users/otp-verify.ejs", { email: req.session.verifyEmail });
});

router.post("/verify-otp", savedRedirectUrl, wrapAsyc(async (req, res, next) => {
    const { otp } = req.body;
    const email = req.session.verifyEmail;

    if (!email) {
        req.flash("error", "Session expired or invalid. Try again.");
        return res.redirect("/otp-login");
    }

    const user = await User.findOne({
        email,
        otp,
        otpExpires: { $gt: Date.now() }
    });

    if (!user) {
        req.flash("error", "Invalid or expired OTP!");
        return res.redirect("/verify-otp");
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    req.login(user, (err) => {
        if (err) return next(err);
        req.flash("success", "welcome back to Wanderlust");
        delete req.session.verifyEmail;
        let redirectUrl = res.locals.redirectUrl || "/listing";
        res.redirect(redirectUrl);
    });
}));

module.exports=router;