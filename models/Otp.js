  
const mongoose=require('mongoose')
const UserotpSchema=new mongoose.Schema({
    phonenumber:Number,
    otpcode:Number
})

module.exports=mongoose.model('UserOtps',UserotpSchema)