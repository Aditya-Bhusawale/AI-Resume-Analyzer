require("dotenv").config()
const path = require("path")
const express = require("express")
const cookieParser = require("cookie-parser")
const connectToDB = require("./src/config/database")

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))

/* require all the routes here */
const pageRouter = require("./src/routes/page.routes")

/* use all the routes here */
app.use("/", pageRouter)

connectToDB()

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})
