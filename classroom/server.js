const express=require("express");
const app=express();
// useing the Express routers
const users=require("./routes/users")
const posts=require("./routes/posts")
const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);
const path=require("path");
// const cookiesParser=require("cookie-parser");
const session = require('express-session')
const flash=require("connect-flash")

// phase 2 part c : seseion






// // useing the middelware
// app.use(cookiesParser("secreatecode"));

// // instate of writeing below one now maping the common in router 
// app.use("/users",users)// heare the mapping the routes which started with /users to the users.js files
// // act like the middleware

// // // user routes
// // app.get("/users",(req,res)=>{
// //     res.send("post  route");
// // })
// // app.get("/users/:id",(req,res)=>{
// //     res.send("user Get  route");
// // })
// // app.post("/users",(req,res)=>{
// //     res.send("users post  route");
// // })
// // app.delete("/users/:id",(req,res)=>{
// //     res.send("post  route");
// // })

// app.use("/posts",posts)// heare all the routes request that started with /posts roues are mmapping to the posts file that required above
// // post routes
// // app.get("/posts",(req,res)=>{
// //     res.send("root route");
// // })
// // app.get("/posts/:id",(req,res)=>{
// //     res.send("user Get  route");
// // })
// // app.post("/posts",(req,res)=>{
// //     res.send("post  route");
// // })
// // app.delete("/posts/:id",(req,res)=>{
// //     res.send("post  route");
// // })










// app.get("/setcookies", (req, res) => {
//   res.cookie("greet", "namaste"); // Sets a cookie named 'greet' with the value 'namaste'
//   res.cookie("origin", "India");  // Sets another cookie named 'origin' with the value 'India'
//   res.send("We sent you a cookie!"); // Sends a response message
// });

// app.get("/",(req,res)=>{
//     res.send("root route");
//     console.dir(req.cookies)
//     let {name=Anomunas}=req.cookies;
//     console.dir(name)
// })
// app.get("/greet",(req,res)=>{
//   let {name=Anomunas}=req.cookies;
//   res.send(`hi,${name}`)
// })


// // signied cookies

// app.get("/getsignedCokies",(req,res)=>{
//     res.cookie("iam_cookies","Singened",{signed:true})
//     res.send("cookies is Signed!")
// })
// // exopress devide coookies  into two parts like singed and unsigned cookies

// app.get("/verifySigned",(req,res)=>{
//   res.send("verifying")
//   console.log(req.cookies)// unsigned cookies
//   console.log(req.signedCookies);// signed 
//   // if any edit is done in signed cookies the convert into unsigned cookeis

// })



// session

const sesseionOptions={
  secret:"mySuperSeacreateString",
  resave:false,
  saveUninitialized:true
};

app.use(session(sesseionOptions));
app.use(flash());

// this one is the middleware we are used ti the flash the message on the webpage 
// when this two locals variable are no need to pass the during the rendering the webpage 
// this both are get access by automitically due to declaried as the locals
app.use((req,res,next)=>{
  res.locals.ErorrMsg=req.flash('error');
  res.locals.sucessMsg=req.flash('succes');
  next();
})

// app.get("/test",(req,res)=>{
//   res.send("test successfull")
// })

// one the two tab in chrome with the same get route that present in below and refress in this concept we are understand that the session is same and client also same but created in different tab 

app.get("/reqCount",(req,res)=>{
  if( req.session.count){// req.session.count is variable exist in sesseion increase the count else  initialize
    req.session.count+=1;
  }
  else{
    req.session.count=1;
  }
  
  res.send(`You sent a request ${ req.session.count} times`);

})


app.get("/regester",(req,res)=>{
  let {name="anonymous"}=req.query;
  // console.log(req.session);
  req.session.name=name;
  //console.log(req.session.name);
  
  // console.log(req.flash("success"));
  if(req.session.name==="anonymous"){
    req.flash("error","user not registered");
  }
  else{
    req.flash("succes","user regestered sucessfully")
  }
  
  res.redirect("/hello");

})

app.get("/hello",(req,res)=>{
   res.render("hello.ejs",{name:req.session.name,msg:req.flash("success")});
})

app.listen(3000,(req,res)=>{
    console.log("Server started at port 3000")
})
// heare main think to learn is the restutured the routes that not make the confuse and this help to modularity of the codeinig