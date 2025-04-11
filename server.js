require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT

const prisma = require('./prisma')

const cors = require("cors");
app.use(cors({ origin: "https://localhost" }));

app.use(express.json())
app.use(require('morgan')('dev'))
app.use("/api", require("./api"));

app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status ?? 500;
    const message = err.message ?? 'Internal server error.';
    res.status(status).json({ message });
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})