const express=require('express')
const Categories = require('../models/Categories')
const router=express.Router()
const multer = require("multer");
const Ads = require('../models/Ads');
var upload = multer({ dest: __dirname + '/images/' });
router.post('/createcategory',upload.single('image'),(req,res)=>{
    let data={
        enabled:req.body.enabled,
        categoryname:req.body.categoryname,
        image:req.file.filename
    }
    Categories.create(data,(err,doc)=>{
        if(err){
            return res.json({message:"Failed",err})
        }
        else{
            return res.json({message:"Success",doc})
        }
    })
})

router.post('/createsubcategory',upload.single('image'),(req,res)=>{
    let _id=req.body.categoryid;
    let data ={
        subcategoryname:req.body.subcategoryname,
        subcategoryimage:req.file.filename
    }
    Categories.findByIdAndUpdate(_id,{$push:{subcategory:data}},{new:true},(err,doc)=>{
        if(err){
            return res.json({message:"Failed",err})
        }
        else{
            return res.json({message:"Success",doc})
        }
    })
})

router.get('/viewallcategories',(req,res)=>{
    Categories.find((err,docs)=>{
        if(err){
            return res.json({message:"Failed",err})
        }
        else{
            return res.json({message:"Success",docs})
        }
    })
})

router.get('/viewsubcategoryads',(req,res)=>{
    Ads.find({subcategoryid:req.body.id},(err,docs)=>{
        if(err){
            return res.json({message:"Failed",err})
        }
        else{return res.json({message:"Success",docs})}
    })
})
module.exports=router