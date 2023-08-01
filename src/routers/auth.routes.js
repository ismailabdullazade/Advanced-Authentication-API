const router = require("express").Router()
const {login,register, me, forgetPassword, resetCodeCheck} = require("../controllers/auth.controller")
const { checkToken } = require("../middlewares/auth")
const authValidation=require("../middlewares/validations/authvalidation")

router.post("/login",authValidation.login,login)
router.post("/register",authValidation.register,register)
router.post("/forget-password",forgetPassword)
router.post("/reset-code-check",resetCodeCheck)

router.get("/me",checkToken,me)

module.exports = router