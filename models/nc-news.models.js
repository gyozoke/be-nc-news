const { log } = require('console');
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

module.exports = { fetchTopics, fetchEndpoints };