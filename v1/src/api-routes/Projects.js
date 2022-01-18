// validations
// validate middleware

const express = require("express")
const { create, index } = require("../controllers/Projects")
const authenticateToken = require("../middlewares/authenticate")
const  validate  = require("../middlewares/validate")
const router = express.Router()
const schemas = require("../validations/Projects")

router.route("/").get(authenticateToken,index)
router
.route("/")
.post(validate(schemas.createValidation),create)


module.exports = router