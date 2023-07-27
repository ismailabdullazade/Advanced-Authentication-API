require("express-async-errors")
const user = require("../models/user.model");
const bcrypt = require("bcrypt");
const APIError = require("../utils/errors");
const Response = require("../utils/response");
const { createToken } = require("../middlewares/auth");


const login = async(req,res)=>{
    const {email,password}=req.body;

    const userInfo=user.findOne({email})

    if(!userInfo){
        throw new APIError("Email or Password is incorrect",401)
    }
    const comparedPassword=await bcrypt.compare(password,userInfo.password)

    if(!comparedPassword){
        throw new APIError("Email or Password is incorrect",401)
    }

    createToken(userInfo,res)
};

const register = async(req,res)=>{

    const {email} =req.body;

    const userCheck = await user.findOne({email});

    if(userCheck){
        throw new APIError("Girmish oldugunuz email kullanimda",401)
        
    }
    req.body.password = await bcrypt.hash(req.body.password,10);
    try {
        const userSave = new user(req.body);

        await userSave.save()
            .then((response)=>{
                return new Response(response,"User registered successfuly").created(res)
            })
            .catch((error)=>{
                throw new APIError("User couldn't register !",400)
            })
    } catch (error) {
        console.log(error);
    }


    return res.json(req.body)
}

const me = async(req,res) => {
    console.log("Inside of Me function");
    console.log(req.user);
    throw new Response(req.user).success(res);
}

module.exports = {
    login,
    register,
    me
}