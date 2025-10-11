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




app.get("/listing",async (req,res)=>{
  const allListings=await Listing.find({})
  // .then((res)=>console.log(res))
  // .catch(err=>console.log(err))
  // console.log(allListings)
  res.render("listings/index",{allListings})
})
//get and post new list
app.get("/listing/new",(req,res)=>{
  res.render("listings/new.ejs")
})

app.get("/listing/:id", async(req,res)=>{
  const {id} =req.params;
  const list=await Listing.findById(id);
  res.render("listings/show.ejs",{list})
  // console.log(user,);
})


// create new one
app.post("/listings",(req,res)=>{
  // let {title,description,image,price,country,location}=req.body;
  // console.log({title,description,image,price,country,location})
  // short hand to parsing the data

  // let listing=req.body.listing;
  // console.log(listing)
  new Listing(req.body.listing).save();
  res.redirect("/listing")

})

// edit the request
app.get("/listings/:id/edit",async (req,res)=>{
  const {id}=req.params;
  const listtoedit= await Listing.findById(id);
  // console.log(listtoedit);
  res.render("listings/edit.ejs",{listtoedit})
})
// update
app.put("/listings/:id",async(req,res)=>{
  let {id}=req.params;
  // console.log(id)
  // let listing=req.body.listing
  // console.log(listing)
  await Listing.findByIdAndUpdate(id,{...req.body.listing})
  res.redirect(`/listing/${id}`)
})
// dellete route
app.delete("/listings/:id",async (req,res)=>{
  const {id}=req.params;
  let deleteItem=await Listing.findByIdAndDelete(id);
  console.log(deleteItem);
  res.redirect("/listing");
})



app.get("/",(req,res)=>{
  res.send("Welcome to root directry")
})

app.listen(8080,()=>{
    console.log("Server is stared at 8080");
})
// useing the ejs-mate for the styleing