const request = require('supertest');
const app = require('../app');
const ProductImg = require('../models/ProductImg');
require('../models');

let token;
let productId;

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

test("POST /products should create one news", async() => {
    const product = {
        title: "Smart Tv - 75 Pulgadas Q60 - Qled - Samsung - 4k",
        description: "- 100 % de volumen de color con puntos cuánticos: Un millón de tonos reales de impresionante color. * * * Las televisiones QLED pueden producir un volumen de color 100 % en el espacio de color DCI-P3, el formato para la mayoría de pantallas de cine y películas HDR para televisión./Retroiluminación LED dual: La retroiluminación LED cálida y fría proporciona un contraste mejorado. * * LED dual de 32 pulgadas no disponible./HDR cuántico: Ve más allá de HDTV con una amplia gama de colores./Procesador cuántico 4K LITE: Transforma lo que estás viendo en impresionante 4K.",
        price: 1700
    }
    const res = await request(app)
        .post('/api/v1/products')
        .send(product)
        .set('Authorization', `Bearer ${token}`)
        productId = res.body.id;
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(product.title);
})

test("GET /products should return all products", async() => {
    const res = await request(app)
        .get('/api/v1/products')
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
})

test("PUT /products/:id should upDate one product", async() => {
    const body = {
        title: "smart Tv UpDated"
    }
    const res = await request(app)
        .put(`/api/v1/products/${productId}`)
        .send(body)
        .set('Authorization', `Bearer ${token}`); 
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(body.title);
})

test("POST /products/:id/images should set the products images",async() => {
    const image = await ProductImg.create({url:"abcdfg", filename: "hijklm"});
    const res = await request(app)
        .post(`/api/v1/products/${productId}/images`)   
        .send([image.id])
        .set('Authorization',`Bearer ${token}`);
        console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
})

test("DELETE /products/:id should delete one product", async() => {
    const res = await request(app)
        .delete(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
})

