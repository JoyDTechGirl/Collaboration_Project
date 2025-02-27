const express = require("express");
require("dotenv").config();
require("./config/database")

const PORT = process.env.PORT || 6060

const studentRouter = require('./Router/studentRouter')
const teacherRouter = require('./Router/teacherRouter')
const adminRouter = require('./Router/adminRouter')

const app = express()

app.use(express.json())

app.use('/api/v1',studentRouter)
app.use('/api/v1',teacherRouter)
app.use('/api/v1',adminRouter)

app.listen(PORT,() => {
    console.log(`my server is listening to port ${PORT}`)
})
