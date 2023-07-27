const router = require("express").Router()
//CHECK IT
const auth = require("./auth.routes")

router.use(auth)

module.exports = router
