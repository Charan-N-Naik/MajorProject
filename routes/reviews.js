const express=require("express");
const router=express.Router({mergeParams:true});
const {listingSchema,reviewSchema}=require("../schema.js")// important think is the requering the object 
// require the Asyc wrap utils
const wrapAsyc=require("../utils/wrapAsyc");
const Listing=require("../model/listing");
// requireing the review model
const Review=require("../model/review.js");
const {validatereview}=require("../middlewares/ReviewValidate.js")

const {isloggedin,isReviewAuthor}=require("../middlewares/islogedin.js")

const reviewController=require("../controller/reviews.js")

// review route one to many
router.post("/",
  isloggedin,
  validatereview,
  wrapAsyc(reviewController.createReview));

// review delete route

router.delete("/:reviewId",
  isloggedin,
  isReviewAuthor,
  wrapAsyc(reviewController.destroyReview));


module.exports=router;
