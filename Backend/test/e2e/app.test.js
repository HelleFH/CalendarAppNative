// test/e2e/app.test.js
import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../server.js'; // your Express app
import Entry from '../../models/entryModel.js';

let mongoServer;

beforeAll(async () => {
  // 1️⃣ Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // 2️⃣ Disconnect and stop in-memory MongoDB
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // 3️⃣ Clear all collections after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('E2E: Entry Flow', () => {
  let entryId;

  it('should create a new entry', async () => {
    const res = await request(app)
      .post('/entries/add-entry')
      .field('name', 'Test Entry')
      .field('date', '2025-10-18')
      .field('userId', 'u1')
      .attach('images', Buffer.from('fake-img'), 'test.png');

    expect(res.status).toBe(200);
    expect(res.body.entry).toBeDefined();
    expect(res.body.entry.name).toBe('Test Entry');

    entryId = res.body.entry._id; // Save for later tests
  });

  it('should get that entry by ID', async () => {
    // First, insert entry manually if previous test hasn't run
    if (!entryId) {
      const entry = await Entry.create({
        name: 'Test Entry',
        date: '2025-10-18',
        userId: 'u1',
      });
      entryId = entry._id.toString();
    }

    const res = await request(app).get(`/entries/by-parent/${entryId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('entry');
    expect(res.body.entry._id).toBe(entryId);
  });

  it('should delete the entry', async () => {
    if (!entryId) {
      const entry = await Entry.create({
        name: 'Test Entry',
        date: '2025-10-18',
        userId: 'u1',
      });
      entryId = entry._id.toString();
    }

    const res = await request(app).delete(`/entries/delete-entry/${entryId}`);
    expect(res.status).toBe(200);

    // Verify deletion
    const deleted = await Entry.findById(entryId);
    expect(deleted).toBeNull();
  });
});
