const express=require("express");
const router=express.Router({mergeParams:true});
const {listingSchema,reviewSchema}=require("../schema.js")// important think is the requering the object 
// require the Asyc wrap utils
const wrapAsyc=require("../utils/wrapAsyc");
const Listing=require("../model/listing");
// requireing the review model
const Review=require("../model/review.js");
const expressError=require("../utils/expressError");


// server side validation middleware for the review
const validatereview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errmsg = error.details.map(el => el.message).join(",");
    throw new expressError(400, errmsg);
  } else {
    next();
  }
};


// review route one to many
router.post("/",validatereview,wrapAsyc(async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review)
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    // console.log("revew added")
    // res.send("review noted")
     req.flash("success","review added");
    res.redirect(`/listing/${listing._id}`)
}));

// review delete route

router.delete("/:reviewId",wrapAsyc(async(req,res)=>{
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","review get deleted");
  res.redirect(`/listing/${id}`)
}))


module.exports=router;
