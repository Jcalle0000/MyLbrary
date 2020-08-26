const express=require('express')
const router=express.Router()

// All Authors
router.get('/', (req,res)=>{
    res.render('index') 
    // we are passing index.ejs from views/index.ejs
    // This is possible b/c of the views app.set()
})


module.exports=router