const express=require('express');
const Categories = require('../models/Categories');
const Featured = require('../models/Featured');
const router=express.Router()
//const Featuredads=require('')
router.get('/featureanad',(req,res)=>{
    let data={
        catid:req.body.catid,
        adid:req.body.adid,
        day:req.body.day,
        month:req.body.month,
        year:req.body.year
    }
    Featured.findOne({$and:[{catid:data.catid},{day:data.day},{month:data.month},{year:data.year}]},(err,doc)=>{
        if(err){
            return res.json("Failed",err)
        }
        else{
            if(doc==null){
                return res.json({message:"No date available for your ad"})
            }
            else{
                console.log(doc.adid.length)
                if(doc.adid.length==8){
                    return res.json({message:"Cannot feature your ad,limit achieved"})
                }
                else{
                    Featured.findOneAndUpdate({$and:[{catid:data.catid},{day:data.day},{month:data.month},{year:data.year}]},{$push:{adid:data.adid}},{new:true},(err,adfeatured)=>{
                                    if(err){
                                        return res.json({message:"Failed",err})
                                    }
                                    else{
                                        return res.json({message:"Success",adfeatured})
                                    }
                                })
                }
            }
        }
    })
})


router.get('/checkavailibility',(req,res)=>{
    let data={
        catid:req.body.catid,
        day:req.body.day,
        month:req.body.month,
        year:req.body.year
    }
    Featured.findOne({$and:[{catid:data.catid},{day:data.day},{month:data.month},{year:data.year}]},(err,doc)=>{
        if(err){
            return res.json("Failed",err)
        }
        else{
            if(doc==null){
                return res.json({message:"No date available for your ad"})
            }
            else{
                console.log(doc.adid.length)
                if(doc.adid.length==8){
                    return res.json({message:"Not available,limit achieved"})
                }
                else{
                    Featured.findOne({$and:[{catid:data.catid},{day:data.day},{month:data.month},{year:data.year}]},(err,available)=>{
                                    if(err){
                                        return res.json({message:"Failed",err})
                                    }
                                    else{
                                        return res.json({message:"Success",available})
                                    }
                                })
                }
            }
        }
    })
})
router.post('/createslots',(req,res)=>{
    let data=req.body
    const arr=data.map(element => {
        return element.date
    });
    console.log(arr.length)
    if(arr.length!==8){
        return res.json({message:"8 slots required"})
    }
    else{
    Featured.create(data,(err,docs)=>{
        if(err){
            return res.json({message:"Failed",err})
        }
        else{
                return res.json({message:"Success",docs})
        }
    })
}
})

router.get('/viewfeatureddates',(req,res)=>{
    Featured.find((err,docs)=>{
        if(err){
            return res.json({message:"Failed",err})
        }
        else{
            return res.json({message:"Success",docs})
        }

    })
})

router.get('/viewhighestnofeaturedadsbycategory',(req,res)=>{
    // let count=0;
    // Categories.find((err,data)=>{
    //     if(err){
    //         return res.json({message:"Failed",err})
    //     }
    //     else{
    //         console.log(data)
    //         data.map(d=>{
    //             Featured.find({catid:d._id},(err,docs)=>{
    //                 if(err){
    //                     return res.json({message:"Failed",err})
    //                 }
    //                 else{
    //                     docs.map(s=>{
    //                         count=count+s.adid.length
                            
    //                     })
                        
    //                     console.log(d._id)
    //                     console.log(count)
    //                     count=0
                        
                        
    //                 }
    //             })
    //         }) 
            
    //     }
    // })

  Featured.aggregate
  ([
    {$unwind:"$adid"},
     {$group:{_id:{catid:"$catid",adid:"$adid",day:"$day"}}},
     {$group:{_id:"$_id.catid",count:{$sum:1}}},
     {$sort:{count:-1}},
    { $limit : 1 }
  ]).exec((err,doc)=>{
      if(err){
          return res.json({message:"Failed",err})
      }
      else{
          return res.json({message:"Highest Category ads count",doc})
      }
  })  
})


router.get('/highestadsfeaturedday',(req,res)=>{
    Featured.aggregate
    ([
    //   {$unwind:"$adid"},
       {$group:{_id:{adid:"$adid",day:"$day",count:{$size:"$adid"}}}},
       {$group:{_id:{day:"$_id.day",ads:{$sum:"$_id.count"}}}},
        {$sort:{"_id.ads":-1}},
    { $limit : 1 }
    ]).exec((err,doc)=>{
        if(err){
            return res.json({message:"Failed",err})
        }
        else{
            return res.json({message:"Highest ads on this day",doc})
        }
    })   
})

module.exports=router;