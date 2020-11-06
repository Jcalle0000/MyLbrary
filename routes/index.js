const express=require('express')
const router=express.Router()
const Book = require('../models/book')

// All Authors
router.get('/', async (req,res)=>{

    let books

    // try catch is needed since we are querying our database
    try{
        books= await // Book.find().exec()
        // console.log(books)
        Book.find().sort({
            createAt:'desc' // descending order
        }).limit(10).exec()
         console.log(books)
    } 
    catch{
        books=[]
    }


    res.render('index' , {
        books:books
    }) 
    // we are passing index.ejs from views/index.ejs
    // This is possible b/c of the views app.set()
})


module.exports=router