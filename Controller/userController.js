const jwt = require("jsonwebtoken")
const userModel = require("../Models/userModel");
const bcrypt = require('bcrypt')
const { isValidRequestBody, isValid,isValidName, isValidMobile, isValidEmail, isValidPassword,isValidObjectId, } = require("../utility/validator.js");
const registerUser = async function (req, res) {
    try{
//==validating request body==//
     let requestBody = req.body
     if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, msg: "Invalid request, please provide details" })
     let { fname,lname,email,phone,password,address } = requestBody

//==validating first name==//
    if (!isValid(fname)) return res.status(400).send({ status: false, msg: "Name is a mandatory field" })
    if (!isValidName(fname)) return res.status(400).send({ status: false, msg: "Name must contain only alphabates" })

//==validating last name==//
    if (!isValid(lname)) return res.status(400).send({ status: false, msg: "Last Name is a mandatory field" })
    if (!isValidName(lname)) return res.status(400).send({ status: false, msg: "Last Name must contain only alphabates" })

//==validating email==//
    if (!isValid(email)) return res.status(400).send({ status: false, msg: "email is a mandatory field" })
    if (!isValidEmail(email)) return res.status(400).send({ status: false, msg: `${email} is not valid` })
    let isUniqueEmail = await userModel.findOne({ email: email })
    if (isUniqueEmail) return res.status(400).send({ status: false, msg: `${email} is already exist` })

//==validating phone==//        
    if (!isValid(phone)) return res.status(400).send({ status: false, msg: "Phone number is a mandatory field" })
    if (!isValidMobile(phone)) return res.status(400).send({ status: false, msg: `${phone} number is not a valid` })
    let isUniquePhone = await userModel.findOne({ phone: phone })
    if (isUniquePhone) return res.status(400).send({ status: false, msg: `${phone} number is already exist` })

//==validating password==//
    if (!isValid(password)) return res.status(400).send({ status: false, msg: "Password is a mandatory field" })
    if (!isValidPassword(password)) return res.status(400).send({ status: false, msg: `Password ${password}  must include atleast one special character[@$!%?&], one uppercase, one lowercase, one number and should be mimimum 8 to 15 characters long` })


    // password hashing==//
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt)


//==creating user==//    
    const userData = { fname,lname,email,phone,password };
    const saveUser = await userModel.create( userData)
    return res.status(201).send({ status: true, message: "User profile details", data: saveUser })
    }catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
    
}

//*******************************************************************//

const userLogin = async function(req,res){
    try {
//==validating request body==//
     let requestBody = req.body
    if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, msg: "Invalid request, please provide details"})  
    const {email, password} = requestBody;

//==validating email==//
    if (!isValid(email)) return res.status(400).send({ status: false, msg: "email is a mandatory field" })
    if (!isValidEmail(email)) return res.status(400).send({ status: false, msg: `${email} is not valid` })
       
//==validating password==//
    if(!isValid(password))return res.status(400).send({status:false, message: `Password is required`})
           
//==finding userDocument==//      
const user = await userModel.findOne({ email });

if (!user) {
    res.status(404).send({ status: false, message: `${email} related user unavailable` });
    return
}
const isLogin = await bcrypt.compare(password, user.password).catch(e => false)
if (!isLogin) {
    res.status(401).send({ status: false, message: `wrong email address or password` });
    return
}
        
//==creating token==//   
let token = jwt.sign(
    {
        userId:  user._id.toString(),
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 96 * 60 * 60 //4days
    },
    "We are Indian"
);
 
//==sending and setting token==// 
       res.header('Authorization',token);
       res.status(200).send({status:true, message:`User login successfully`, data:{token}});

   } catch (error) {
       res.status(500).send({status:false, message:error.message});
   }
}

//*******************************************************************//
const getProfileData = async function (req, res) {
    try {
    //==validating userId==//    
      let userId = req.params.userId
      if (!isValidObjectId(userId)) return res.status(400).send({ status: false, msg: "userId is invalid" })
      
    //==getting details==//
      let getDataList = await userModel.findOne({ _id: userId })
      if (!getDataList) return res.status(404).send({ status: false, msg: "data not found " })
      
    //==sending details==//
      return res.status(200).send({ status: true, msg: "user profile details", data: getDataList })
    }
    catch (err) {
      return res.status(500).send({ status: false, msg: err.message })
    }
  }
//   ////////////////////////////////////////////////////////////////////////////
const updateUserDetails = async function (req, res) {
    try {

        const userId = req.params.userId
        
        const updateData = req.body
    
    //==validating userId==//
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, msg: "invalid user Id" })
        let findUserId = await userModel.findById({ _id: userId })
        if (!findUserId) return res.status(404).send({ status: false, msg: "user not found" })

    //==validating request body==//
        if (!isValidRequestBody(updateData)) return res.status(400).send({ status: false, msg: "please provide data to update" })   
        const {  fname, lname, email, phone, password } = updateData 

       
    //==checking and validating fname==//
        if (fname == "") { return res.status(400).send({ status: false, message: "fname is not valid" }) }
        else if (fname) {
            if (!isValid(fname)) return res.status(400).send({ status: false, msg: "fname is missing" })
            if (!isValidName(fname)) return res.status(400).send({ status: false, msg: "fname must contain only alphabates" })
        }

    //==checking and validating lname==//
        if (lname == "") { return res.status(400).send({ status: false, message: "lname is not valid" }) }
        else if (lname) {
            if (!isValid(lname)) return res.status(400).send({ status: false, msg: "lname is missing" })
            if (!isValidName(lname)) return res.status(400).send({ status: false, msg: "lname must contain only alphabates" })
        }

    //==checking and validating email==//
        if (email == "") { return res.status(400).send({ status: false, message: "email is not valid" }) }
        else if (email) {
            if (!isValidEmail(email)) return res.status(400).send({ status: false, msg: "email is not valid" })
        }

    //==checking and validating phone==//
        if (phone == "") { return res.status(400).send({ status: false, message: "phone is not valid" }) }
        else if (phone) {
            if (!isValidMobile(phone)) return res.status(400).send({ status: false, msg: "phone is not valid" })
        }

    //==checking and validating password==//   
        if (password == "") { return res.status(400).send({ status: false, message: "password is not valid" }) }
        else if (password) {
            if (!isValid(password)) return res.status(400).send({ status: false, msg: "password is not valid" })
            updateData.password = await bcrypt.hash(password, 10)
        }

//==updating user details==//    
         const updateDetails = await userModel.findByIdAndUpdate({ _id: userId }, updateData, { new: true })
        return res.status(200).send({ status: true, message: "User profile updated successfully", data: updateDetails })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

module.exports = { registerUser,userLogin,getProfileData,updateUserDetails }
//*******************************************************************//


