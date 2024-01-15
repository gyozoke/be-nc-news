const db = require('../db/connection');

const fetchTopics = () => {
    return db.query("SELECT * FROM topics;").then((result) => {
        // if (result.rows.length === 0) {
        //     return Promise.reject({ status: 404, msg: 'Not Found' });
        // }
        return result.rows;
    }) 
}

module.exports = { fetchTopics };