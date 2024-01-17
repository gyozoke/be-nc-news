const express = require("express");
const { getTopics, getEndpoints, getArticleById, getArticles, getCommentsByArticleID, postComment } = require("./controllers/nc-news.consrollers");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleID);

app.post("/api/articles/:article_id/comments", postComment);

app.use((err, req, res, next) => {
    if (err.status) {
      res.status(err.status).send({ msg: err.msg });
    } else next(err);
  });
  
  app.use((err, req, res, next) => {
    if (err.code === "23502" || err.code === '22P02') {
      res.status(400).send({ msg: 'Bad Request' });
    } else next(err);
  });

  app.use((err, req, res, next) => {
    if (err.code === "23503")
    res.status(500).send({ msg: 'Internal Server Error' });
  });



module.exports = app;