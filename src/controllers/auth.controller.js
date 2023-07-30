require("express-async-errors")
const user = require("../models/user.model");
const bcrypt = require("bcrypt");
const APIError = require("../utils/errors");
const Response = require("../utils/response");
const { createToken } = require("../middlewares/auth");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const moment = require("moment");


const login = async(req,res)=>{
    const {email,password}=req.body;
    

    const userInfo=await user.findOne({email})
    
    if(!userInfo){
        throw new APIError("Email or Password is incorrect",401);
        
    }
    const comparedPassword=await bcrypt.compare(password,userInfo.password);
    console.log(comparedPassword);

    if(!comparedPassword){
        console.log("shifren sehvdu");
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

        await userSave
        .save()
        .then((data) => {
          return new Response(data, "Kayıt Başarıyla Eklendi").created(res);
        })
        .catch((err) => {
          throw new APIError("Kullanıcı Kayıt Edilemedi !", 400);
        });
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
const forgetPassword = async (req, res) => {
    const { email } = req.body;
  
    const userInfo = await user
      .findOne({ email })
      .select(" name lastname email ");
  
    if (!userInfo) return new APIError("Geçersiz Kullanıcı", 400);
  
    console.log("userInfo : ", userInfo);
  
    const resetCode = crypto.randomBytes(3).toString("hex");
  
    console.log(resetCode);
  
    await sendEmail({
        from: "base.api.proje@outlook.com",
        to: userInfo.email,
        subject: "Şifre Sıfırlama",
        text: `Şifre Sıfırlama Kodunuz ${resetCode}`
    })
  
    await user.updateOne(
      { email },
      {
        reset: {
          code: resetCode,
          time: moment(new Date())
            .add(15, "minute")
            .format("YYYY-MM-DD HH:mm:ss"),
        },
      }
    );
  
    return new Response(true, "Lütfen Mail Kutunuzu Kontrol Ediniz").success(res);
  };

module.exports = {
    login,
    register,
    me,
    forgetPassword
}