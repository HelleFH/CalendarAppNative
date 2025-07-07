import express from 'express';
import {
  createReminder,
  getRemindersByDate,
  deleteReminder,
  getReminderDates,
  getRemindersByParent
} from '../controllers/reminderController.js';

const router = express.Router();

router.post('/reminders/create', createReminder);
router.get('/reminders', getRemindersByDate);
router.get('/reminders/dates', getReminderDates);
router.get('/reminders/by-parent', getRemindersByParent);
router.delete('/reminders/:id', deleteReminder);

export default router;
