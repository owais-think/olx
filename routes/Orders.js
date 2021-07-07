const express=require('express')
const Ads = require('../models/Ads')
const router=express.Router()
const Orders=require('../models/Orders')
const Users=require('../models/Users')
router.post('/createorder',(req,res)=>{
    let data={
        sellerid:req.body.sellerid,
        userid:req.body.userid,
        adid:req.body.adid,
        price:req.body.price,
        deliveryaddress:req.body.deliveryaddress
    }
    Ads.findOne({_id:data.adid,sold:false},(err,ad)=>{
        if(ad==null){return res.json({message:"Already sold"})}
        if(err){
            return res.json({message:"Failed",err})
        }
        else{
                
                    Orders.create(data,(err,doc)=>{
                    if(err)
                    {
                        return res.json({message:"Failed",err})
                    }
                    else
                    {
                        Ads.findOneAndUpdate({_id:data.adid},{sold:true},{new:true},(err,adsold)=>{
                        
                            if(err)
                            {
                                return res.json({message:"Failed",err})
                            }
                            else
                            {
                                Users.findOneAndUpdate({_id:data.sellerid},{price:data.price},{new:true},(err,userdata)=>{
                                    if(err){
                                        return res.json({message:"Failed",err})
                                    }
                                    else{
                                        return res.json({meesage:"Success",doc})
                                    }
                                })
                            }
                        
                    })
                    }
                })
            
        }
    })
    
})

router.get('/vieworders',(req,res)=>{
    Orders.find((err,docs)=>{
        if(err){
            return res.json({message:"Failed",err})
        }
        else{
            return res.json({message:"Succes",docs})
        }
    })
})
module.exports=router;