const request = require('supertest');
const app = require('../app');

let categoryId;
let token;

beforeAll(async() => {
    const credentials = {
        email: "test@gmail.com",
        password: "test1234"
    }
    const res = await request(app)
        .post('/api/v1/users/login')
        .send(credentials);
    token = res.body.token;
})

test("POST /categories should create one category", async() => {
    const newCategory = {
        name: "Cocinas"
    }
    const res = await request(app)
        .post('/api/v1/categories')
        .send(newCategory)
        .set('Authorization', `Bearer ${token}`);
    categoryId = res.body.id;
    expect(res.status).toBe(201);
    expect(res.body.name).toBe(newCategory.name);
})

test("GET /categories should return all categories", async() => {
    const res = await request(app)
        .get('/api/v1/categories')
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
})

test("PUT /categories/:id should upDate one category", async() => {
    const body = {
        name: "cocinas UpDated"
    }
    const res = await request(app)
        .put(`/api/v1/categories/${categoryId}`)
        .send(body)
        .set('Authorization', `Bearer ${token}`); 
    expect(res.status).toBe(200);
    expect(res.body.name).toBe(body.name);
})

test("DELETE /categories/:id should delete one category", async() => {
    const res = await request(app)
        .delete(`/api/v1/categories/${categoryId}`)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
})