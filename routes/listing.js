const express=require("express");
const router=express.Router();
const Listing=require("../model/listing");
const wrapAsyc=require("../utils/wrapAsyc");
const expressError=require("../utils/expressError");
const {listingSchema,reviewSchema}=require("../schema.js")

// server side validation for listing
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errmsg = error.details.map(el => el.message).join(",");
    throw new expressError(400, errmsg);
  } else {
    next();
  }
};


//index route
router.get("/",wrapAsyc(async (req,res)=>{
  const allListings=await Listing.find({})
  // .then((res)=>console.log(res))
  // .catch(err=>console.log(err))
  // console.log(allListings)
  res.render("listings/index",{allListings})
}))

//get and post new list
// new route
router.get("/new",(req,res)=>{
  res.render("listings/new.ejs")
})

// show route
router.get("/:id", wrapAsyc(async(req,res)=>{
  const {id} =req.params;
  const list=await Listing.findById(id).populate("reviews");
  if(!list){
    req.flash("error","Listing does not exists");
    return res.redirect("/listing"); 
  }
  res.render("listings/show.ejs",{list})
  // console.log(user,);
}))


// create 
router.post("/",
  validateListing,// middleware
 wrapAsyc (async(req,res)=>{
    // let {title,description,image,price,country,location}=req.body;
    // console.log({title,description,image,price,country,location})
    // short hand to parsing the data

    // let listing=req.body.listing;
    // console.log(listing)
    // if(!req.body.listing){
    //   throw new expressError(400,"Send valid data for listing")
    // }
    
    // if(!newListing.description){
    //   throw new expressError(400,"description is missing")
    // }
    // if(!newListing.title){
    //   throw new expressError(400,"title is missing")
    // }
    // if(!newListing.location){
    //   throw new expressError(400,"location is missing")
    // }

    // for the about one we need to validate many think 
    // that why we are useing the tool is JOY(it validate the schema)

    // using joi 
    // const result = listingSchema.validate(req.body);
    // if(result.error){
    //   throw new expressError(400,result.error);
    // }
    //converting the validatelisting into middeleware

    // const result=listingSchema.validate(req.body);// using single line we can validate the above enaire schema
    // console.log(result);
    await new Listing(req.body.listing).save();// if listing is not send or not exist then we are giveing the 400 this is the bad requst 
    req.flash("success","new Listing is created");
    res.redirect("/listing")
}))

// edit Route
router.get("/:id/edit",wrapAsyc(async (req,res)=>{
  const {id}=req.params;
  const listtoedit= await Listing.findById(id);
  // console.log(listtoedit);
  if(!listtoedit){
    req.flash("error","Listing does not exists");
    return res.redirect("/listing"); 
  }
  req.flash("success","Listing is edited");
  res.render("listings/edit.ejs",{listtoedit})
}))


// update Routes
router.put("/:id",
  validateListing,
  wrapAsyc(async(req,res)=>{
  let {id}=req.params;
  // console.log(id)
  // let listing=req.body.listing
  // console.log(listing)
  await Listing.findByIdAndUpdate(id,{...req.body.listing})
  
  req.flash("success","Listing is updated");
  res.redirect(`/listing/${id}`)
}))


// delete route
router.delete("/:id",wrapAsyc(async (req,res)=>{
  const {id}=req.params;
  let deleteItem=await Listing.findByIdAndDelete(id);
  console.log(deleteItem);
  req.flash("success","Listing get deleted");
  res.redirect("/listing");
}))

module.exports=router;