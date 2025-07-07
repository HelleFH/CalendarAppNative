import express from 'express';
import { upload } from '../utils/multerConfig.js';
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
