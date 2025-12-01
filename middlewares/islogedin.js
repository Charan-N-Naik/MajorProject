const Listing=require("../model/listing")
const Review =require("../model/review")
module.exports.isloggedin=(req,res,next)=>{

    // console.log(req.path  ,".....",req.originalUrl)
    if(!req.isAuthenticated()){
        // user not lolgin then redirectUrl is 
        req.session.redirectUrl=req.originalUrl// this is the redirect the user after login means user acceing path one after login process 
        // above one storing is not efficiant due to express after login referesh the session and we unable to access in user.js in login route
        // that a resion we are creating the new export middleware savedRedirectUrl
        req.flash("error","you must be logedin to create listings")
        return res.redirect("/login")
    }
    next();
}


module.exports.savedRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    const {id} =req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you not a owner of this list");
        return res.redirect(`/listing/${id}`)
    }
    next()

}

module.exports.isReviewAuthor=async(req,res,next)=>{
    const {id,reviewId} =req.params;
    let review=await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","you not a author  of this review");
        return res.redirect(`/listing/${id}`)
    }
    next();

}
