const app = require('../app');
const request = require("supertest");
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const endPoints = require('../endpoints.json');



beforeEach(() => seed(data));

afterAll(() => db.end());

describe('GET /api/topics', () => {
    test('GET: 200 Responds with an array of topic objects, each of which should have the following properties: slug, description', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
            expect(response.body.topics.length).toBe(3);
            response.body.topics.forEach((topic) => {
                expect(typeof topic.slug).toBe('string');
                expect(typeof topic.description).toBe('string');
            })
        })
    })
})

describe('GET /api', () => {
    test('GET: 200 Responds with An object describing all the available endpoints on your API', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then((response) => {
            expect(response.body).toEqual(endPoints);
        })
    })
})

describe('GET /api/articles/:article_id', () => {
    test('GET: 200 Responds with an article object, which should have the following properties: author, title, article_id, body, topic, created_at, votes, article_img_url', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((response) => {
            expect(response.body.article.article_id).toBe(1);
            expect(response.body.article.title).toBe("Living in the shadow of a great man");
            expect(response.body.article.topic).toBe("mitch");
            expect(response.body.article.author).toBe("butter_bridge");
            expect(response.body.article.body).toBe("I find this existence challenging");
            expect(response.body.article.created_at).toBe("2020-07-09T20:11:00.000Z");
            expect(response.body.article.votes).toBe(100);
            expect(response.body.article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
        })
    })
    test('GET: 404 sends a status and error message when given a valid but non-existent id', () => {
        return request(app)
        .get('/api/articles/987')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Article Does Not Exist');
        })
    })
    test('GET: 400 sends a status and error message when given an invalid id', () => {
        return request(app)
        .get('/api/articles/not_an_article')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        })
    })
})