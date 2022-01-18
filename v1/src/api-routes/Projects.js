// validations
// validate middleware

const express = require("express")
const { create, index } = require("../controllers/Projects")
const  validate  = require("../middlewares/validate")
const router = express.Router()
const schemas = require("../validations/Projects")

router.get("/",index)
router
.route("/")
.post(validate(schemas.createValidation),create)


module.exports = router