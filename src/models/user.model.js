const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true
    },
    lastName:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
        trim:true
    },
    reset:{
        code:{
            type:String,
            default:null
        },
        time:{
            type:Date,
            default:null
        }
    }
},{collection:"users",timestamps:true});

const user = mongoose.model("users",userSchema);

module.exports = user;