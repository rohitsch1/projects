const mongoose = require('mongoose')
const id = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: "blog title is required"
    },


    body: {
        type: String,
        required: "blog body is required"
    },
    authorId: {
        type: id,
        required: "author's ID is required",
        ref: "Author"

    },
    tags: [{
        type: String
    }],

    category: {
        type: String,
        required: "blog catogory is required"
    }, 

    subcategory: [{
        type: String
    }], 

    deletedAt: { type: Date ,default:null},
    isDeleted: {
        type: Boolean,
        default: false
    },
    publishedAt: {type: Date ,default:null}, //// { when the blog is published },
    isPublished: {
        type: Boolean,
        default: false
    }


}, { timestamps: true })

module.exports = mongoose.model('Blogs', blogSchema)