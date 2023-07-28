const router = require("express").Router()
const multer = require("multer")
const upload = require("../middlewares/lib/uploads")
//CHECK IT
const auth = require("./auth.routes")
const APIError = require("../utils/errors")
const Response = require("../utils/response")

router.use(auth)

router.post("/upload",function(req,res){
    upload(req,res,function(err){
        if(err instanceof multer.MulterError){
            throw new APIError("There is a problem with multer: ",err)
        }else if(err){
            throw new APIError("Occured mistake while loading image: ",err)
        }else{
            throw new Response(req.savedImages,"Upload cmopleted").success(res)
        }
    })
})

module.exports = router;
