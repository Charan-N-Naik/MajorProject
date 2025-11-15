const express=require("express");
const router=express.Router();


router.get("/",(req,res)=>{
    res.send("user route");
})
router.get("/:id",(req,res)=>{
    res.send("user Get  route");
})
router.post("/s",(req,res)=>{
    res.send("users post  route");
})
router.delete("/:id",(req,res)=>{
    res.send("post  route");
})

module.exports=router;