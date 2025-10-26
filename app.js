const express=require("express");
const app=express();
const Listing=require("./model/listing");
const methodOverrid=require("method-override");
const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);// to specify the engine for ejs as ejemate
// seting mongo db
const mongoose = require('mongoose');
const MOGO_URL='mongodb://127.0.0.1:27017/wonderlust'
main()
.then(()=>console.log("connected to DB"))
.catch((err)=>console.log(err));
async function main() {
  await  mongoose.connect(MOGO_URL);
}

// seting ejs
const path=require("path");

// require the Asyc wrap utils
const wrapAsyc=require("./utils/wrapAsyc");

// requireing the express error

const expressError=require("./utils/expressError");

// requireing the serverside schema validation

const {listingSchema,reviewSchema}=require("./schema.js")// important think is the requering the object 

// requireing the review model

const Review=require("./model/review.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}))
app.use(methodOverrid("__method"));
app.use(express.static(path.join(__dirname,"public")))

// app.get("/testListing",async (req,res)=>{
//   let simplelisting=new Listing(
//     {
//       title:"my new Villa",
//       description:"by the beach ",
//       price:69000,
//       location:"Goa",
//       country:"india"
//     }
//   )
//   await simplelisting.save();
//   console.log("sample saved")
//   res.send("saved in database")
// });

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



app.get("/listing",wrapAsyc(async (req,res)=>{
  const allListings=await Listing.find({})
  // .then((res)=>console.log(res))
  // .catch(err=>console.log(err))
  // console.log(allListings)
  res.render("listings/index",{allListings})
}))
//get and post new list
app.get("/listing/new",(req,res)=>{
  res.render("listings/new.ejs")
})

app.get("/listing/:id", wrapAsyc(async(req,res)=>{
  const {id} =req.params;
  const list=await Listing.findById(id).populate("reviews");
  res.render("listings/show.ejs",{list})
  // console.log(user,);
}))


// create new one
app.post("/listings",
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
    console.log(result);
    await new Listing(req.body.listing).save();// if listing is not send or not exist then we are giveing the 400 this is the bad requst 
    res.redirect("/listing")
}))

// edit the request
app.get("/listings/:id/edit",wrapAsyc(async (req,res)=>{
  const {id}=req.params;
  const listtoedit= await Listing.findById(id);
  // console.log(listtoedit);
  res.render("listings/edit.ejs",{listtoedit})
}))
// update
app.put("/listings/:id",
  validateListing,
  wrapAsyc(async(req,res)=>{
  let {id}=req.params;
  // console.log(id)
  // let listing=req.body.listing
  // console.log(listing)
  await Listing.findByIdAndUpdate(id,{...req.body.listing})
  res.redirect(`/listing/${id}`)
}))
// dellete route
app.delete("/listings/:id",wrapAsyc(async (req,res)=>{
  const {id}=req.params;
  let deleteItem=await Listing.findByIdAndDelete(id);
  console.log(deleteItem);
  res.redirect("/listing");
}))


// app.use((err,req,res,next)=>{
//   res.send("Something went Wrong>>>>>>>>>>>>>>")
// })

app.get("/",(req,res)=>{
  res.send("Welcome to root directry")
})


// review route one to many
app.post("/listings/:id/reviews",validatereview,wrapAsyc(async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review)
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    // console.log("revew added")
    // res.send("review noted")
    res.redirect(`/listing/${listing._id}`)
}));

// review delete route

app.delete("/listings/:id/reviews/:reviewId",wrapAsyc(async(req,res)=>{
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listing/${id}`)
}))


// app.all("*",(req,res,next)=>{
//   next(new expressError(404,"Page not found"))
// })

// 404 handler — no path string
app.use((req, res, next) => {
  next(new expressError(404, "Page not found"));
});

// Error handler
// app.use((err, req, res, next) => {
//   let { statuscode = 500, message = "Something went wrong" } = err;
//   // res.status(statuscode).send(message);
//   // res.render("Error.ejs",{message})
   
//    res.status(statuscode).render("Error.ejs",{message});
// });
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;// if erorr not found status code defoult set as 500
  res.status(statusCode).render("Error.ejs", { message, statusCode });
});






app.listen(8080, () => {
  console.log("Server is started at 8080");
});
// useing the ejs-mate for the styleing