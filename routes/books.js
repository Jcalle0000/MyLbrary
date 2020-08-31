const express=require('express')
const router=express.Router()
const Author=require('../models/author')
const Book=require('../models/book')

// All Books route
router.get('/', async (req,res)=>{
    res.send('All Books')
})
// New Book Route
router.get('/new', async (req,res)=>{
    try{
        // author model
        const authors=await Author.find({}) 
        const book=new Book()
        // authors and book on left column
        // are the objects passed inside the ejs
        res.render('books/new',{
            authors:authors,
            book:book
        })
    } catch{
        res.redirect('/books')
        console.log('Redirected back to books b/c err')
    }
})

//Create Book Route
router.post('/', async (req,res)=>{
    res.send('Create Books')
})

module.exports=router