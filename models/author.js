const mongoose=require('mongoose')

const authorSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
})
// name of our table - Author
module.exports=mongoose.model('Author', authorSchema)