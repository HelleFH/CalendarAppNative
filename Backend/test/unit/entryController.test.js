// test/unit/entryController.test.js
import { jest } from '@jest/globals';


// 1️⃣ Mock modules
await jest.unstable_mockModule('../../config/cloudinary.js', () => ({
  default: {
    uploader: {
      upload: jest.fn().mockResolvedValue({ secure_url: 'http://fake.url/image.png' }),
      destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
    },
  },
}));

await jest.unstable_mockModule('../../models/entryModel.js', () => ({
  default: {
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    find: jest.fn(),
  },
}));

await jest.unstable_mockModule('../../models/updateEntryModel.js', () => ({
  default: { find: jest.fn(), findById: jest.fn() },
}));

await jest.unstable_mockModule('../../models/reminderModel.js', () => ({
  default: { find: jest.fn(), findByIdAndDelete: jest.fn() },
}));

// 2️⃣ Import after mocks
const cloudinary = (await import('../../config/cloudinary.js')).default;
const Entry = (await import('../../models/entryModel.js')).default;
const UpdateEntry = (await import('../../models/updateEntryModel.js')).default;
const Reminder = (await import('../../models/reminderModel.js')).default;

const {
  addEntry,
  editEntry,
  deleteImage,
  deleteEntry,
  getEntryById,
  getAllNames,
  getAllEntriesByUser,
  getEntriesForDate,
  getMarkedDates,
} = await import('../../Controllers/entryController.js');

// -------------------------
// 3️⃣ Helper for res mock
// -------------------------

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// -------------------------
// 4️⃣ Tests
// -------------------------

describe('Entry Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------- addEntry --------
  describe('addEntry', () => {
    it('should return 400 if name already exists', async () => {
      Entry.findOne.mockResolvedValue({ name: 'Test' });
      const req = { body: { name: 'Test', userId: 'u1' }, files: [] };
      const res = mockRes();

      await addEntry(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Name already exists. Please choose a different one.',
      });
    });

    it('should add a new entry successfully', async () => {
      Entry.findOne.mockResolvedValue(null);
      const save = jest.fn().mockResolvedValue(true);
const saveMock = jest.fn().mockResolvedValue(true);
Entry.prototype.save = saveMock;

      const req = {
        body: { name: 'Test', date: '2025-10-18', notes: 'Note', userId: 'u1' },
        files: [{ buffer: Buffer.from('x'), mimetype: 'image/png' }],
      };
      const res = mockRes();

      await addEntry(req, res);

      expect(cloudinary.uploader.upload).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Entry added successfully',
        entry: expect.any(Object),
      }));
    });
  });

  // -------- editEntry --------
  describe('editEntry', () => {
    it('should return 404 if entry not found', async () => {
      Entry.findById.mockResolvedValue(null);
      const req = { params: { entryId: '1' }, body: { userId: 'u1' } };
      const res = mockRes();

      await editEntry(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Entry not found' });
    });

    it('should return 403 if unauthorized', async () => {
      Entry.findById.mockResolvedValue({ userId: 'different' });
      const req = { params: { entryId: '1' }, body: { userId: 'u1' } };
      const res = mockRes();

      await editEntry(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });

    it('should update entry successfully', async () => {
      const save = jest.fn();
      Entry.findById.mockResolvedValue({ userId: 'u1', images: [], save });
      cloudinary.uploader.upload.mockResolvedValue({ secure_url: 'img' });

      const req = {
        params: { entryId: '1' },
        body: { userId: 'u1', date: '2025', name: 'A', notes: 'B', originalImages: '[]' },
        files: [{ buffer: Buffer.from('x'), mimetype: 'image/png' }],
      };
      const res = mockRes();

      await editEntry(req, res);

      expect(cloudinary.uploader.upload).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Entry updated successfully',
        entry: expect.any(Object),
      }));
    });
  });

  // -------- deleteImage --------
  describe('deleteImage', () => {
    it('should return 400 if missing data', async () => {
      const req = { body: {} };
      const res = mockRes();

      await deleteImage(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should delete image successfully', async () => {
      const save = jest.fn();
      Entry.findById.mockResolvedValue({ images: ['url1'], save });
      cloudinary.uploader.destroy.mockResolvedValue(true);

      const req = { body: { entryId: '1', imageUrl: 'url1' } };
      const res = mockRes();

      await deleteImage(req, res);
      expect(cloudinary.uploader.destroy).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // -------- getAllNames --------
  describe('getAllNames', () => {
    it('should fetch unique entry names', async () => {
      Entry.find.mockResolvedValue([
        { name: 'A', _id: '1' },
        { name: 'B', _id: '2' },
        { name: 'A', _id: '3' },
      ]);

      const req = { query: { userId: 'u1' } };
      const res = mockRes();

      await getAllNames(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { name: 'A', _id: '1' },
        { name: 'B', _id: '2' },
      ]);
    });
  });

  // -------- getEntryById --------
  describe('getEntryById', () => {
    it('should return 400 for invalid ID', async () => {
      const req = { params: { id: 'invalid' } };
      const res = mockRes();
      await getEntryById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  // -------- getAllEntriesByUser --------
  describe('getAllEntriesByUser', () => {
    it('should fetch entries for a user', async () => {
      Entry.find.mockResolvedValue([{ name: 'Test' }]);
      const req = { query: { userId: 'u1' } };
      const res = mockRes();
      await getAllEntriesByUser(req, res);
      expect(res.json).toHaveBeenCalledWith([{ name: 'Test' }]);
    });
  });

  // -------- getEntriesForDate & getMarkedDates --------
  describe('getEntriesForDate / getMarkedDates', () => {
    it('should fetch combined entries for a date', async () => {
      Entry.find.mockResolvedValue([{ date: '2025-10-18' }]);
      UpdateEntry.find.mockResolvedValue([]);
      Reminder.find.mockResolvedValue([]);
      const req = { query: { userId: 'u1', date: '2025-10-18' } };
      const res = mockRes();
      await getEntriesForDate(req, res);
      expect(res.json).toHaveBeenCalledWith({ entries: [{ date: '2025-10-18' }], updates: [], reminders: [] });
    });

    it('should fetch marked dates', async () => {
      Entry.find.mockResolvedValue([{ date: '2025-10-18' }]);
      UpdateEntry.find.mockResolvedValue([{ date: '2025-10-18' }]);
      Reminder.find.mockResolvedValue([{ date: '2025-10-18' }]);

      const req = { query: { userId: 'u1' } };
      const res = mockRes();

      await getMarkedDates(req, res);
      expect(res.json).toHaveBeenCalledWith({
        '2025-10-18': { icons: ['entry', 'update', 'reminder'] },
      });
    });
  });
});
