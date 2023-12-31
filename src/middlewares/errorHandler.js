const APIError = require("../utils/errors");

const errorHandlerMiddleware = (err,req,res,next) => {
    if(err instanceof APIError){
        return res.status(err.statusCode || 400)
            .json({
                success:false,
                message:err.message
            })
    }

    console.log(err.name);
    if(err.name === "CastError") console.log("testing error");

    return res.status(500).json({
        success:false,
        message:"There is an error occured, please check you API !"
    })
};

module.exports = errorHandlerMiddleware;