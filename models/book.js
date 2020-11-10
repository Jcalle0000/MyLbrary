const mongoose=require('mongoose')
// const path=require('path') 

// const coverImageBasePath='uploads/bookCovers' // this was the error 'uploads/BookCovers' prev

const bookSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    publishDate:{
        type:Date,
        required:true
    },
    pageCount:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    },
    coverImage:{
        type:Buffer,
        required:true
    },
    coverImageType:{
        type:String,
        required:true // png, jpeg etc
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Author'  
    }

})

// bookSchema is the var given 
// at the top

bookSchema.virtual('coverImagePath').get( function(){
    if(this.coverImage !=null && this.coverImageType!=null ){
        return `data:${this.coverImageType};charset=utf-8;base64,
            ${this.coverImage.toString('base64')}`
        // return path.join('/', coverImageBasePath, this.coverImageName)
                        // public/ uploads/bookCovers/ coverImageName
    }
})

module.exports=mongoose.model('Book', bookSchema )
// module.exports.coverImageBasePath=coverImageBasePath