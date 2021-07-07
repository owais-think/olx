const express=require('express')
const router=express.Router()
const checkauthorization=require('../checkauthorization')
const Otp=require('../models/Otp')
const Users=require('../models/Users')

//get all user
router.get('/viewusers',(req,res)=>{
    Users.find((err,doc)=>{
    if(err){
        return res.json({message:"Failed",err})
    }
    else{
        return res.json({message:"Success",doc})
    }
    })
})

//View otp
router.get('/viewotpcodes',(req,res)=>{
    Otp.find((err,doc)=>{
        if(err){
            return res.json({message:"Failed",err})
        }
        else{
            return res.json({message:"Success",doc})
        }
    })
})


//user signup
router.post('/createuser',(req,res)=>{
            
    let otpno=Math.floor(100000 + Math.random() * 900000)
    console.log(otpno)

    let otp={
        phonenumber:req.body.phnumber,
        otpcode:otpno
    }
    let data={
        email:req.body.email,
        name:req.body.name,
        phonenumber:req.body.phnumber,
        city:req.body.city
    }
    Otp.create(otp,(err,doc)=>{
        if(err){
            return res.json({message:"Failed",err})
        }
        else{
            Users.create(data,(err,docc)=>{
                if(err){
                    return res.json({message:"Failed",err})
                }
                else{
                    return res.json({message:"Successfull",docc})
                }
            })
        }
    })      
})

//Delete User
router.delete('/deleteuser',(req,res)=>{
    const id=req.body.id;
    const deletespecific=Users.findByIdAndDelete(id)
    res.json(deletespecific)
})


//Verify otp and update users array
router.put('/verify',(req,res)=>{
    console.log('body->',req.body)
    if(req.body.phnumber!==undefined && req.body.otpnumber!==undefined)
    {
        Otp.findOne({phonenumber:req.body.phnumber,otpcode:req.body.otpnumber},(err,doc)=>{
            if(err) return res.json({message:"Failed",err})
            else
            {
                if(doc!==null)
                {
                   // const updatespecific= User.updateOne({email:req.body.email},{$set:{Authorize:{$eq:true}}})
                    //res.json(updatespecific)
                    Users.findOneAndUpdate({phonenumber:req.body.phnumber},{Authorize:true},{new:true},(error,user)=>{
                        if(error)return res.json({message:"Failed",error})
                        else{
                            return res.json({messageL:"success",otp:doc,user:user})
                        }
                    })
                }
                else
                {
                    return res.json("Invalid OTP or email")
                }
            }
        })
    }
    else
    {
        return res.json({message:"Failed",Error:"OTP and Phone number are required"})
    }
})

router.get('/login',checkauthorization,(req,res)=>{
    
    return res.json({
        doc:req.doc,
        token:req.token
 
})

})

module.exports=router;