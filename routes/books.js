const express=require('express')
const router=express.Router()
const path= require('path')
const Author=require('../models/author')
const Book=require('../models/book')
const uploadPath=path.join('public', Book.coverImageBasePath)
const imageMimeTypes=['images/jpeg ', 'image/png', 'images/gif']
const multer = require('multer')
const author = require('../models/author')

const fs =require('fs')

const upload=multer({
    dest: uploadPath,
    fileFilter: (req,file, callback)=>{
        callback(null, imageMimeTypes.includes(file.mimetype) )
    }
})

// All Books route
router.get('/', async (req,res)=>{
    // res.send('All Books')
    
    try{
        const books= await Book.find({})
        res.render('books/index',{
            books:books,
            searchParams:req.query                  
    }) } catch{
        res.redirect('/')
    }
})
// New Book Route
router.get('/new', async (req,res)=>{

    // dosent require error b/c there shouldnt be an error getting 
    // to this page
    renderNewPage(res, new Book() )
})

// Create Book Route
router.post('/',  upload.single('cover'), async (req,res)=>{
    // if req.file is not empty get the file name or get it as null
    
    // const fileName=req.file!=null? req.file.filename:null // not commented
    const fileName="nullForNow"

    const book= new Book({
        title:req.body.title,
        author:req.body.author,
        publishDate:new Date(req.body.publishDate), // req.body.publishDate returns a string
        // ned to turn that into an ISO string variable later on
        pageCount:req.body.pageCount,
        coverImageName:fileName,
        description:req.body.description
    })
    try{
        // console.log("before save")
        const newBook= await book.save() //was un commented
        
        console.log('new Book saved ', newBook.coverImageName ) // did not have book.save()
        // coverImageName is required

        // res.redirect(`books/${newBook.id}`)
        res.redirect(`books`)
        console.log('Success')
    } catch{
        // res.render('authors/new'), {
        //     author:author,
        //     errorMessage:'Error creating Author'
            console.log('There was an error creating a book')
            console.log(book.coverImageName)
            // if(book.coverImageName!=null){ // if its not empty
            //     removeBookCover(book.coverImageName)
            // }
            // renderNewPage(res, book,true)
            // res.redirect(`books`, book) // this was not commented            
            // this did not exist but we are sending ourselves the data
            // res.redirect('/', book) // ths was not commented
            renderNewPage(res, book, true )
        }
        // renderNewPage(res, book,true)
    
    // res.send('Create Books')
})

// function removeBookCover(fileName){
//     fs.unlink(path.join(uploadPath, fileName), err =>{
//         if(err) console.log(err)
//     })
// }

// used in routed.get()
async function renderNewPage(res, book, hasError=false){
    try{
        // author model
        const authors=await Author.find({})
        const params={
            authors:authors,
            book:book
        } 
        if(hasError) params.errorMessage='Error creating Book'
        // console.log('book/new', params)
        res.render('books/new',params)
    } catch{
        res.redirect('/books')
        // if
    }
}


module.exports=router