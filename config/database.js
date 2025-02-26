const mongoose = require('mongoose')
require('dotenv').config()

const DB = process.env.MONGODB_URI

mongoose.connect(DB)

.then(() => {
    console.log('connection to database is succesful')
})

.catch((error) => {
    console.log('error connecting to database'  + error.message )
})

