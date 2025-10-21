import Entry from '../models/entryModel.js';
import UpdateEntry from '../models/updateEntryModel.js';
import multer from 'multer';
import streamifier from 'streamifier';
import Reminder from '../models/reminderModel.js';
import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary.js';

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
    console.error(' Error in addEntry:', err);
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

 const deleteImage = async (req, res) => {
  console.log('🚀 deleteImage route HIT');

  try {
    const { entryId, imageUrl } = req.body;

    if (!entryId || !imageUrl) {
      return res.status(400).json({ message: 'Entry ID and image URL are required' });
    }

    // 🪴 Find the entry
    const entry = await Entry.findById(entryId);
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // ✅ Check if image exists in entry
    if (!entry.images.includes(imageUrl)) {
      return res.status(404).json({ message: 'Image not found in this entry' });
    }

    // 🖼️ Extract Cloudinary public ID from image URL
    const publicId = imageUrl.split('/').pop().split('.')[0];
    console.log(`🧩 Extracted publicId: ${publicId}`);

    //  Delete image from Cloudinary
    try {
      await cloudinary.uploader.destroy(publicId);
      console.log(`✅ Deleted image from Cloudinary: ${publicId}`);
    } catch (err) {
      console.error(` Failed to delete image from Cloudinary: ${publicId}`, err);
      return res.status(500).json({ message: 'Failed to delete image from Cloudinary' });
    }

    // 🧹 Remove image from entry in MongoDB
    entry.images = entry.images.filter((url) => url !== imageUrl);
    await entry.save();

    console.log(`✅ Image removed from entry ${entryId}`);
    res.status(200).json({
      message: 'Image deleted successfully',
      images: entry.images,
    });
  } catch (err) {
    console.error(' Error in deleteImage:', err);
    res.status(500).json({ error: 'Something went wrong while deleting image' });
  }
};

const deleteEntry = async (req, res) => {
  console.log(' deleteEntry route HIT');

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
          console.error(`Failed to delete entry image: ${publicId}`, err);
        }
      }));
    }

    // 🔄 Delete related update entries
    const updateEntries = await UpdateEntry.find({ parentObjectId: entryId });
    console.log(`Found ${updateEntries.length} update entries for parentObjectId: ${entryId}`);

    await Promise.all(updateEntries.map(async (updateEntry) => {
      if (updateEntry.images?.length > 0) {
        await Promise.all(updateEntry.images.map(async (image) => {
          const publicId = image.split('/').pop().split('.')[0];
          try {
            await cloudinary.uploader.destroy(publicId);
            console.log(`✅ Deleted update entry image: ${publicId}`);
          } catch (err) {
            console.error(`Failed to delete update entry image: ${publicId}`, err);
          }
        }));
      }

      await UpdateEntry.findByIdAndDelete(updateEntry._id);
      console.log(`✅ Deleted update entry with ID: ${updateEntry._id}`);
    }));

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


const getEntriesForDate = async (req, res) => {
  const { userId, date } = req.query;
  console.log(' /entries-for-date called', { userId, date });

  if (!userId || !date) {
    console.warn('Missing userId or date');
    return res.status(400).json({ message: 'Missing userId or date' });
  }

  try {
    const [entries, updates, reminders] = await Promise.all([
      Entry.find({ userId, date }),
      UpdateEntry.find({ userId, date }),
      Reminder.find({ userId, date }),
    ]);

    console.log('✅ Data fetched', {
      entriesCount: entries.length,
      updatesCount: updates.length,
      remindersCount: reminders.length,
    });

    res.json({ entries, updates, reminders });
  } catch (err) {
    console.error('Error fetching combined entries:', err);
    res.status(500).json({ message: 'Server error while fetching combined entries' });
  }
};

const getMarkedDates = async (req, res) => {
  const { userId } = req.query;
  console.log('🚀 GET /marked-dates called with:', { userId });

  if (!userId) {
    console.warn('Missing userId');
    return res.status(400).json({ message: 'Missing userId' });
  }

  try {
    const [entries, updates, reminders] = await Promise.all([
      Entry.find({ userId }),
      UpdateEntry.find({ userId }),
      Reminder.find({ userId }),
    ]);

    const markedDates = {};

    entries.forEach(e => {
      if (!markedDates[e.date]) markedDates[e.date] = { icons: [] };
      if (!markedDates[e.date].icons.includes('entry')) markedDates[e.date].icons.push('entry');
    });

    updates.forEach(u => {
      if (!markedDates[u.date]) markedDates[u.date] = { icons: [] };
      if (!markedDates[u.date].icons.includes('update')) markedDates[u.date].icons.push('update');
    });

    reminders.forEach(r => {
      if (!markedDates[r.date]) markedDates[r.date] = { icons: [] };
      if (!markedDates[r.date].icons.includes('reminder')) markedDates[r.date].icons.push('reminder');
    });

    console.log('Marked dates calculated:', markedDates);

    res.json(markedDates);
  } catch (err) {
    console.error('Error fetching marked dates:', err);
    res.status(500).json({ message: 'Server error while fetching marked dates' });
  }
};

export { getEntriesForDate, getMarkedDates, addEntry, getAllNames, deleteEntry, getEntryById, editEntry,getAllEntriesByUser,getEntryDatesByUser, deleteImage };
