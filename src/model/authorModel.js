const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
    fname: {
        type: String,
        trim:true,
        required: "first name is required"
    },

    lname: {
        type: String,
        trim:true,
        required: "last name is required"
    },

    title: {
        type: String,
        enum: ["Mr", "Mrs", "Miss","Mas"],
        required:true
    },
    email:{
        type:String,
        trim:true,
        unique:true,
        required:"email is required"
    },
    password: {
        type: String,
        trim:true,
        required: "password is required" 
    }

})

module.exports = mongoose.model('Author', authorSchema)