import express from 'express';
import express from 'express';
import cloudinary from 'cloudinary';

// Cloudinary config
cloudinary.config({
  cloud_name: 'dvagswjsf',
  api_key: '541989745898263',
  api_secret: 'ppzQEDXFiCcFdicfNYCupeZaRu0',
});


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
