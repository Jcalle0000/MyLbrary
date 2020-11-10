const express=require('express')
const router=express.Router()
const path= require('path')
const Author=require('../models/author')
const Book=require('../models/book')
            // joins public folder with coverImageBasPath
                                // coverImageBasePath = 'uploads/bookCovers'
const uploadPath=path.join('public', Book.coverImageBasePath) // Book.coverImageBasePath returns null
const imageMimeTypes=['image/jpeg ', 'image/png', 'images/gif']
// middleware for handling form-data - primarily for uploading files
// will not process any form thats not multi-part

// const multer = require('multer') - uninstalled 

// built into node
const fs =require('fs') // allows us to delete covers linked

// Issue has to be coming from here as the upload.single('cover is not working)
// or issue is coming from multer

const upload=multer({
    dest: uploadPath, // destination - public/uploads/bookCovers
    fileFilter: (req,file, callback)=>{
        callback(null, imageMimeTypes.includes(file.mimetype) )

        if(file==null){
            console.log("ISSUE IS here")
        }

        if(file!=null){
            console.log("file " + file)
        }

        console.log("upload path "+ uploadPath )
        // upload path is working and is consistent
    }    

    
})

// All Books route
router.get('/', async (req,res)=>{
    // res.send('All Books')
    // in order to use filtering options
    let query=  Book.find() // has to be let as its changing 
    if(req.query.title!=null && req.query.title!=''){ // title refers to the front end
        
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
            // regex = regular expression 
            // search, split, match metods 
        query= query.regex('title' , new RegExp(req.query.title, 'i') ) // i is used so that uppercase or lcase has no affect
    }

    // published before
    if(req.query.publishedBefore!=null && req.query.publishedBefore!=''){ // title refers to the front end
        
        query= query.lte('publishDate' , req.query.publishedBefore ) // i is used so that uppercase or lcase has no affect
    }
    // published after
    if(req.query.publishedBefore!=null && req.query.publishedAfter!=''){ // title refers to the front end
        
        query= query.gte('publishDate' , req.query.publishedAfter ) // i is used so that uppercase or lcase has no affect
    }

    try{
        // const books= await Book.find({}) // await is needed for the for loop
        const books= await query.exec() 
        res.render('books/index',{
            books:books,
            searchOptions:req.query  // SearchOptions is used name in the UI                
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

// File Encoded is used so upload.single('cover') is not needed

// Create Book Route
// async is needed since were using mongoose awaiting
                    // UI file - cover
router.post('/', async (req,res)=>{
    
    console.log()
    // console.log(req.file) // this is returning undefined

                    // req.file is from UI
    const fileName= req.file!=null? req.file.filename:null // not commented
                                    // what is req.file.filename - part of req.file 
    // const fileName="nullForNow"
    console.log("req.file " +req.file) // returns object object
    // console.log("req.file.filename "+req.file.filename) // undefined - causes errror

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
        console.log('Successfully created a book')
    } catch{
        // res.render('authors/new'), {
        //     author:author,
        //     errorMessage:'Error creating Author'
            console.log('There was an error creating a book')
            console.log( "book details " + book )
            console.log( "book.coverImageName "+book.coverImageName) // this is returning null
            
            // in case we we create a book with specifying title etc
            // we dont want to save a book thats not in the database

            if(book.coverImageName!=null){ // basically if a coverImageName was made
                removeBookCover(book.coverImageName) 
            }
            
            renderNewPage(res, book, true )
        }
        // renderNewPage(res, book,true)
    
    // res.send('Create Books')
})

function removeBookCover(fileName){
    fs.unlink(path.join(uploadPath, fileName), err =>{
        if(err ) console.log(err)
    })
}

async function renderNewPage(res, book, hasError=false){
    try{
        // author model
        const authors=await Author.find({})
        const params={
            authors:authors,
            book:book  // what abouut the description part or the images path
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