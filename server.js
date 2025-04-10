const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const routes = require("./src/routes");

app.use(cors());
app.use(express.json());
app.use("/src", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
