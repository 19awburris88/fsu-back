require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT

const prisma = require('./prisma')

app.use(express.json())
app.use(require('morgan')('dev'))

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})