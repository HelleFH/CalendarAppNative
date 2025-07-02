import express from 'express';
import multer from 'multer';
import { addEntry, getAllNames, deleteEntry, editEntry } from '../Controllers/entryController.js';
import Entry from '../models/entryModel.js';
import { updateEntry, deleteUpdateEntry, editUpdateEntry } from '../Controllers/updateEntryController.js';
import UpdateEntry from '../models/updateEntryModel.js';
import Reminder from '../models/reminderModel.js';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import { createReminder, getRemindersByDate, deleteReminder } from '../Controllers/reminderController.js';

// Cloudinary config
cloudinary.config({
  cloud_name: 'dvagswjsf',
  api_key: '541989745898263',
  api_secret: 'ppzQEDXFiCcFdicfNYCupeZaRu0',
});

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

import mongoose from 'mongoose';

router.get('/by-parent/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
const entry = await Entry.findOne({ _id: mongoose.Types.ObjectId(id) });
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.json({ entry });
  } catch (err) {
    console.error('Error fetching entry:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/reminders/create', createReminder);

router.get('/reminders/dates', async (req, res) => {
  const { userId } = req.query;
  try {
    const reminders = await Reminder.find({ userId });
    const dates = reminders.map(reminder => reminder.date);
    res.json(dates);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/reminders/:id', deleteReminder);

router.delete('/delete-update-entry/:entryId', deleteUpdateEntry);
router.delete('/delete-entry/:entryId', deleteEntry);


// POST /entries/add-entry
router.post('/add-entry', upload.any(), addEntry);
router.post('/update-entry', upload.any(), updateEntry);
router.put('/edit-entry/:entryId', upload.array('images'), async (req, res) => {
  const { entryId } = req.params;
  const { date, name, notes, userId, originalImages } = req.body;

  try {
    const existingEntry = await Entry.findById(entryId);
    if (!existingEntry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    if (existingEntry.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    existingEntry.date = date;
    existingEntry.name = name;
    existingEntry.notes = notes;

    // Parse original images from frontend
    let mergedImages = [];
    if (originalImages) {
      const parsed = JSON.parse(originalImages);
      if (Array.isArray(parsed)) {
        mergedImages = parsed;
      }
    }

    // Upload new images to Cloudinary and collect URLs
    const newImageUrls = [];
    for (let i = 0; i < (req.files || []).length; i++) {
      const file = req.files[i];
      const base64 = file.buffer.toString('base64');
      const dataUrl = `data:${file.mimetype};base64,${base64}`;

      const result = await cloudinary.uploader.upload(dataUrl, {
        resource_type: 'image',
      });

      newImageUrls.push(result.secure_url);
    }

    // Merge old and new images
    existingEntry.images = [...mergedImages, ...newImageUrls];

    await existingEntry.save();

    res.status(200).json({ message: 'Entry updated successfully', entry: existingEntry });
  } catch (error) {
    console.error('Error editing entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/all', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'Missing userId' });
  }

  try {
    const entries = await Entry.find({ userId });
    res.json(entries);
  } catch (err) {
    console.error('Error fetching all entries:', err);
    res.status(500).json({ message: 'Server error while fetching entries' });
  }
});



router.put('/edit-update-entry/:entryId', upload.array('images'), async (req, res) => {
  const { entryId } = req.params;
  const { date, notes, userId, originalImages } = req.body;

  try {
    const existingUpdateEntry = await UpdateEntry.findById(entryId);
    if (!existingUpdateEntry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    if (existingUpdateEntry.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    existingUpdateEntry.date = date;
    existingUpdateEntry.notes = notes;

    // Handle original images
    let mergedImages = [];
    if (originalImages) {
      const parsed = JSON.parse(originalImages);
      if (Array.isArray(parsed)) {
        mergedImages = parsed;
      }
    }

    // Handle new uploads to Cloudinary
    const newImageUrls = [];
    for (const file of req.files || []) {
      const base64 = file.buffer.toString('base64');
      const dataUrl = `data:${file.mimetype};base64,${base64}`;
      const result = await cloudinary.uploader.upload(dataUrl, {
        resource_type: 'image',
      });
      newImageUrls.push(result.secure_url);
    }

    // Merge old + new
    existingUpdateEntry.images = [...mergedImages, ...newImageUrls];

    await existingUpdateEntry.save();

    res.status(200).json({ message: 'Update entry updated!', entry: existingUpdateEntry });
  } catch (error) {
    console.error('Error editing update entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




router.get('/dates', async (req, res) => {
  const { userId } = req.query;
  try {
    const entries = await Entry.find({ userId });
    console.log('Entries found:', entries);

    const dates = entries.map(entry => entry.date);
    res.json(dates);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/update-entries/dates', async (req, res) => {
  const { userId } = req.query;
  try {
    const entries = await UpdateEntry.find({ userId });
    const dates = entries.map(entry => entry.date);
    res.json(dates);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/', async (req, res) => {
  const { userId, date } = req.query;
  console.log('Received GET /entries with:', req.query);

  if (!userId || !date) {
    return res.status(400).json({ message: 'Missing userId or date' });
  }

  try {
    const entry = await Entry.findOne({ userId, date });

    if (!entry) {
      return res.status(404).json({ message: 'No entry found for this user and date' });
    }

    res.json(entry);
  } catch (err) {
    console.error('Error fetching entry:', err);
    res.status(500).json({ message: 'Server error while fetching entry' });
  }
});


router.get('/update-entries', async (req, res) => {
  const { userId, date } = req.query;

  if (!userId || !date) {
    return res.status(400).json({ message: 'Missing userId or date' });
  }

  try {
    // Find all update entries for a specific user and date
    const updates = await UpdateEntry.find({ userId, date });

    if (updates.length === 0) {
      return res.status(404).json({ message: 'No update entries found for this user and date' });
    }

    // If updates are found, return them (include name and images)
    res.json(updates);
  } catch (err) {
    console.error('Error fetching update entries:', err);
    res.status(500).json({ message: 'Server error while fetching update entries' });
  }
});

router.get('/reminders', async (req, res) => {
  const { userId, date } = req.query;

  if (!userId || !date) {
    return res.status(400).json({ message: 'Missing userId or date' });
  }

  try {
    // Find all update entries for a specific user and date
    const reminders = await Reminder.find({ userId, date });

    if (reminders.length === 0) {
      return res.status(404).json({ message: 'No update entries found for this user and date' });
    }

    // If updates are found, return them (include name and images)
    res.json(reminders);
  } catch (err) {
    console.error('Error fetching update entries:', err);
    res.status(500).json({ message: 'Server error while fetching update entries' });
  }
});

router.get('/update-entries/by-parent', async (req, res) => {
  const { parentObjectId } = req.query;

  if (!parentObjectId) {
    return res.status(400).json({ message: 'Missing parentObjectId' });
  }

  try {
    const updates = await UpdateEntry.find({ parentObjectId });

    if (updates.length === 0) {
      return res.status(404).json({ message: 'No update entries found for this parentObjectId' });
    }

    res.json(updates);
  } catch (err) {
    console.error('Error fetching update entries by parentObjectId:', err);
    res.status(500).json({ message: 'Server error while fetching update entries' });
  }
});


router.get('/names', getAllNames);



export default router;