const express=require("express");

const router=express.Router();


router.get("/",(req,res)=>{
    res.send("Get for pots route");
})
router.get("/:id",(req,res)=>{
    res.send("Posts  Get  route for id");
})
router.post("/posts",(req,res)=>{
    res.send("posts route");
})
router.delete("/posts/:id",(req,res)=>{
    res.send("posts delete  route");
})

module.exports=router;