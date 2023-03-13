
const express = require('express')
const router = express.Router()
const { authentication,authorization } = require("../middileware/auth.js")
const { registerUser, userLogin,getProfileData,updateUserDetails } = require("../Controller/userController")
const {createProduct,getProduct,getProductById,updateProductDetails,productUserdata,deleteProduct} = require("../Controller/productController")



//---USER APIS---//
//==Register User
router.post('/register', registerUser)

//==Login User
router.post('/login', userLogin) 

//==Get User
router.get('/user/:userId',authentication, getProfileData) 

//==Updating User Document
router.put('/user/:userId', authentication,authorization, updateUserDetails) 

//*******************************************************************//

//---PRODUCT APIS---//
//==Create Poduct Document
router.post('/products', createProduct)

//==Get Product Document(all or filter)
router.get('/products', getProduct)

//==Get Product by Id
router.get('/products/:productId', getProductById)

//==Update Product Document
router.put('/products/:productId', updateProductDetails)
// ===get productUserdata
router.get("/fetching data", productUserdata)
//==Delete Product Document
router.delete('/products/:productId', deleteProduct)

//*******************************************************************//

module.exports = router  

//*******************************************************************//