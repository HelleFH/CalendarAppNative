import express from 'express';
import express from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';

// Cloudinary config
cloudinary.config({
  cloud_name: 'dvagswjsf',
  api_key: '541989745898263',
  api_secret: 'ppzQEDXFiCcFdicfNYCupeZaRu0',
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

import { upload } from '../utils/multerConfig.js';
import {
  updateEntry,
  deleteUpdateEntry,
  editUpdateEntry,
  getUpdateEntriesByDate,
  getUpdateEntryByParent,
  getUpdateEntryDates
} from '../controllers/updateEntryController.js';

const router = express.Router();

router.post('/update-entry', upload.any(), updateEntry);
router.delete('/delete-update-entry/:entryId', deleteUpdateEntry);
router.put('/edit-update-entry/:entryId', upload.array('images'), editUpdateEntry);
router.get('/update-entries', getUpdateEntriesByDate);
router.get('/update-entries/by-parent', getUpdateEntryByParent);
router.get('/update-entries/dates', getUpdateEntryDates);

export default router;
