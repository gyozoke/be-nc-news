const app = require('../app');
const request = require("supertest");
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const endPoints = require('../endpoints.json');



beforeEach(() => seed(data));

afterAll(() => db.end());

describe("GET /api/invalid-endpoints", () => {
  test("GET: 404 responds with not found when given an unrecognisable endpoint", () => {
    return request(app)
    .get("/api/hdgfhdgfdhf")
    .expect(404);
  });
});

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
        .then(({ body }) => {
            expect(body.article).toMatchObject({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
            })
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

describe('GET /api/articles', () => {
    test('GET 200: Responds with: an articles array of article objects, each of which should have the following properties: author, title, article_id, topic, created_at, votes, article_img_url, comment_count.', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            expect(body.articles.length).toBe(13);
            body.articles.forEach((article) => {
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(String)
                })
            })
        })
    })
    test('GET:200 the articles should be sorted by date in descending order', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy('created_at', {
                descending: true
              });
        })
    })
})