const mongoose=require('mongoose')

const subcategoryschema=new mongoose.Schema({
    subcategoryname:String,
    adsid:[{type:mongoose.Schema.Types.ObjectId,ref:"ads"}],
    subcategoryimage:String
})


const olxCategorySchema=new mongoose.Schema({
    enabled:{type:Boolean,default:true},
    categoryname:String,
    subcategory:[subcategoryschema],//image, enabled
    image:String
})
module.exports=mongoose.model('olxcategories',olxCategorySchema)