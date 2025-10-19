// test/unit/updateEntryController.test.js
import { jest } from '@jest/globals';
import mongoose from 'mongoose';

// -------------------------
// 1️⃣ Mock the models & Cloudinary
// -------------------------
await jest.unstable_mockModule('../../models/updateEntryModel.js', () => ({
  default: {
    findById: jest.fn(),
    find: jest.fn(),
    findByIdAndDelete: jest.fn(),
    prototype: { save: jest.fn() },
  },
}));
await jest.unstable_mockModule('../../models/entryModel.js', () => ({
  default: { findById: jest.fn() },
}));
await jest.unstable_mockModule('../../config/cloudinary.js', () => ({
  default: { uploader: { upload: jest.fn(), destroy: jest.fn() } },
}));

const UpdateEntry = (await import('../../models/updateEntryModel.js')).default;
const Entry = (await import('../../models/entryModel.js')).default;
const cloudinary = (await import('../../config/cloudinary.js')).default;

const {
  updateEntry,
  deleteUpdateEntry,
  editUpdateEntry,
  getUpdatesByParent,
  getUpdateEntryDatesByUser,
} = await import('../../Controllers/updateEntryController.js');

// -------------------------
// 2️⃣ Helper for res mock
// -------------------------
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// -------------------------
// 3️⃣ Tests
// -------------------------
describe('UpdateEntry Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------- deleteUpdateEntry --------
  describe('deleteUpdateEntry', () => {
    it('should return 400 if entryId missing', async () => {
      const req = { params: {} };
      const res = mockRes();
      await deleteUpdateEntry(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 if update entry not found', async () => {
      UpdateEntry.findById.mockResolvedValue(null);
      const req = { params: { entryId: '1' } };
      const res = mockRes();
      await deleteUpdateEntry(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should delete update entry successfully', async () => {
      UpdateEntry.findById.mockResolvedValue({ images: ['url1'] });
      UpdateEntry.findByIdAndDelete.mockResolvedValue(true);
      cloudinary.uploader.destroy.mockResolvedValue(true);

      const req = { params: { entryId: '1' } };
      const res = mockRes();

      await deleteUpdateEntry(req, res);
      expect(UpdateEntry.findById).toHaveBeenCalledWith('1');
      expect(UpdateEntry.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // -------- getUpdatesByParent --------
  describe('getUpdatesByParent', () => {
    it('should return 400 if parentObjectId missing', async () => {
      const req = { query: {} };
      const res = mockRes();
      await getUpdatesByParent(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if parentObjectId invalid', async () => {
      const req = { query: { parentObjectId: 'invalid' } };
      const res = mockRes();
      await getUpdatesByParent(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 if no updates found', async () => {
      UpdateEntry.find.mockResolvedValue([]);
      const req = { query: { parentObjectId: new mongoose.Types.ObjectId().toString() } };
      const res = mockRes();
      await getUpdatesByParent(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return updates successfully', async () => {
      const updates = [{ _id: '1' }];
      UpdateEntry.find.mockResolvedValue(updates);
      const req = { query: { parentObjectId: new mongoose.Types.ObjectId().toString() } };
      const res = mockRes();
      await getUpdatesByParent(req, res);
      expect(res.json).toHaveBeenCalledWith(updates);
    });
  });

  // -------- updateEntry --------
  describe('updateEntry', () => {
    it('should return 400 if missing required fields', async () => {
      const req = { body: {}, files: [] };
      const res = mockRes();
      await updateEntry(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should create update entry successfully', async () => {
      Entry.findById.mockResolvedValue({ _id: 'parent1' });
      cloudinary.uploader.upload.mockResolvedValue({ secure_url: 'img.png' });
      const saveMock = jest.fn();
      const newUpdateEntry = { save: saveMock };
      jest.spyOn(UpdateEntry.prototype, 'save').mockImplementation(saveMock);

      const req = {
        body: { parentObjectId: 'p1', notes: 'note', date: '2025-10-18', userId: 'u1' },
        files: [{ buffer: Buffer.from('x'), mimetype: 'image/png' }],
      };
      const res = mockRes();
      await updateEntry(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // -------- editUpdateEntry --------
  describe('editUpdateEntry', () => {
    it('should return 404 if entry not found', async () => {
      UpdateEntry.findById.mockResolvedValue(null);
      const req = { params: { entryId: '1' }, body: { userId: 'u1' } };
      const res = mockRes();
      await editUpdateEntry(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 403 if unauthorized', async () => {
      UpdateEntry.findById.mockResolvedValue({ userId: 'different' });
      const req = { params: { entryId: '1' }, body: { userId: 'u1' } };
      const res = mockRes();
      await editUpdateEntry(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should edit update entry successfully', async () => {
      const save = jest.fn();
      UpdateEntry.findById.mockResolvedValue({ userId: 'u1', save, images: [] });
      cloudinary.uploader.upload.mockResolvedValue({ secure_url: 'img.png' });

      const req = {
        params: { entryId: '1' },
        body: { userId: 'u1', date: '2025', notes: 'B' },
        files: [{ buffer: Buffer.from('x'), mimetype: 'image/png' }],
      };
      const res = mockRes();
      await editUpdateEntry(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // -------- getUpdateEntryDatesByUser --------
  describe('getUpdateEntryDatesByUser', () => {
    it('should fetch dates successfully', async () => {
      const entries = [{ date: '2025-10-18' }, { date: '2025-10-19' }];
      UpdateEntry.find.mockResolvedValue(entries);

      const req = { query: { userId: 'u1' } };
      const res = mockRes();
      await getUpdateEntryDatesByUser(req, res);
      expect(res.json).toHaveBeenCalledWith(['2025-10-18', '2025-10-19']);
    });
  });
});
