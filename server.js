const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const userroute = require('./routes/Users')
const adroute = require('./routes/Ads')
const categoryroute = require('./routes/Categories')
const orderroute = require('./routes/Orders')
const featuredadsroute = require('./routes/Featuredads')
const mongoose = require('mongoose')
const cron = require('node-cron');
const Categories = require('./models/Categories')
const Featured = require('./models/Featured')
const url = 'mongodb://localhost/olx'
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection;
db.once('open', () => { console.log("connected to mongodb database") })

app.use(bodyParser.json())
app.get('/', (req, res) => {
  res.send('<h1>hello owasi</h1>')
})

app.use('/user', userroute)
app.use('/category', categoryroute)
app.use('/ad', adroute)
app.use('/order', orderroute)
app.use('/featuredads', featuredadsroute)

cron.schedule('0 1 1 1-12 1', () => {  //0 1 1 1-12 1
  Categories.find((err, docs) => {
    docs.forEach(element => {
        for (k = 1; k <= 30; k++) {
          let data = 
          [
            { "catid": element._id, "day": k, "month": 7, "year": 2021 },
          ]
          Featured.create(data, (err, docs) => {
            if (err) {
              console.log({ message: "Failed", err })
            }
            else {
              console.log({ message: "Success", docs })
            }
          })
        }
  })
})
  //   const arr=data.map(element => {
  //       return element.date
  //   });
  //   console.log(arr.length)
  //   if(arr.length!==8){
  //       return res.json({message:"8 slots required"})
  //   }
  //   else{
  //   Featured.create(data,(err,docs)=>{
  //       if(err){
  //           return res.json({message:"Failed",err})
  //       }
  //       else{
  //               return res.json({message:"Success",docs})
  //       }
  //   })
  // }
}, {
  scheduled: true,
  timezone: "Asia/Karachi"
});

const PORT = process.env.PORT || 4000
app.listen(PORT, () => { console.log(`Server started at port ${PORT}`) })