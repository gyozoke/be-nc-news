const db = require('../db/connection');
const endPoints = require('../endpoints.json');

const fetchTopics = () => {
    return db.query("SELECT * FROM topics;").then((result) => {
        return result.rows;
    }) 
}

const fetchEndpoints = () => {
    return endPoints;
}

const fetchArticleById = (article_id) => {
    return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Article Does Not Exist" });
        }
        return result.rows[0];
    })
}

const fetchArticles = () => {
    return db.query(
        `SELECT
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url, 
        COUNT(comments.article_id) 
        AS comment_count 
        FROM articles 
        LEFT JOIN comments 
        ON comments.article_id = articles.article_id 
        GROUP BY articles.article_id 
        ORDER BY created_at DESC`)
    .then((result) => {
        return result.rows;
    })
}

module.exports = { fetchTopics, fetchEndpoints, fetchArticleById, fetchArticles };