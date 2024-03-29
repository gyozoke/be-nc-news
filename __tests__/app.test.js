const app = require('../app');
const request = require("supertest");
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');
const endPoints = require('../endpoints.json');


beforeEach(() => seed(data));

afterAll(() => db.end());


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

describe('GET /api/topics', () => {
    test('GET: 200 Responds with an array of topic objects, each of which should have the following properties: slug, description', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            expect(body.topics.length).toBe(3);
            body.topics.forEach((topic) => {
                expect(topic).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
        })
    })
})

describe('GET /api/users', () => {
    test('GET: 200 responds with an array of objects, each object should have the following properties: username, name, avatar_url', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
            expect(body.users.length).toBe(4)
            body.users.forEach((user) => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            })
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
    test('GET: 200 should also accept the following query: topic(mitch), which filters the articles by the topic value specified in the query.', () => {
        return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({body}) => {
            expect(body.articles.length).toBe(12);
            body.articles.forEach((article) => {
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: 'mitch',
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(String)
                })
            })
        })
    })
    test('GET: 200 should also accept the following query: topic(cats), which filters the articles by the topic value specified in the query. If the query is omitted, the endpoint should respond with all articles', () => {
        return request(app)
        .get('/api/articles?topic=cats')
        .expect(200)
        .then(({body}) => {
            expect(body.articles.length).toBe(1);
            body.articles.forEach((article) => {
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: 'cats',
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(String)
                })
            })
        })
    })
    test('GET: 404 responds with a status and a message when given an invalid (non existing) query', () => {
        return request(app)
        .get('/api/articles?topic=not_a_topic')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Query Does Not Exist')
        })
    })
})

describe("GET /api/invalid-endpoints", () => {
    test("GET: 404 responds with not found when given an unrecognisable endpoint", () => {
      return request(app)
      .get("/api/hdgfhdgfdhf")
      .expect(404);
    });
  });

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
    test('GET: 200 Responds with an article object, where we now have a new property comment_count added as well', () => {
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
                article_img_url: expect.any(String),
                comment_count: expect.any(String)
            })
        })
    })
    test('GET: 404 sends a status and error message when given a valid but non-existent id', () => {
        return request(app)
        .get('/api/articles/987')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Article Does Not Exist');
        })
    })
    test('GET: 400 sends a status and error message when given an invalid id', () => {
        return request(app)
        .get('/api/articles/not_an_article')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request');
        })
    })
})

describe('GET /api/articles/:article_id/comments', () => {
    test('GET: 200 Responds with: an array of comments for the given article_id of which each comment should have the following properties: comment_id, votes, created_at, author, body, article_id', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            expect(body.comments.length).toBe(11)
            body.comments.forEach((comment) => {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    article_id: 1
                })
            })
        })
    })
    test('GET: 404 sends a status and error message when given a valid but non-existent article_id', () => {
        return request(app)
        .get('/api/articles/987/comments')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Article Does Not Exist');
        })
    })
    test('GET: 400 sends a status and error message when given an invalid article_id', () => {
        return request(app)
        .get('/api/articles/not_an_article/comments')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request');
        })
    })
})

describe('POST /api/articles/:article_id/comments', () => {
    test('POST: 201 inserts a new comment to the db', () => {
        const newComment = {
            username: 'butter_bridge',
            body: 'Awesome Article'
          };
          return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(201)
            .then(({body}) => {
              expect(body.comment.comment_id).toBe(19);
              expect(body.comment.author).toBe("butter_bridge");
              expect(body.comment.body).toBe('Awesome Article');
        });
    })
    test("POST: 400 sends status and error message when provided with wrong body (or no body)", () => {
        const newComment = {
            username: 'butter_bridge',
          };
        return request(app)
          .post('/api/articles/1/comments')
          .send(newComment)
          .expect(400)
          .then(({body}) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
      test("POST: 400 sends status and error message when provided with wrong username (or no username)", () => {
        const newComment = {
            body: 'Awesome Article'
          };
        return request(app)
          .post('/api/articles/1/comments')
          .send(newComment)
          .expect(400)
          .then(({body}) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
      test("POST: 400 sends a status and error message when given an invalid article_id", () => {
        const newComment = {
            username: 'butter_bridge',
            body: 'Awesome Article'
          };
        return request(app)
          .post('/api/articles/not_an_id/comments')
          .send(newComment)
          .expect(400)
          .then(({body}) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
      test("POST: 404 sends a status and error message when given a valid but non existing article id", () => {
        const newComment = {
            username: 'butter_bridge',
            body: 'Awesome Article'
          };
        return request(app)
          .post('/api/articles/887/comments')
          .send(newComment)
          .expect(404)
          .then(({body}) => {
            expect(body.msg).toBe('Article Does Not Exist');
          });
     });
})

describe('PATCH /api/articles/:article_id', () => {
    test('PATCH: 200 responds with the updated article if vote incrased by given value', () => {
        const newVote = {
            inc_votes: 200
        }
        return request(app)
        .patch('/api/articles/1')
        .send(newVote)
        .expect(200)
        .then(({body}) => {
            expect(body.updatedArticle).toMatchObject({
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: expect.any(String),
                votes: 300,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            })
        })
    })
    test('PATCH: 200 responds with the updated article if vote decremented by given value', () => {
        const newVote = {
            inc_votes: -200
        }
        return request(app)
        .patch('/api/articles/1')
        .send(newVote)
        .expect(200)
        .then(({body}) => {
            expect(body.updatedArticle).toMatchObject({
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: expect.any(String),
                votes: -100,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            })
        })
    })
     test('PATCH: 404 sends a status and error message when given a valid but non-existent id', () => {
         const newVote = {
            inc_votes: 200
        }
        return request(app)
        .patch('/api/articles/987')
        .send(newVote)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Article Does Not Exist');
        })
    })
    test('PATCH: 400 sends a status and error message when given an invalid id', () => {
        const newVote = {
            inc_votes: 200
        }
        return request(app)
        .patch('/api/articles/not_an_article')
        .send(newVote)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request');
        })
    })
    test("PATCH: 400 sends status and error message when provided with wrong vote (or no vote)", () => {
        const newVote = {
            inc_votes: "vote"
        }
        return request(app)
          .patch('/api/articles/1')
          .send(newVote)
          .expect(400)
          .then(({body}) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
})

describe('DELETE /api/comments/:comment_id', () => {
    test('DELETE: 204 responds with no content', () => {
        return request(app)
        .delete('/api/comments/2')
        .expect(204)
    })
    test('DELETE: 404 responds with status code and error message when given a valid but non existing id', () => {
        return request(app)
        .delete('/api/comments/222')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Comment Does Not Exist')
        })
    })
    test('DELETE: 400 responds with status and error message when given an invalid comment id', () => {
        return request(app)
        .delete('/api/comments/not_an_id')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request');
        })
    })
})


