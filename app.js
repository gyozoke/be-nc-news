const express = require("express");
const { getTopics, getEndpoints } = require("./controllers/nc-news.consrollers");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);



module.exports = app;