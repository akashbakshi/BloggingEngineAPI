"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const blog_1 = require("./routes/blog");
const bodyParser = require("body-parser");
const app = express();
const port = 3003;
app.use(bodyParser.json());
app.use('/blog', blog_1.default);
app.listen(port, () => {
    console.log("blogging engine starting on port " + port);
});
