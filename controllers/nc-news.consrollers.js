const { fetchTopics, fetchEndpoints, fetchArticleById, fetchArticles } = require("../models/nc-news.models")


const getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        res.status(200).send({topics});
    }).catch((err) => {
        next(err);
    })
}

const getEndpoints = (req, res) => {
   const endpoints = fetchEndpoints();
   res.status(200).send(endpoints);
}

const getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticleById(article_id)
    .then((article) => {
        res.status(200).send({article});
    }).catch((err) => {
        next(err);
    })
}

const getArticles = (req, res) => {
    fetchArticles()
    .then((articles) => {
        res.status(200).send({articles});
    }).catch((err) => {
        next(err);
    })
}

module.exports = { getTopics, getEndpoints, getArticleById, getArticles };