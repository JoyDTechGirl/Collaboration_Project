const express = require("express");
require("dotenv").config();
require("./config/database")

const PORT = process.env.PORT || 6060

const studentRouter = require('./Router/studentRouter')

const app = express()

app.use(express.json())

app.use('/api/v1',studentRouter)

app.listen(PORT,() => {
    console.log(`my server is listening to port ${PORT}`)
})



