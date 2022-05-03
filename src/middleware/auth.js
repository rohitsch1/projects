const req = require('express/lib/request');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require("mongoose")
const blogsModel = require('../model/blogsModel');
const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}
const authentication = async function (req, res, next) {
    try {

        let token = req.headers["X-API-KEY"]
        if (!token) token = req.headers["x-api-key"]
        if (!token) return res.status(401).send({ status: false, msg: "token is required" })

        let decodToken = jwt.verify(token, "Group-46@secreteKey//@@blog@@project");
        if (!decodToken) return res.status(401).send({ status: false, msg: "Token is not verified" })
        next()
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}
const authorization = async function (req, res, next) {
    try {
        let token = req.headers["X-API-KEY"]
        if (!token) token = req.headers["x-api-key"]
        if (!token) return res.status(400).send({ status: false, msg: "token is required" })
        // let tokenid = req.authorId
        // console.log(tokenid)
        let data = req.params.blogId
        if (!data) return res.status(400).send({ msg: "blogId is required" })
        if (!isValidObjectId(data)) return res.status(400).send({ status: false, msg: `${data} this is not a valid blogId` })
        let blog = await blogsModel.findById(data)
        // console.log(blog)
        if (!blog) return res.status(400).send({ msg: "blog is not exist with this Id" })
        // console.log(blog.authorId)
        let decodToken = jwt.verify(token, "Group-46@secreteKey//@@blog@@project");
        if (!decodToken) return res.status(401).send({ status: false, msg: "Token is not verified" })
        // console.log(decodToken.authorId)
        if (blog.authorId.toString() === decodToken.authorId) {
            next()
        } else {
            return res.status(401).send({ status: false, msg: "You are not authorized" })
        }

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}
const authorizationQuery = async function (req, res, next) {
    try {
        let token = req.headers["X-API-KEY"]
        if (!token) token = req.headers["x-api-key"]
        if (!token) return res.status(400).send({ status: false, msg: "token is required" }) 

        let queryData = req.query
        let blog = await blogsModel.findOne({ ...queryData })
        if (!blog) return res.status(404).send({ msg: "blog does not exist" })
        let decodToken = jwt.verify(token, "Group-46@secreteKey//@@blog@@project");
        if (!decodToken) return res.status(401).send({ status: false, msg: "Token is not verified" })
        if (blog.authorId.toString() === decodToken.authorId) {
            next()
        } else {
            return res.status(401).send({ status: false, msg: "You are not authorized" })
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}

module.exports.authentication = authentication
module.exports.authorization = authorization
module.exports.authorizationQuery = authorizationQuery