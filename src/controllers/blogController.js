const { default: mongoose } = require("mongoose")
const autherModel = require("../model/authorModel")
const blogsModel = require("../model/blogsModel")
const isValidReqBody = function (reqBody) {
    return Object.keys(reqBody).length > 0
}
const isValid = function (value) {
    if (typeof value == 'undefined' || typeof value == null) return false;
    if (typeof value == 'string' && value.trim().length == 0) return false;
    return true
}
const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}
let createBlog = async function (req, res) {
    try {
        let data = req.body
        let id = data.authorId
        if (!isValidReqBody(data)) return res.status(400).send({ status: false, msg: "please provide blog details" })
        if (!isValid(data.title)) res.status(400).send({ status: false, msg: "blog title is required" })
        if (!isValid(data.body)) res.status(400).send({ status: false, msg: "blog body is required" })
        if (!isValid(data.category)) res.status(400).send({ status: false, msg: "blog category is required" })
        if (!isValid(id)) return res.status(400).send({ status: false, msg: "authorId is required" })
        if (!isValidObjectId(id)) return res.status(400).send({ status: false, msg: `${id} this is not a valid authorId` })
        let findAuthor = await autherModel.findById(id)
        if (!findAuthor) return res.status(404).send({ msg: "author doesn't exist" })
        if (data.isPublished == true)
            data["publishedAt"] = new Date();
        let blog = await blogsModel.create(data)
        res.status(201).send({ status: true, data: blog })
    } catch (err) {
        console.log(err.message)
        res.status(500).send({ error: err.message })
    }
}
const getBlogs = async function (req, res) {

    try {

        let data = req.query;
        let filter = { $and: [{ isDeleted: false, isPublished: true, ...data }] };
        // console.log(filter);
        if (!isValid(data)) res.status(400).send({ status: false, msg: "please enter your quary" })
        let blogsPresent = await blogsModel.find(filter)
        if (blogsPresent.length === 0) {
            res.status(404).send({ status: false,msg: " your quary does not match with any blogs" })
        } else {
            res.status(200).send({ status: true, data: blogsPresent })
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}

const putBlogs = async function (req, res) {
    try {
        let data = req.body
        let id = req.params.blogId
        if (!isValidReqBody(data)) return res.status(400).send({ status: false, msg: "please provide what you want to update in your blog" })
        let findblog = await blogsModel.findById(id)
        if (findblog.isDeleted == true) return res.status(404).send({ msg: "Blog is already deleted " })
        if (findblog.isDeleted == false) {
            if(data.isPublished == true){
            let updatedBlog = await blogsModel.findOneAndUpdate({ _id: id}, {
                $set: {
                    title: data.title,
                    body: data.body,
                    category: data.category,
                    publishedAt: new Date(),
                    isPublished:true
                },
                $push: {
                    tags: req.body.tags,
                    subcategory: req.body.subcategory
                }
            }, { new: true})
             res.status(200).send({status:true,msg:"update successfull",data:updatedBlog})
        }else {
            let updatedBlog = await blogsModel.findOneAndUpdate({ _id: id}, {
                $set: {
                    title: data.title,
                    body: data.body,
                    category: data.category,
                },
                $push: {
                    tags: req.body.tags,
                    subcategory: req.body.subcategory
                }
            }, { new: true})
            return res.status(200).send({status:true,msg:"update successfull",data:updatedBlog})
        }
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}
let deleted = async function (req, res) {
    try {
        let id = req.params.blogId
        
        let idvalidation = await blogsModel.findById(id)
        
        if (idvalidation.isDeleted == true) return res.status(404).send({ status: false, msg: "blog is allready deleted" })
        if (idvalidation.isDeleted == false) {
             await blogsModel.findOneAndUpdate({ _id: id }, { $set: { isDeleted: true, deletedAt: new Date() } })
            return res.status(200).send({ status: true, msg: "blog is deleted successfully" })
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}

let queryDeleted = async function (req, res) {
    try {
        let Data = req.query
        if (!isValid(Data)) return res.status(400).send({ status: false, msg: "please provide quary to find your blog" })
        let filter = { ...Data }
        
        let blogvalidation = await blogsModel.findOne(filter)
       
        if (blogvalidation.isDeleted == true) return res.status(404).send({ status: false, msg: " blog is allready deleted" })
        if (blogvalidation.isDeleted == false) {
            // let idList = blogvalidation._id
            // console.log(idList)
            let deletion = await blogsModel.findOneAndUpdate(filter, { $set: { isDeleted: true, deletedAt: new Date() } })
            return res.status(200).send({ status: true, msg: "blog is deleted successfully" })
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }


}

module.exports.queryDeleted = queryDeleted
module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs
module.exports.putBlogs = putBlogs
module.exports.deleted = deleted 