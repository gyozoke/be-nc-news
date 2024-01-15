const app = require('../app');
const request = require("supertest");
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const endPoints = require('../endpoints.json');



beforeEach(() => seed(data));

afterAll(() => db.end());

describe('GET', () => {
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
        // test('GET: 404 respond when endpoint does not exist', () => {
        //     return request(app)
        //     .get('/api/inccorrectEndpoint')
        //     .expect(404)
        //     .then((response) => {
        //         expect(response.body.msg).toBe('Not Found');
        //     })
        // })
    })
    describe('GET/api', () => {
        test('GET: 200 Responds with An object describing all the available endpoints on your API', () => {
            return request(app)
            .get('/api')
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(endPoints);
            })
        })
    })
})
