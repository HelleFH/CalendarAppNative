// tests/integration/entryRoutes.test.js
import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import router from '../../Routes/routes';

jest.unstable_mockModule('../../config/cloudinary.js', () => ({
    default: { uploader: { upload: jest.fn().mockResolvedValue({ secure_url: 'mock-url' }) } },
}));

const app = express();
app.use(express.json());
app.use('/entries', router);

describe('Entry Routes', () => {
  it('POST /entries/add-entry should add a new entry', async () => {
    const res = await request(app)
      .post('/entries/add-entry')
      .attach('images', Buffer.from('fake-img'), 'test.png')
      .field('title', 'Test Entry');
    expect(res.status).toBe(201);
  });

  it('GET /entries/entries-for-date should return entries', async () => {
    const res = await request(app).get('/entries/entries-for-date?date=2025-10-18');
    expect(res.status).toBe(200);
  });
});
