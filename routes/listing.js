
//cloudenary 
if(process.env.NODE_ENV!="production"){
  require('dotenv').config()
}

// console.log(process.env) // remove this after you've confirmed it is working


const express=require("express");
const router=express.Router();
const Listing=require("../model/listing");
const wrapAsyc=require("../utils/wrapAsyc");
const {isloggedin,isOwner}=require("../middlewares/islogedin.js")
const {validateListing}=require("../middlewares/listValidation.js")
const listingControll=require("../controller/listings.js")
const {storage,cloudinary}=require("../CloudConfig.js")
//image uploading
const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })


//storeing 

const upload = multer({storage});



// //index route
// router.get("/",
//   wrapAsyc(listingControll.index))

// //get and post new list
// // new route
// router.get("/new",
//   isloggedin,
//   listingControll.renderNewForm);


// // show route
// router.get("/:id", 
//   wrapAsyc(listingControll.showListing));


// // create 
// router.post("/",
//   isloggedin,
//   validateListing,// middleware
//   wrapAsyc (listingControll.createListing));

// // edit Route
// router.get("/:id/edit",
//   isloggedin,
//   isOwner,// Authorization 
//   wrapAsyc(listingControll.renderEditForm));


// // update Routes
// router.put("/:id",
//   isloggedin,// Authonthicate
//   isOwner,// Authorization 
//   validateListing,
//   wrapAsyc(listingControll.updateListing));


// // delete route
// router.delete("/:id",
//   isloggedin,
//   isOwner,// Authorization 
//   wrapAsyc(listingControll.destroyListing));



router.route("/")
.get(wrapAsyc(listingControll.index))
.post(
  isloggedin,
  validateListing,// middleware
  upload.single('listing[image]'),// processs the file and passs the data to the req.file
  wrapAsyc (listingControll.createListing)
);
// .post( upload.single('listing[image]'),(req,res)=>{
//   res.send(req.file);
//   // req.file contain this all 
//   // {"fieldname":"listing[image]","originalname":"WIN_20250702_13_11_34_Pro.mp4","encoding":"7bit","mimetype":"video/mp4","destination":"uploads/","filename":"1135e3794272e30a8d26414edd395c7f","path":"uploads\\1135e3794272e30a8d26414edd395c7f","size":879676}
// });
 
 
router.get("/new",
  isloggedin,
  listingControll.renderNewForm
);

// update
router.get("/:id/edit",
  isloggedin,
  isOwner,// Authorization 
  wrapAsyc(listingControll.renderEditForm)
);


router.route("/:id")
.get(wrapAsyc(listingControll.showListing))
.put(
  isloggedin,// Authonthicate
  isOwner,// Authorization 
  validateListing,
  wrapAsyc(listingControll.updateListing))
.delete(
  isloggedin,
  isOwner,// Authorization 
  wrapAsyc(listingControll.destroyListing)
);


module.exports=router;