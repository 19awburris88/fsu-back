const express = require("express");
require("dotenv").config();

const app = express();
const routes = require("./api/routes");
const cors = require("cors");

app.use(cors({ origin: /localhost/ }));
app.use(express.json());
app.use("/api", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
