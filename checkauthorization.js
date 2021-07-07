const jwt=require('jsonwebtoken')
const Person=require('./models/Users')
const checkauthorization=(req,res,next)=>{
    if(req.body.id!==undefined)
    {
        console.log(req.body.id)
        Person.findOne({_id:req.body.id,Authorize:true},(err,doc)=>{
            if(err) 
            {
                return res.json({message:"Failed",err})
            }
            else
            {
                if(doc!==null)
                {
                    jwt.sign({_id:req.body.id},'secretkey',{expiresIn:40},(err,token)=>{
                    // return res.json({message:"Success",token:token,user:data})
                    req.token = token
                    req.doc = doc
                    next()
                    })
                    
                }
                else
                {
                    return res.json("Not authorized")
                }
                
            }
        }) 
    }
}

module.exports=checkauthorization;