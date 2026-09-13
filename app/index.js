const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const router = require("./routes");

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = process.env.PORT || 8000;

app.use("/images", express.static(path.join(__dirname, "..", "images")));
app.use(router);

app.listen(port, () => console.log(`Magic happens on port ${port}`));
