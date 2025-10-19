// test/unit/reminderController.test.js
import { jest } from '@jest/globals';
import mongoose from 'mongoose';

// -------------------------
// 1️⃣ Mock the Reminder model
// -------------------------
await jest.unstable_mockModule('../../models/reminderModel.js', () => ({
  default: {
    find: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

const Reminder = (await import('../../models/reminderModel.js')).default;

// -------------------------
// 2️⃣ Import the controller
// -------------------------
const {
  getRemindersByParent,
  createReminder,
  getRemindersByDate,
  deleteReminder,
} = await import('../../Controllers/reminderController.js');

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
describe('Reminder Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------- getRemindersByParent --------
  describe('getRemindersByParent', () => {
    it('should return 400 if parentObjectId is missing', async () => {
      const req = { query: {} };
      const res = mockRes();

      await getRemindersByParent(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing parentObjectId' });
    });

    it('should return 400 if parentObjectId is invalid', async () => {
      const req = { query: { parentObjectId: 'invalid' } };
      const res = mockRes();

      await getRemindersByParent(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid parentObjectId format' });
    });

    it('should return reminders for valid parentObjectId', async () => {
      const reminders = [{ _id: '1' }];
      Reminder.find.mockResolvedValue(reminders);

      const req = { query: { parentObjectId: new mongoose.Types.ObjectId().toString() } };
      const res = mockRes();

      await getRemindersByParent(req, res);
      expect(Reminder.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(reminders);
    });
  });

  // -------- createReminder --------
  describe('createReminder', () => {
    it('should return 400 if missing required fields', async () => {
      const req = { body: {} };
      const res = mockRes();

      await createReminder(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
    });

    it('should create a reminder successfully', async () => {
      const save = jest.fn().mockResolvedValue(true);
      const mockNewReminder = { save, userId: 'u1', parentObjectId: 'p1', date: '2025-10-18', notes: 'Note' };
      jest.spyOn(Reminder.prototype, 'constructor').mockImplementation(() => mockNewReminder);

      const req = {
        body: { userId: 'u1', parentObjectId: new mongoose.Types.ObjectId().toString(), date: '2025-10-18', notes: 'Note' },
      };
      const res = mockRes();

      await createReminder(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Reminder created',
        reminder: expect.any(Object),
      });
    });
  });

  // -------- getRemindersByDate --------
  describe('getRemindersByDate', () => {
    it('should return 400 if missing userId or date', async () => {
      const req = { query: {} };
      const res = mockRes();

      await getRemindersByDate(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing userId or date' });
    });

    it('should fetch reminders successfully', async () => {
      const reminders = [{ _id: '1', date: '2025-10-18' }];
      Reminder.find.mockResolvedValue(reminders);

      const req = { query: { userId: 'u1', date: '2025-10-18' } };
      const res = mockRes();

      await getRemindersByDate(req, res);
      expect(Reminder.find).toHaveBeenCalledWith({ userId: 'u1', date: '2025-10-18' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(reminders);
    });
  });

  // -------- deleteReminder --------
  describe('deleteReminder', () => {
    it('should return 404 if reminder not found', async () => {
      Reminder.findByIdAndDelete.mockResolvedValue(null);
      const req = { params: { id: '1' } };
      const res = mockRes();

      await deleteReminder(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Reminder not found' });
    });

    it('should delete reminder successfully', async () => {
      Reminder.findByIdAndDelete.mockResolvedValue({ _id: '1' });
      const req = { params: { id: '1' } };
      const res = mockRes();

      await deleteReminder(req, res);
      expect(Reminder.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Reminder deleted' });
    });
  });
});
