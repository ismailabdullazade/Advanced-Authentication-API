require("express-async-errors")
const user = require("../models/user.model");
const bcrypt = require("bcrypt");
const APIError = require("../utils/errors");
const Response = require("../utils/response");
const { createToken,createTemporaryToken } = require("../middlewares/auth");
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

const resetCodeCheck = async (req,res) => {
    const { email, code } = req.body

    const userInfo = await user.findOne({email}).select("_id name lastname email reset")

    if(!userInfo){
        throw new APIError("Gecersiz kod",401)
    }
    const dbTime = moment(userInfo.reset.time)
    const nowTime = moment(new Date())

    const timeDiff = dbTime.diff(nowTime,'minutes')

    console.log("Time difference is: ",timeDiff);

    if(timeDiff <= 0 || userInfo.reset.code !== code){
        throw new APIError("Gecersiz kod",401)
    }
    const temporaryToken = await createTemporaryToken(userInfo._id,userInfo.email)

    return new Response({temporaryToken},"Sifre sifirlama ede bilersiniz").success(res)

}

const resetPassword = async (req,res) => {
    const {password, temporaryToken} = req.body;

    const decodedToken = await decodedTemporaryToken(temporaryToken)
    console.log("decodedToken: " + decodedToken);

    const hashPassword = await bcrypt.hash(password,10)

    await user.findByIdAndUpdate(
        {_id:decodedToken._id},
        {
            reset:{
                code:null,
                time:null,
            },
            password:hashPassword
        }
    )
    return new Response(decodedToken,"You reseted password successfuly !").success(res)
}
module.exports = {
    login,
    register,
    me,
    forgetPassword,
    resetCodeCheck
}