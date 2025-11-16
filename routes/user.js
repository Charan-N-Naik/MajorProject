const express=require("express");
const router=express.Router();
const User=require("../model/user");
const wrapAsyc=require("../utils/wrapAsyc");
const passport = require("passport");




router.get("/signup",(req,res)=>{
    res.render("./users/signup.ejs")
})

router.post("/signup",wrapAsyc(async(req,res)=>{
    try{
         let {username,email,password}=req.body;
        const newUser= new User({email,username});
        const registeredUser=  await User.register(newUser,password)
        console.log(registeredUser);
        req.flash("success","welcome to Wanderlust")
        res.redirect("/listing")

    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}))

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})
router.post(
    "/login",
    passport.authenticate(
        "local",
        {failureRedirect:'/login',failureFlash:true}// passport autonticate automatically autonticat the user if fail it redirect "/login page " and flash the failure all are done by the passport autonticate middleware
    ),
    async (req,res)=>{// passing the autonticate the user as in the form of the middleware
      req.flash("success","welcome back to Wanderlust")
      res.redirect("/listing")
    }
)
module.exports=router;