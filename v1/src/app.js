const express = require("express")
const fileUpload = require("express-fileupload")
const helmet = require("helmet")
const config = require("./config")
const loaders = require("./loaders")
const events = require("./scripts/events")
const {ProjectRoutes,UserRoutes} = require("./api-routes")


config()
loaders()
events()

const app = express()
app.use(express.json())
app.use(helmet())   
app.use(fileUpload())

app.listen(process.env.APP_PORT, () => {
    console.log("Sunucu ayağa kalktı")
    app.use("/projects",ProjectRoutes)
    app.use("/users",UserRoutes)
})