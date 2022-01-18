// validations
// validate middleware

const express = require("express")
const { create, index,login } = require("../controllers/Users")
const  validate  = require("../middlewares/validate")
const router = express.Router()
const schemas = require("../validations/Users")

router.get("/",index)
router.route("/").post(validate(schemas.createValidation),create)
router.route("/login").post(validate(schemas.loginValidation),login)


module.exports = router