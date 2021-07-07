const mongoose=require('mongoose')
const olxOrderSchema=new mongoose.Schema
({
    sellerid:{type:mongoose.Schema.Types.ObjectId,ref:"olxusers"},
    userid:{type:mongoose.Schema.Types.ObjectId,ref:"olxusers"},
    adid:{type:mongoose.Schema.Types.ObjectId,ref:"ads"},
    price:Number,
    orderdate:{type:Date,default:Date.now()},
    deliveryaddress:String
    //order date, de;ivery addresss
})
module.exports=mongoose.model('olxorders',olxOrderSchema)