const mongoose=require('mongoose')
const LocationSchema=new mongoose.Schema({
    city:String,
    address:String,
    area:String
})

const GeoSchema=new mongoose.Schema({
    type:
    {
        type:String,
        default:"Point"

    },
    coordinates:
    {
        type:[Number]
    }
})

const adsSchema=new mongoose.Schema({
    sold:{type:Boolean,default:false},
    adname:String,
    sellerid:{type:mongoose.Schema.Types.ObjectId,ref:"olxusers"},
    subcategoryid:{type:mongoose.Schema.Types.ObjectId,ref:"olxcategories"},
    price:Number,
    geometry:GeoSchema,
    location:LocationSchema,
    onlinepayment:{type:Boolean,default:false},//images, location, description, date, clicks, 
    images:[String],
    description:String,
    date:{type:Date,default:Date.now()},
    clicks:{type:Number,default:0}
})

adsSchema.index({ geometry: '2dsphere' });
const Ads=mongoose.model('ads',adsSchema)
module.exports=Ads;


// module.exports=mongoose.model('ads',adsSchema)