const express=require("express");
const router=express.Router();
const User=require("../model/user");
const wrapAsyc=require("../utils/wrapAsyc");
const passport = require("passport");
const {savedRedirectUrl}=require('../middlewares/islogedin')



router.get("/signup",(req,res)=>{
    res.render("./users/signup.ejs")
})

router.post("/signup",wrapAsyc(async(req,res,next)=>{
    try{
        let {username,email,password}=req.body;
        const newUser= new User({email,username});
        const registeredUser=await User.register(newUser,password)
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","welcome to Wanderlust")
            res.redirect("/listing")
        })
       
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
    savedRedirectUrl,// this meddel ware can access the redirecturl fromm the user
    passport.authenticate(
        "local",
        {failureRedirect:'/login',failureFlash:true}// passport autonticate automatically autonticat the user if fail it redirect "/login page " and flash the failure all are done by the passport autonticate middleware
    ),
    async (req,res)=>{// passing the autonticate the user as in the form of the middleware
      req.flash("success","welcome back to Wanderlust")

      // when in login we are going to access the directly 
      // that time islogedin middleware dont get triggerr and is login not get trigger that time  res.locals.redirectUrl is become undefined in sessin also value not stored
      // that time we unable to get the routes then  we are useing the conditions
      // this flow is most important flow
    //   res.redirect(res.locals.redirectUrl)

      let redirectUrl=res.locals.redirectUrl || "/listing";
      res.redirect(redirectUrl);

        
    }
)

router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
         next();
        }
        req.flash("success","successfully logged Out!");
        res.redirect("/listing")
    })
})
module.exports=router;