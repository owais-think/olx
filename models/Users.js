const mongoose=require('mongoose')
const UseryaSellerSchema=new mongoose.Schema
({
    Authorize:
    {
        type: Boolean,
        default: false
    },
    email:String,
    name:String,
    phonenumber:{type:Number,unique:true},
    city:String,
    price:{type:Number,default:0}
})
module.exports=mongoose.model('olxusers',UseryaSellerSchema)