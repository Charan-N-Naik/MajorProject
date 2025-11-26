const { required } = require("joi")
const mongoose=require("mongoose")
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema=mongoose.Schema({
    email:{
        type:String,
        required:true
    }
})
// ✔ username field
// ✔ password hashing
// ✔ salting
// ✔ authentication methods
// ✔ register(), authenticate(), serializeUser(), deserializeUser()

// You do NOT store passwords manually — it handles everything.
userSchema.plugin(passportLocalMongoose)
module.exports=mongoose.model("User",userSchema);