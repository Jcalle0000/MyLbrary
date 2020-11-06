const express=require('express')
const router=express.Router()
const path= require('path')
const Author=require('../models/author')
const Book=require('../models/book')
const uploadPath=path.join('public', Book.coverImageBasePath) // Book.coverImageBasePath returns null
const imageMimeTypes=['image/jpeg ', 'image/png', 'images/gif']
// middleware for handling form-data - primarily for uploading files
// will not process any form thats not multi-part
const multer = require('multer')

const fs =require('fs') // allows us to delete covers linked

// Issue has to be coming from here as the upload.single('cover is not working)
// or issue is coming from multer

const upload=multer({
    dest: uploadPath,
    fileFilter: (req,file, callback)=>{
        callback(null, imageMimeTypes.includes(file.mimetype) )


        if(file==null){
            console.log("ISSUE IS here")
        }

        if(file!=null){
            console.log(file)
        }

        console.log("upload path "+ uploadPath )
    }    

    
})

// All Books route
router.get('/', async (req,res)=>{
    // res.send('All Books')
  
    try{
        const books= await Book.find({}) // await is needed for the for loop
        res.render('books/index',{
            books:books,
            searchOptions:req.query                  
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
// async is needed since were using mongoose awaiting
router.post('/',  upload.single('cover'), async (req,res)=>{
    
    console.log(req.file) // this is returning undefined

    const fileName= req.file!=null? req.file.filename:null // not commented
    // const fileName="nullForNow"

    const book= new Book({
        title:req.body.title,
        author:req.body.author,
        publishDate:new Date(req.body.publishDate), // req.body.publishDate returns a string
        // ned to turn that into an ISO string variable later on
        pageCount:req.body.pageCount,
        coverImageName:fileName, // fileName is returning null b/c coverImageName
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
            
            console.log( "book.coverImageName "+book.coverImageName) // this is returning null
            console.log("uploadPath "+ uploadPath)
            // console.log("error.e ")
            // console.error(e) // causing it to crash
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

// book is being created with the id from mongodb
// title is shown
// author is connected to the id
// publishDate is going through
// however CoverImage:null - which is causing the error
// 

async function renderNewPage(res, book, hasError=false){
    try{
        // author model
        const authors=await Author.find({})
        const params={
            authors:authors,
            book:book
        } 
        if(hasError) params.errorMessage='Error creating Book'
        // if(hasError){
        //     console.log(authors)
        //     console.log(book)
        // }
        // console.log('book/new', params)
        res.render('books/new',params) // send us to the same page with the same parameter
    } catch{
        res.redirect('/books')
        // if
    }
}




module.exports=router