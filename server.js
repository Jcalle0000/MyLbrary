// const dotenv=require('dotenv')
// dotenv.config()

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }


const express=require('express')
const app=express()
const expressLayouts=require('express-ejs-layouts')
const bodyParser=require('body-parser')

// Main page
const indexRouter=require('./routes/index') 
const authorRouter=require('./routes/authors')
const bookRouter=require('./routes/books')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views') // i dont think this is needed - view engine should already take care of this?
app.set('layout', 'layouts/layout') // Main page is here

app.use(expressLayouts)
app.use(express.static('public') ) // js files

app.use(bodyParser.urlencoded({
  limit:'10mb', 
  extended:false
}))

const mongoose=require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser:true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', error=> console.error(error) )
db.once('open', ()=>  console.log("Connected to Mongoose") )

app.use('/',indexRouter) // Main Page
app.use('/authors',authorRouter) // Author Page
app.use('/books', bookRouter)

app.listen(process.env.PORT || 3500)
console.log(`3500- PDF-Lbrary`)


