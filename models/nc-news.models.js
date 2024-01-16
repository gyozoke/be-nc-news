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

module.exports = { fetchTopics, fetchEndpoints, fetchArticleById };