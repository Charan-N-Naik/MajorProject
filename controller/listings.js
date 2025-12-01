
const Listing=require("../model/listing");

module.exports.index=async (req,res)=>{
  const allListings=await Listing.find({})
  // .then((res)=>console.log(res))
  // .catch(err=>console.log(err))
  // console.log(allListings)
  res.render("listings/index",{allListings})
}
module.exports.renderNewForm=(req,res)=>{
  // console.log(req.user)// store the all the information about user this user will trigger the is autontication
  // if(!req.isAuthenticated()){
  //   req.flash("error","you must be logedin to create listings")
  //   return res.redirect("/login")
  // }
  res.render("listings/new.ejs")
}


module.exports.showListing=async(req,res)=>{
  const {id} =req.params;
  const list=await Listing.findById(id)
  .populate({
    path:"reviews",
    populate:{
      path:"author"
    }
  })
  .populate("owner");
  if(!list){
    req.flash("error","Listing does not exists");
    return res.redirect("/listing"); 
  }
  // console.log(list)
  res.render("listings/show.ejs",{list})
  // console.log(user,);
};


module.exports.createListing=async(req,res)=>{
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
    let url=req.file.path;
    let filename=req.file.filename;
    // console.log(url,"....",filename)
    const newListing=new Listing(req.body.listing);// if listing is not send or not exist then we are giveing the 400 this is the bad requst 
    newListing.image={filename,url}
    console.log(req.user)
    newListing.owner=req.user._id;//Authorization
    await newListing.save();
    req.flash("success","new Listing is created");
    res.redirect("/listing")
};



module.exports.renderEditForm=async (req,res)=>{
  const {id}=req.params;
  const listtoedit= await Listing.findById(id);
  // console.log(listtoedit);
  if(!listtoedit){
    req.flash("error","Listing does not exists");
    return res.redirect("/listing"); 
  }
  req.flash("success","Listing is edited");
  res.render("listings/edit.ejs",{listtoedit})
};

module.exports.updateListing=async(req,res)=>{
  let {id}=req.params;
  // console.log(id)
  // let listing=req.body.listing
  // console.log(listing)
  await Listing.findByIdAndUpdate(id,{...req.body.listing})
  req.flash("success","Listing is updated");
  res.redirect(`/listing/${id}`)
};

module.exports.destroyListing=async (req,res)=>{
  const {id}=req.params;
  let deleteItem=await Listing.findByIdAndDelete(id);
  console.log(deleteItem);
  req.flash("success","Listing get deleted");
  res.redirect("/listing");
};