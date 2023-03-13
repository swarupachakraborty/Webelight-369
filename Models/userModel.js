const mongoose = require('mongoose');

const newUserSchema = new mongoose.Schema(
    {
fname: {
    type:String,
    required:true,
    trim:true,
},
lname: {
    type:String,
    required:true,
    trim:true,
},
email: {
    type:String,
    required:true, 
    unique:true,
    trim:true,
},

phone: {
    type:String,
    required:true,
    unique:true, 
    trim:true,
    //valid Indian mobile number
}, 
password: {
    type:String,
    required:true, 
    minLen: 8, 
    maxLen: 15,
    trim:true,
}
},{ timestamps:true }

)

module.exports=mongoose.model("newUser", newUserSchema)