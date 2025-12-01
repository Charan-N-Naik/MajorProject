
const Listing=require("../model/listing");
const Review=require("../model/review.js");


module.exports.createReview=async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review)
    newReview.author=req.user._id;
    // console.log(newReview.author);
    listing.reviews.push(newReview);
    console.log(newReview);
    await listing.save();
    await newReview.save();
    // console.log("revew added")
    // res.send("review noted")
     req.flash("success","review added");
    res.redirect(`/listing/${listing._id}`)
};

module.exports.destroyReview=async(req,res)=>{
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","review get deleted");
  res.redirect(`/listing/${id}`)
};