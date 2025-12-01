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



module.exports=router;