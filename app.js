/* // dotenv is installed b/c dont understand config.mongourl
const dotenv=require('dotenv')
dotenv.config()
const mongoose=require('mongoose')
mongoose.Promise=require('bluebird')
// initialize gridfs storage engine
const methodOverride=require('method-override')
const multer=require('multer')
const GridFsStorage=require('multer-gridfs-storage')
const config=require('config')
//
const imageRouter=require('./routes/images')

// const url=config.mongoURI
// const url =process.env.DB
const connect=mongoose.connect( process.env.DB,{useNewUrlParser:true, useUnifiedTopology: true })
connect.then( ()=>{
    console.log('Connected to the database: GridApp')    
}, (err)=>console.log(err) )
// storage engine
const storage= new GridFsStorage({
    url:config.mongoURI
})

// const upload=multer({storage})
// app.use('/', imageRouter(upload) );
// const storage=new GridFsStorage({
//     url:
// })
*/