const { fetchTopics, fetchEndpoints } = require("../models/nc-news.models")


const getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        res.status(200).send({topics});
    })
}

const getEndpoints = (req, res) => {
   const endpoints = fetchEndpoints();
   res.status(200).send(endpoints);
}

module.exports = { getTopics, getEndpoints };