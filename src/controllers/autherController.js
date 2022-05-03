const authorModel = require('../model/authorModel');
const emailvalidator = require("email-validator");
const jwt = require('jsonwebtoken');
const isValidReqBody = function (reqBody) {
    return Object.keys(reqBody).length > 0
}
const isValid = function (value) {
    if (typeof value == 'undefined' || typeof value == null) return false;
    if (typeof value == 'string' && value.trim().length == 0) return false;
    return true
}


const authorCreate = async function (req, res) {
    try {
        let content = req.body;
        let email = req.body.email;
        if (!isValidReqBody(content)) return res.status(400).send({ status: false, msg: "please provide author details" })
        if (!isValid(content.fname)) return res.status(400).send({ status: false, msg: "first name is required" })
        if (!isValid(content.lname)) return res.status(400).send({ status: false, msg: "last name is required" })
        if (!isValid(content.title)) return res.status(400).send({ status: false, msg: "title is required" })
        const isValidTitle = function (title) {
            return ["Mr", "Mrs", "Miss", "Mas"].indexOf(title) !== -1
        }
        if (!isValidTitle(content.title)) return res.status(400).send({ status: false, msg: "title include only Mr ,Mrs ,Miss ,Mas" })
        if (!isValid(content.password)) return res.status(400).send({ status: false, msg: "password is required" })
        if (!isValid(email)) return res.status(400).send({ status: false, msg: "email is required" })

        if (!emailvalidator.validate(email)) return res.status(400).send({ status: false, msg: "Invalid Email" })

        let isPresent = await authorModel.findOne({ email: email });
        if (isPresent) return res.send({ status: false, msg: `author is already present with ${email} email address` })
        let data = await authorModel.create(content);
        res.status(201).send({ status: true, msg: "auther registered successfully", data: data });
    } catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

const loginAuthor = async function (req, res) {
    try {
        let userName = req.body.email
        let password = req.body.password
        if (!isValid(userName)) return res.status(400).send({ status: false, msg: "please Enter email" })
        if (!isValid(password)) return res.status(400).send({ status: false, msg: "please Enter Password" })
        let Author = await authorModel.findOne({ $and: [{ email: userName }, { password: password }] })
        if (!Author) return res.status(404).send({ status: false, msg: "invalid login credentials" })

        let token = jwt.sign({
            authorId: Author._id.toString(),
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60
        },
            'Group-46@secreteKey//@@blog@@project'
        )
        res.setHeader("x-api-key", token)
        res.status(200).send({ status: true, msg: "author log in successfull", data: { token } })
    } catch (err) {
        console.log(err.message)
        res.status(500).send({ error: err.message })
    }

}


module.exports.authorCreate = authorCreate;
module.exports.loginAuthor = loginAuthor