const express = require("express");
require("dotenv").config();
require("./config/database")

const PORT = process.env.PORT || 6060

const app = express()

app.use(express.json())

// app.use('/api/v1')

app.listen(PORT,() => {
    console.log(`my server is listening to port ${PORT}`)
})



