const joi=require("joi")
const APIError=require("../../utils/errors")

class authValidation {
    constructor() {}
    static register = async(req,res,next) => {
        try {
            await joi.object({
                name: joi.string().trim().min(3).max(100).required().messages({
                    "string.base":"Name should be normal text",
                    "string.empty":"Name shouldn't be empty",
                    "string.min":"Name should be at lease 3 characters",
                    "string.max":"Name should be max 100 characters",
                    "string.required":"Name is required"
                }),
                lastname: joi.string().trim().min(3).max(100).required().messages({
                    "string.base":"Lastname should be normal text",
                    "string.empty":"Lastname shouldn't be empty",
                    "string.min":"Lastname should be at lease 3 characters",
                    "string.max":"Lastname should be max 100 characters",
                    "string.required":"Lastname is required"
                }),
                email: joi.string().email().trim().min(3).max(100).required().messages({
                    "string.base":"Email should be normal text",
                    "string.empty":"Email shouldn't be empty",
                    "string.min":"Please enter valid email address",
                    "string.max":"Email should be max 100 characters",
                    "string.required":"Email is required"
                }),
                password: joi.string().trim().min(6).max(36).required().messages({
                    "string.base":"Password should be normal text",
                    "string.empty":"Password shouldn't be empty",
                    "string.min":"Surname should be at lease 6 characters",
                    "string.max":"Password should be max 36 characters",
                    "string.required":"Password is required"
                })
            }).validateAsync(req.body)
        } catch (error) {
            if(error.details && error?.details[0].message){
                throw new APIError(error.details[0].message,400)
            }else{
                throw new APIError("Please validasiya qaydalarina uyun",400)
            }
        }
        next()
    }

    static login = async(req,res,next) => {
        try {
            await joi.object({
                email: joi.string().email().trim().min(3).max(100).required().messages({
                    "string.base":"Email should be normal text",
                    "string.empty":"Email shouldn't be empty",
                    "string.min":"Please enter valid email address",
                    "string.max":"Email should be max 100 characters",
                    "string.required":"Email is required"
                }),
                password: joi.string().trim().min(6).max(36).required().messages({
                    "string.base":"Password should be normal text",
                    "string.empty":"Password shouldn't be empty",
                    "string.min":"Surname should be at lease 6 characters",
                    "string.max":"Password should be max 36 characters",
                    "string.required":"Password is required"
                })
            }).validateAsync(req.body)
        } catch (error) {
            if(error.details && error?.details[0].message){
                throw new APIError(error.details[0].message,400)
            }else{
                throw new APIError("Please validasiya qaydalarina uyun",400)
            }
        }
        next()
    }
};

module.exports=authValidation;