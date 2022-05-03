const express = require('express');
const router = express.Router();
const autherController = require('../controllers/autherController')
const blogController = require('../controllers/blogController')
const midd = require('../middleware/auth')


/////////////////////   blogs  ////////////////////////////////////
router.post('/authors',autherController.authorCreate)
router.post('/blogs',midd.authentication, blogController.createBlog)
router.get('/blogs',midd.authentication, blogController.getBlogs)
router.put('/blogs/:blogId',midd.authentication,midd.authorization, blogController.putBlogs)
router.delete('/blogs/:blogId',midd.authentication, midd.authorization,blogController.deleted)
router.delete('/blog', midd.authentication,midd.authorizationQuery,blogController.queryDeleted)

//////////////////phase-2////////////////////

router.post('/login', autherController.loginAuthor)






module.exports = router;