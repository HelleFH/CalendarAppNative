import express from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';

import {
  addEntry,
  getEntryDatesByUser,
  getEntryByUserAndDate,
  getEntryById,
  getAllNames,
  deleteEntry,
  editEntry,
  getAllEntriesByUser,
} from '../Controllers/entryController.js';

import {
  updateEntry,
  deleteUpdateEntry,
  getUpdateEntriesByUserAndDate,
  getUpdatesByParent,
  editUpdateEntry,
  getUpdateEntryDatesByUser,
} from '../Controllers/updateEntryController.js';

import {
  createReminder,
  getRemindersByParent,
  getReminderDatesByUser,
  deleteReminder,
  getRemindersByUserAndDate,
} from '../Controllers/reminderController.js';

// Cloudinary config
cloudinary.config({
  cloud_name: 'dvagswjsf',
  api_key: '541989745898263',
  api_secret: 'ppzQEDXFiCcFdicfNYCupeZaRu0',
});

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

router.get('/update-entries/by-parent', getUpdatesByParent);
router.get('/by-parent/:id', getEntryById);

router.post('/reminders/create', createReminder);
router.get('/reminders/dates', getReminderDatesByUser);
router.delete('/reminders/:id', deleteReminder);
router.get('/reminders', getRemindersByUserAndDate);
router.get('/reminders/by-parent', getRemindersByParent);

router.delete('/delete-update-entry/:entryId', deleteUpdateEntry);
router.delete('/delete-entry/:entryId', deleteEntry);

router.post('/add-entry', upload.any(), addEntry);
router.post('/update-entry', upload.any(), updateEntry);

router.put('/edit-entry/:entryId', upload.array('images'), editEntry);
router.put('/edit-update-entry/:entryId', upload.array('images'), editUpdateEntry);

router.get('/all', getAllEntriesByUser);
router.get('/dates', getEntryDatesByUser);
router.get('/update-entries/dates', getUpdateEntryDatesByUser);

router.get('/', getEntryByUserAndDate);
router.get('/update-entries', getUpdateEntriesByUserAndDate);

router.get('/names', getAllNames);

export default router;
