const User=require("../model/user");



module.exports.renderSingupForm=(req,res)=>{
    res.render("./users/signup.ejs")
}

module.exports.signUp=async(req,res,next)=>{
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
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs")
}

module.exports.login= async (req,res)=>{// passing the autonticate the user as in the form of the middleware
    req.flash("success","welcome back to Wanderlust")

    // when in login we are going to access the directly 
    // that time islogedin middleware dont get triggerr and is login not get trigger that time  res.locals.redirectUrl is become undefined in sessin also value not stored
    // that time we unable to get the routes then  we are useing the conditions
    // this flow is most important flow
//   res.redirect(res.locals.redirectUrl)

    let redirectUrl=res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);

    
};

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
        return  next();
        }
        req.flash("success","successfully logged Out!");
        res.redirect("/listing")
    })
}




