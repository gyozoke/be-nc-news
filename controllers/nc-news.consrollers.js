const { fetchTopics, fetchEndpoints, fetchArticleById, fetchArticles, fetchCommentsByArticleID, insertComment, updateVoteAtArtcileId, removeCommentById } = require("../models/nc-news.models")

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


const getCommentsByArticleID = (req, res, next) => {
    const { article_id } = req.params;
    fetchCommentsByArticleID(article_id)
    .then((comments) => {
        res.status(200).send({comments});
    }).catch((err) => {
        next(err);
    })
}

const postComment = (req, res, next) => {
    const { article_id } = req.params;
    const newComment = req.body;
    
    insertComment(newComment, article_id)
    .then((comment) => {
        res.status(201).send({ comment });
    }).catch((err) => {
        next(err);
    })
}

const patchVoteAtArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes }  = req.body;
    updateVoteAtArtcileId(article_id, inc_votes)
    .then((updatedArticle) => {
        res.status(200).send({updatedArticle});
    }).catch((err) => {
        next(err);
    })
}

const deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    console.log(comment_id);
    removeCommentById(comment_id)
    .then(() => {
        res.status(204).send();
    }).catch((err) => {
        next(err);
    })
}

module.exports = { getTopics, getEndpoints, getArticleById, getArticles, getCommentsByArticleID, postComment, patchVoteAtArticleId, deleteCommentById };
