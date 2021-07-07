const mongoose=require('mongoose')
const featuredadsSchema=new mongoose.Schema({
    catid:{type:mongoose.Schema.Types.ObjectId,ref:"olxcategories" },
    adid:[{type:mongoose.Schema.Types.ObjectId,ref:"ads"}],
    day:Number,
    month:Number,
    year:Number
})
module.exports=mongoose.model('olxfeaturedads',featuredadsSchema)