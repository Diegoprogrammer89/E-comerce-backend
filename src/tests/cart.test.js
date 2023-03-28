const request = require('supertest');
const app = require('../app');
const Product = require('../models/Product');
require('../models');

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

test("POST /cart should create one cart", async() => {
   const product = await Product.create({
    title: "Smart Tv - 75 Pulgadas Q60 - Qled - Samsung - 4k",
    description: "- 100 % de volumen de color con puntos cuánticos: Un millón de tonos reales de impresionante color. * * * Las televisiones QLED pueden producir un volumen de color 100 % en el espacio de color DCI-P3, el formato para la mayoría de pantallas de cine y películas HDR para televisión./Retroiluminación LED dual: La retroiluminación LED cálida y fría proporciona un contraste mejorado. * * LED dual de 32 pulgadas no disponible./HDR cuántico: Ve más allá de HDTV con una amplia gama de colores./Procesador cuántico 4K LITE: Transforma lo que estás viendo en impresionante 4K.",
    price: 1700
   })
   const cart = {
    quantity: "1",
    productId: product.id
   }
   const res = await request(app)
    .post('/api/v1/cart')
    .send(cart)
    .set('Authorization', `Bearer ${token}`);
await product.destroy();
expect(res.statusCode).toBe(201);
expect(res.body.quantity).toBe(cart.quantity);
})