import express from 'express';
import multer from 'multer';
import { addEntry, getAllNames, deleteEntry, editEntry } from '../Controllers/entryController.js';
import cloudinary from 'cloudinary';

// Cloudinary config
cloudinary.config({
  cloud_name: 'dvagswjsf',
  api_key: '541989745898263',
  api_secret: 'ppzQEDXFiCcFdicfNYCupeZaRu0',
});

const storage = multer.memoryStorage();
const upload = multer({ storage });


import {
  addEntry,
  getAllEntries,
  getEntryByDate,
  getEntryById,
  getEntryDates,
  editEntry,
  deleteEntry,
  getAllNames
} from '../Controllers/entryController.js';

const router = express.Router();

router.post('/add-entry', upload.any(), addEntry);
router.get('/all', getAllEntries);
router.get('/dates', getEntryDates);
router.get('/by-parent/:id', getEntryById);
router.get('/', getEntryByDate);
router.put('/edit-entry/:entryId', upload.array('images'), editEntry);
router.delete('/delete-entry/:entryId', deleteEntry);
router.get('/names', getAllNames);

export default router;
