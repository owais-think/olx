const express=require('express')
const Ads = require('../models/Ads')
const multer=require('multer')
const Categories=require('../models/Categories')
const router=express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './images');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});
const uploadMult = multer({ storage: storage }).array('files', 3);
function deleteFiles(files, callback){
    let i = files.length;
    files.forEach(function(filepath){
      const completePath = './uploads/'+filepath
      fs.unlink(completePath, function(err) {
        i--;
        if (err) {
          callback(err);
          return;
        } else if (i <= 0) {
          callback(null);
        }
      });
    });
  }
router.post('/createad',(req,res)=>{
    let data={
        adname:req.body.adname,
        sellerid:req.body.sellerid,
        categoryid:req.body.categoryid,
        subcategoryid:req.body.subcategoryid,
        price:req.body.price,
        location:req.body.location,
        onlinepayment:req.body.onlinepayment,
        geometry:req.body.geometry,
        description:req.body.description
    }
    Ads.create(data,(err,ad)=>{
        if(err){
            return res.json({message:"Failed",err})
        }
        else{
            Categories.findOneAndUpdate({"_id":data.categoryid,"subcategory._id":data.subcategoryid},{$push:{"subcategory.$.adsid":ad._id}},{new:true},(err,doc)=>{
                if(err){
                    return res.json({message:"Failed",err})
                }
                else{
                    return res.json({message:"Success",ad})
                }
            })
        }
    })
})

router.post('/uploadimages',(req,res)=>{
     uploadMult(req, res, function (err) {
                if (err) {
                    return res.json(err)
                }
                else {
                    if (req.files !== undefined) {
                        let fileData = req.files
                        if (fileData.length ===3) {
                            let addAditionalImages = fileData.map((file) => {
                                return file.filename
                            })
                            Ads.findByIdAndUpdate(req.body.adid, 
                                { $set: { images: addAditionalImages } }, { new: true }, (err, doc) => {
                                if (err) return res.json(err)
                                else {
                                    return res.json(doc)
                                }
                            })
                        }
                        else {
                            return res.json('Up to 3 images are required')
                        }
                    }
                    else {
                        return res.json('Files can not be null')
                }
                }
            });
        })


        router.get('/viewallads',(req,res)=>{
        Ads.find((err,docs)=>{
            if(err){
                return res.json({message:"Failed",err})
            }
            else{
                return res.json({message:"Success",docs})
            }
        })
        })

        router.put('/viewclicks',(req,res)=>{
            let _id=req.body.adid
            Ads.findByIdAndUpdate(_id,{$inc:{clicks:1}},{new:true},(err,doc)=>{
                if(err){
                    return res.json({message:"Failed",err})
                }
                else{
                    return res.json({message:"Success",doc})
                }
            })
        })
           

        //view ads within this range
        router.get('/viewadswithinrange',(req,res)=>{
            if (req.body.longitude !== undefined && req.body.latitude !== undefined && req.body.range!== undefined ) {
                let { longitude, latitude } = req.body
                Ads.find({
                  geometry: {
                    $nearSphere: {
                      $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude], //longitude and latitude
                      },
                      $minDistance: 0,
                      $maxDistance: req.body.range * 1000,
                    },
                  },
                })
                  .limit(10)
                  .exec((err, docs) => {
                    if (err) return res.json(err);
                    else return res.json(docs);
                  });
              } else {
                return res.json('Location can not be null')
              }
            })

            router.get('/filterbyprice',(req,res)=>{
                let data={
                    subcategoryid:req.body.subcategoryid,
                    price1:req.body.price1,
                    price2:req.body.price2,
                    city:req.body.city
                }
               Ads.find({$and:[{"subcategoryid":data.subcategoryid},{$and:[{price:{$gt:data.price1}},{price:{$lt:data.price2}}]},{"location.city":data.city}]},(err,docs)=>{
                    if(err){
                        return res.json({message:"Failed",err})
                    }
                    else{
                        return res.json({message:"Success",docs})
                    }
                })
            })
        
module.exports=router;