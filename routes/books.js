const express=require('express')
const router=express.Router()
const path= require('path')
const Author=require('../models/author')
const Book=require('../models/book')
const uploadPath=path.join('public', Book.coverImageBasePath)
const imageMimeTypes=['images/jpeg', 'image/png', 'images/gif']
const multer = require('multer')
const author = require('../models/author')
const upload=multer({
    dest: uploadPath,
    fileFilter: (req,file, callback)=>{
        callback(null, imageMimeTypes.includes(file.mimetype) )
    }
})

// All Books route
router.get('/', async (req,res)=>{
    res.send('All Books')
})
// New Book Route
router.get('/new', async (req,res)=>{
    renderNewPage(res, new Book() )
})

// Create Book Route
router.post('/',  upload.single('cover'),   async(req,res)=>{
    const fileName=req.file!=null? req.file.fieldname:null
    const book= new Book({
        title:req.body.title,
        author:req.body.author,
        publishDate:new Date(req.body.publishDate),
        pageCount:req.body.pageCount,
        coverImageName:fileName,
        description:req.body.description
    })
    try{
        const newBook= await book.save()
        // res.redirect(`books/${newBook.id}`)
        res.redirect(`books`)
        console.log('Success')
    } catch{
        // res.render('authors/new'), {
        //     author:author,
        //     errorMessage:'Error creating Author'
            console.log('There was an error creating a book')
            console.log(book)
            // renderNewPage(res, book,true)
            res.redirect(`books`, book)
        }
        // renderNewPage(res, book,true)
    
    // res.send('Create Books')
})

async function renderNewPage(res, book, hasError=false){
    try{
        // author model
        const authors=await Author.find({})
        const params={
            authors:authors,
            book:book
        } 
        if(hasError) params.errorMessage='Error creating Book'
        res.render('books/new',params)
    } catch{
        res.redirect('/books')
    }
}


module.exports=router