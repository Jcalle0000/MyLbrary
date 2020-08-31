const express=require('express')
const router=express.Router()
const Author=require('../models/author')

// All Authors
router.get('/', async (req,res)=>{
    let searchOptions={}
    if(req.query.name!=null && req.query.name!==''){
        searchOptions.name= new RegExp(req.query.name,'i')
    }
    // searchOptions
    try{
        // const authors= await Author.find({})
        const authors=await Author.find(searchOptions)
        res.render('authors/index',{
            obj:authors,
            searchOptions:req.query
        }) // object of all authors
    } catch{
        res.redirect("/")
    }
})
// New Authors Route
router.get('/new',(req,res)=>{
    res.render('authors/new', {
        author:new Author()
    })
})

//Create Author post // "/authors"
router.post('/', async (req,res)=>{
    const author=new Author({name:req.body.name})
    try{
        const newAuthor=await author.save()
        console.log(author.name+" was saved")
        res.redirect(`authors`) 
    } catch{
        console.log("There was an error creating author")
        let locals={errorMessage:`Author-Profile was not created`}
        res.render(`authors`, locals)
    }
    // Works
    
    /*author.save((err,newAuthor)=>{
        if(err){
            console.log("There was an error")
            let locals={errorMessage:`Something went wrong`}
            // res.render('authors',{
            //     // author:author,
            //     errorMessage:'Error creating Author'
            // })
            res.render(`authors`, locals)
        }
        else{
            res.redirect(`author`)
        }
    })  */
    // this works somewhat
    /* author.save( (err, newAuthor) => {
        if(err){
            // if theres an error save the data so its not lost
            res.redirect('/authors/new')
            console.log("there was an error")
        }else{
            // res.redirect(`authors/${newAuthor.id}`)
            console.log(author.name)
            res.redirect(`authors`)
        }
    }) */
})

module.exports=router