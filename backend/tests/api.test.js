/**
 * Backend API Tests using Jest and Supertest
 * Tests API endpoints for the MedOps backend
 */

import request from 'supertest';
import app from '../server.js';

const BASE_URL = 'http://localhost:3001';
let authToken;

// Test user data
const testUser = {
  email: 'test@pharmacy.com',
  password: 'testpass123',
  name: 'Test User',
  role: 'admin'
};

const testMedicine = {
  name: 'Aspirin',
  dosage: '500mg',
  price: 50,
  quantity: 100,
  manufacturer: 'Pharma Co'
};

describe('MedOps Backend API Tests', () => {
  
  // Authentication Tests
  describe('Authentication', () => {
    
    test('POST /api/auth/register - Should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', testUser.email);
    });
    
    test('POST /api/auth/login - Should login user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      authToken = res.body.token;
    });
    
    test('POST /api/auth/login - Should fail with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });
      
      expect(res.status).toBe(401);
    });
  });
  
  // Medicines Tests
  describe('Medicines', () => {
    
    test('POST /api/medicines - Should add a new medicine', async () => {
      const res = await request(app)
        .post('/api/medicines')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testMedicine);
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toBe(testMedicine.name);
    });
    
    test('GET /api/medicines - Should fetch all medicines', async () => {
      const res = await request(app)
        .get('/api/medicines')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
    
    test('GET /api/medicines/:id - Should fetch a specific medicine', async () => {
      // First, create a medicine
      const createRes = await request(app)
        .post('/api/medicines')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testMedicine);
      
      const medicineId = createRes.body._id;
      
      // Then fetch it
      const res = await request(app)
        .get(`/api/medicines/${medicineId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body._id).toBe(medicineId);
    });
    
    test('PUT /api/medicines/:id - Should update a medicine', async () => {
      // Create a medicine first
      const createRes = await request(app)
        .post('/api/medicines')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testMedicine);
      
      const medicineId = createRes.body._id;
      
      // Update it
      const res = await request(app)
        .put(`/api/medicines/${medicineId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ price: 75 });
      
      expect(res.status).toBe(200);
      expect(res.body.price).toBe(75);
    });
    
    test('DELETE /api/medicines/:id - Should delete a medicine', async () => {
      // Create a medicine first
      const createRes = await request(app)
        .post('/api/medicines')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testMedicine);
      
      const medicineId = createRes.body._id;
      
      // Delete it
      const res = await request(app)
        .delete(`/api/medicines/${medicineId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
    });
  });
  
  // Orders Tests
  describe('Orders', () => {
    
    test('POST /api/orders - Should create a new order', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          medicines: [
            { medicineId: '123', quantity: 5 }
          ],
          totalAmount: 250
        });
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
    });
    
    test('GET /api/orders - Should fetch all orders', async () => {
      const res = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
    
    test('GET /api/orders/:id - Should fetch a specific order', async () => {
      // Create an order first
      const createRes = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          medicines: [
            { medicineId: '123', quantity: 5 }
          ],
          totalAmount: 250
        });
      
      const orderId = createRes.body._id;
      
      // Fetch it
      const res = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body._id).toBe(orderId);
    });
    
    test('PUT /api/orders/:id - Should update order status', async () => {
      // Create an order first
      const createRes = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          medicines: [
            { medicineId: '123', quantity: 5 }
          ],
          totalAmount: 250
        });
      
      const orderId = createRes.body._id;
      
      // Update its status
      const res = await request(app)
        .put(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'shipped' });
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('shipped');
    });
  });
  
  // Authorization Tests
  describe('Authorization', () => {
    
    test('Should reject requests without token', async () => {
      const res = await request(app)
        .get('/api/medicines');
      
      expect(res.status).toBe(401);
    });
    
    test('Should reject requests with invalid token', async () => {
      const res = await request(app)
        .get('/api/medicines')
        .set('Authorization', 'Bearer invalidtoken123');
      
      expect(res.status).toBe(401);
    });
  });
});

// Run with node directly without Jest
if (process.env.NODE_ENV === 'test' || process.argv[1].includes('api.test.js')) {
  console.warn('Note: These tests are written for Jest. Run with: npm test');
}
