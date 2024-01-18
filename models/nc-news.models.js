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

const fetchCommentsByArticleID = (article_id) => {
    return db
    .query(
        `SELECT * 
        FROM comments 
        WHERE comments.article_id = $1;`, 
        [article_id])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Article Does Not Exist' })
            }
            return result.rows;
        })
}

const insertComment = ({ username, body }, article_id) => {
    return db.query(`
    INSERT INTO 
    comments (author, body, article_id) 
    VALUES ($1, $2, $3) 
    RETURNING *;`, 
    [username, body, article_id])
    .then((result) => {  
        return result.rows[0];
    })
}

const updateVoteAtArtcileId = (article_id, newVotes) => {
    return db.query(`
    UPDATE articles 
    SET votes = votes + $1 
    WHERE article_id = $2 
    RETURNING *;`, 
    [newVotes, article_id])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Article Does Not Exist" });
        }
        return result.rows[0]
    })
}

const removeCommentById = (comment_id) => {
    return db.query(`
    SELECT * 
    FROM comments 
    WHERE comment_id = $1
    `, [comment_id]).then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Comment Does Not Exist'})
        } else {
            return db.query(`
            DELETE from comments 
            WHERE comment_id = $1;
            `, [comment_id]);
        }
    })

    
}

module.exports = { fetchTopics, fetchEndpoints, fetchArticleById, fetchArticles, fetchCommentsByArticleID, insertComment, updateVoteAtArtcileId, removeCommentById };