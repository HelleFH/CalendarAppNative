import cloudinary from 'cloudinary';
import Entry from '../models/entryModel.js';
import UpdateEntry from '../models/updateEntryModel.js';
import multer from 'multer';
import streamifier from 'streamifier';
import Reminder from '../models/reminderModel.js';

// Cloudinary config
cloudinary.config({
  cloud_name: 'dvagswjsf',
  api_key: '541989745898263',
  api_secret: 'ppzQEDXFiCcFdicfNYCupeZaRu0',
});

const storage = multer.memoryStorage();
const upload = multer({ storage });
const addEntry = async (req, res) => {
  try {
    const { name, date, notes, userId } = req.body;

    // Check if an entry with the same name and userId already exists
    const existingEntry = await Entry.findOne({ name, userId });
    if (existingEntry) {
      return res.status(400).json({ message: 'Name already exists. Please choose a different one.' });
    }

    const imageUrls = [];

    if (req.files && req.files.length > 0) {
      const uploadToCloudinaryBase64 = async (file, index) => {
        const base64 = file.buffer.toString('base64');
        const dataUrl = `data:${file.mimetype};base64,${base64}`;
        const result = await cloudinary.uploader.upload(dataUrl, {
          resource_type: 'image',
        });
        return result.secure_url;
      };

      for (let i = 0; i < req.files.length; i++) {
        const imageUrl = await uploadToCloudinaryBase64(req.files[i], i);
        imageUrls.push(imageUrl);
      }
    }

    const newEntry = new Entry({
      date,
      name,
      notes,
      images: imageUrls,
      userId,
    });

    await newEntry.save();

    res.status(200).json({ message: 'Entry added successfully', entry: newEntry });
  } catch (err) {
    console.error('🚨 Error in addEntry:', err);
    res.status(500).json({ error: 'Something went wrong in addEntry' });
  }
};

const editEntry = async (req, res) => {
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

    // Parse original images
    let mergedImages = [];
    if (originalImages) {
      try {
        const parsed = JSON.parse(originalImages);
        if (Array.isArray(parsed)) {
          mergedImages = parsed;
        }
      } catch {
        // ignore parse errors, mergedImages remains []
      }
    }

    // Upload new images
    const newImageUrls = [];
    for (const file of req.files || []) {
      const base64 = file.buffer.toString('base64');
      const dataUrl = `data:${file.mimetype};base64,${base64}`;

      const result = await cloudinary.uploader.upload(dataUrl, {
        resource_type: 'image',
      });

      newImageUrls.push(result.secure_url);
    }

    // Merge images
    existingEntry.images = [...mergedImages, ...newImageUrls];

    await existingEntry.save();

    res.status(200).json({ message: 'Entry updated successfully', entry: existingEntry });
  } catch (error) {
    console.error('Error editing entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getAllNames = async (req, res) => {
  try {
    const { userId } = req.query;
    const entries = await Entry.find({ userId }, 'name _id');
    const uniqueEntries = Array.from(new Map(entries.map(entry => [entry.name, entry])).values());
    res.status(200).json(uniqueEntries);
  } catch (err) {
    console.error('Failed to fetch names:', err);
    res.status(500).json({ error: 'Failed to fetch names' });
  }
};

const deleteEntry = async (req, res) => {
  console.log('🚀 deleteEntry route HIT');

  try {
    const { entryId } = req.params;
    console.log('Trying to delete entry with entryId:', entryId);

    if (!entryId) {
      return res.status(400).json({ message: 'No entry ID provided' });
    }

    const entry = await Entry.findById(entryId);
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // 🖼️ Delete entry images from Cloudinary
    if (entry.images?.length > 0) {
      await Promise.all(entry.images.map(async (image) => {
        const publicId = image.split('/').pop().split('.')[0];
        try {
          await cloudinary.uploader.destroy(publicId);
          console.log(`✅ Deleted entry image: ${publicId}`);
        } catch (err) {
          console.error(`❌ Failed to delete entry image: ${publicId}`, err);
        }
      }));
    }

    // 🔄 Delete related update entries
    const updateEntries = await UpdateEntry.find({ parentObjectId: entryId });
    console.log(`🔎 Found ${updateEntries.length} update entries for parentObjectId: ${entryId}`);

    await Promise.all(updateEntries.map(async (updateEntry) => {
      if (updateEntry.images?.length > 0) {
        await Promise.all(updateEntry.images.map(async (image) => {
          const publicId = image.split('/').pop().split('.')[0];
          try {
            await cloudinary.uploader.destroy(publicId);
            console.log(`✅ Deleted update entry image: ${publicId}`);
          } catch (err) {
            console.error(`❌ Failed to delete update entry image: ${publicId}`, err);
          }
        }));
      }

      await UpdateEntry.findByIdAndDelete(updateEntry._id);
      console.log(`✅ Deleted update entry with ID: ${updateEntry._id}`);
    }));

    // 🔔 Delete related reminders
    const reminders = await Reminder.find({ parentObjectId: entryId });
    console.log(`🔎 Found ${reminders.length} reminders for parentObjectId: ${entryId}`);

    await Promise.all(reminders.map(async (reminder) => {
      await Reminder.findByIdAndDelete(reminder._id);
      console.log(`✅ Deleted reminder with ID: ${reminder._id}`);
    }));

    // 🗑️ Delete the main entry
    await Entry.findByIdAndDelete(entryId);
    console.log('✅ Entry deleted from database.');

    res.status(200).json({ message: 'Entry and related data deleted successfully' });

  } catch (err) {
    console.error('Error in deleteEntry:', err);
    res.status(500).json({ error: 'Something went wrong in deleteEntry' });
  }
};


const getEntryById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    const objectId = new mongoose.Types.ObjectId(id);
    const entry = await Entry.findOne({ _id: objectId });

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.json({ entry });
  } catch (err) {
    console.error('Error fetching entry:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
};
const getAllEntriesByUser = async (req, res) => {
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
};

const editUpdateEntry = async (req, res) => {
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

    let mergedImages = [];
    if (originalImages) {
      try {
        const parsed = JSON.parse(originalImages);
        if (Array.isArray(parsed)) {
          mergedImages = parsed;
        }
      } catch {
        // Ignore JSON parse error
      }
    }

    const newImageUrls = [];
    for (const file of req.files || []) {
      const base64 = file.buffer.toString('base64');
      const dataUrl = `data:${file.mimetype};base64,${base64}`;

      const result = await cloudinary.uploader.upload(dataUrl, {
        resource_type: 'image',
      });

      newImageUrls.push(result.secure_url);
    }

    existingUpdateEntry.images = [...mergedImages, ...newImageUrls];

    await existingUpdateEntry.save();

    res.status(200).json({ message: 'Update entry updated!', entry: existingUpdateEntry });
  } catch (error) {
    console.error('Error editing update entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getEntryDatesByUser = async (req, res) => {
  const { userId } = req.query;

  try {
    const entries = await Entry.find({ userId });
    console.log('Entries found:', entries);

    const dates = entries.map(entry => entry.date);
    res.json(dates);
  } catch (err) {
    console.error('Error fetching entry dates:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const getEntryByUserAndDate = async (req, res) => {
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
};
export { addEntry, getAllNames, deleteEntry, getEntryById, editEntry,getAllEntriesByUser,editUpdateEntry,getEntryDatesByUser, getEntryByUserAndDate };
