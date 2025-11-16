const express=require("express");
const app=express();

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



// requireing the express error

const expressError=require("./utils/expressError");

// requireing the serverside schema validation

const {listingSchema,reviewSchema}=require("./schema.js")// important think is the requering the object 



// requireing the Express Listing router
const listingsRoutes=require("./routes/listing.js")
// requireing the Express Review router
const reviewsRoutes=require("./routes/reviews.js")

const userRoutes=require("./routes/user.js")



// seseions
const sesseionOptions={
  secret:"mySuperSeacreateString",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  },
};


const session=require("express-session")
const flash=require("connect-flash")


// authonthication and authorization

const passport=require("passport")
const LocalStrategy=require("passport-local")
const User=require("./model/user.js");
const { register } = require("./model/review.js");





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




app.get("/",(req,res)=>{
  res.send("Welcome to root directry")
})

// session and flash
app.use(session(sesseionOptions))
app.use(flash());


// authonthication and authorization
app.use(passport.initialize());//  to inintialize the before we use
app.use(passport.session());// refere notes
passport.use(new LocalStrategy(User.authenticate()))/// to authonticate the user data
passport.serializeUser(User.serializeUser());// userd to save serialized data when user in session
passport.deserializeUser(User.deserializeUser());// user get desirealized alll data of user get removed from session






app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  // console.log(res.locals.success); // this one is the array we need tocheck empty candition also
  next();
});









// Routers
// // Demo user
// app.use("/demoUser",async(req,res)=>{
//   let fakeuser=new User({
//     email:"student@gmail.com",
//     username:"apnacollege_std90"// here in User Schema we are not defined username username automatically created by passport-local-mongoose this add the username and passeword as automatically in UserSchema 
//   });

//   const regesteredUser=await User.register(fakeuser,"password");
//   res.send(regesteredUser)
// });

// user signup routes
app.use("/",userRoutes);

// useing the listing routers
app.use("/listing",listingsRoutes);
// useing the review routers
app.use("/listings/:id/reviews",reviewsRoutes)
// refere express website under router
//mergeParams	Preserve the req.params values from the parent router(/listings/:id/reviews). If the parent and the child have conflicting param names, the child’s value take precedence.
// defout mergeParams is False








// Midelwares

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