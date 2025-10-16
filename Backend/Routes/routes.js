import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

import {
  addEntry,
  getEntriesForDate,
  getEntryById,
  getAllNames,
  deleteEntry,
  editEntry,
  getAllEntriesByUser,
  deleteImage,
  getMarkedDates,
} from '../Controllers/entryController.js';

import {
  updateEntry,
  deleteUpdateEntry,
  getUpdatesByParent,
  editUpdateEntry,

} from '../Controllers/updateEntryController.js';

import {
  createReminder,
  getRemindersByParent,
  deleteReminder,
} from '../Controllers/reminderController.js';



const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

router.get('/update-entries/by-parent', getUpdatesByParent);
router.get('/by-parent/:id', getEntryById);

router.post('/reminders/create', createReminder);
router.delete('/reminders/:id', deleteReminder);
router.get('/reminders/by-parent', getRemindersByParent);

router.delete('/delete-update-entry/:entryId', deleteUpdateEntry);
router.delete('/delete-entry/:entryId', deleteEntry);
router.delete('/entry/image', deleteImage);


router.post('/add-entry', upload.any(), addEntry);
router.post('/update-entry', upload.any(), updateEntry);

router.put('/edit-entry/:entryId', upload.array('images'), editEntry);
router.put('/edit-update-entry/:entryId', upload.array('images'), editUpdateEntry);

router.get('/all', getAllEntriesByUser);

router.get('/entries-for-date', getEntriesForDate);

router.get('/names', getAllNames);
router.get('/marked-dates', getMarkedDates);

export default router;
