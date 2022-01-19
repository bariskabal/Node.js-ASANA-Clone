const express = require("express")
const {  index, create, update,deleteSection } = require("../controllers/Sections") // ,create, update, deleteSection
const authenticateToken = require("../middlewares/authenticate")
const  validate  = require("../middlewares/validate")
const router = express.Router()
const schemas = require("../validations/Sections")

router.route("/:projectId").get(authenticateToken,index)
 router.route("/").post(authenticateToken,validate(schemas.createValidation),create)
 router.route("/:id").delete(authenticateToken,deleteSection)
router.route("/:id").patch(authenticateToken,validate(schemas.updateValidation),update)

module.exports = router