const express=require("express");
const app=express();
require('dotenv').config();

const methodOverrid=require("method-override");
const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);// to specify the engine for ejs as ejemate
// seting mongo db
const mongoose = require('mongoose');


// const MOGO_URL='mongodb://127.0.0.1:27017/wonderlust'

const DB_URL=process.env.ATLAS_DB_URL;



main()
.then(()=>console.log("connected to DB"))
.catch((err)=>console.log(err));
async function main() {
  await  mongoose.connect(DB_URL);
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
// requireing the exoress user router
const userRoutes=require("./routes/user.js")
// requireing the booking router
const bookingRoutes=require("./routes/booking.js")

/// SESSION MONGO STORE
const session = require("express-session");
const MongoStore = require("connect-mongo");

// const store = MongoStore.create({
//   mongoUrl: dburl,
//   crypto: {
//     secret: "mySuperSecretString",
//   },
//   touchAfter: 24 * 3600,
// });

// // FIX ERROR HANDLER (important)

const store = MongoStore.create({
    mongoUrl: DB_URL,
    touchAfter: 24 * 3600 // for Lazy Update
});
store.on("error", (err) => {
  console.log("ERROR in MONGO STORE:", err);
});

// SESSION OPTIONS
const sessionOptions = {
   store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};







const flash=require("connect-flash")


// authonthication and authorization

const passport=require("passport")
const LocalStrategy=require("passport-local")
const User=require("./model/user.js");
const { register } = require("./model/review.js");
const { error } = require("console");





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




// app.get("/",(req,res)=>{
//   res.send("Welcome to root directry")
// })

// session and flash
app.use(session(sessionOptions))
app.use(flash());


// authonthication and authorization
app.use(passport.initialize());//  to inintialize the before we use
app.use(passport.session());// refere notes
passport.use(new LocalStrategy(User.authenticate()))///  “Use the local username/password login system, and let the User model (with passport-local-mongoose) handle authentication.” to authonticate the user data
passport.serializeUser(User.serializeUser());// userd to save serialized data when user in session
passport.deserializeUser(User.deserializeUser());// user get desirealized alll data of user get removed from session






app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  // console.log(res.locals.success); // this one is the array we need tocheck empty candition also
  res.locals.currUser=req.user;
  res.locals.currPath = req.path;
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
// useing the booking routers
app.use("/listing/:id",bookingRoutes);

// Stripe Webhook Endpoint
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");
const Booking = require("./model/booking");
app.post("/payment/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    try {
      const booking = new Booking({
        listing: session.metadata.listingId,
        guest: session.metadata.userId,
        paymentIntentId: session.payment_intent,
        amount: session.amount_total / 100,
        status: "completed"
      });
      await booking.save();
      console.log("Successfully saved booking in DB:", session.metadata.listingId);
    } catch (dbErr) {
      console.error("Database save error inside webhook:", dbErr);
    }
  }

  res.json({ received: true });
});
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










app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is started at port ${process.env.PORT || 8080}`);
});
// useing the ejs-mate for the styleing