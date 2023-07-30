const router = require("express").Router()
const {login,register, me, forgetPassword} = require("../controllers/auth.controller")
const { checkToken } = require("../middlewares/auth")
const authValidation=require("../middlewares/validations/authvalidation")

router.post("/login",authValidation.login,login)
router.post("/register",authValidation.register,register)
router.get("/me",checkToken,me)
router.post("/forget-password",forgetPassword)

module.exports = router