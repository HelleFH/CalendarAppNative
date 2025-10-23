import mongoose from 'mongoose';
import UpdateEntry from '../models/updateEntryModel.js';
import Entry from '../models/entryModel.js'; 
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';


const deleteUpdateEntry = async (req, res) => {
  try {
    const { entryId } = req.params;
    
    if (!entryId) {
      return res.status(400).json({ message: 'No entry ID provided' });
    }

    console.log(`Trying to delete update entry with entryId: ${entryId}`);

    // First, find the entry by ID
    const updateEntry = await UpdateEntry.findById(entryId);
    
    if (!updateEntry) {
      return res.status(404).json({ message: 'Update entry not found' });
    }

    // If the entry exists, delete the associated image from Cloudinary
    if (updateEntry.images && updateEntry.images.length > 0) {
      updateEntry.images.forEach(async (image) => {
        const publicId = image.split('/').pop().split('.')[0]; // Extract the public ID from the image URL
        try {
          await cloudinary.uploader.destroy(publicId); // Remove from Cloudinary
          console.log(`✅ Image with public ID ${publicId} removed from Cloudinary`);
        } catch (err) {
          console.error(`❌ Error removing image from Cloudinary:`, err);
        }
      });
    }

    // Now, delete the update entry from the database
    await UpdateEntry.findByIdAndDelete(entryId);  // Correct method for deleting the entry
    console.log('✅ Update entry deleted from database.');

    // Send success response
    res.status(200).json({ message: 'Update entry deleted successfully' });
  } catch (err) {
    console.error('🚨 Error in deleteUpdateEntry:', err);
    res.status(500).json({ error: 'Something went wrong in deleteUpdateEntry' });
  }
};

const getUpdatesByParent = async (req, res) => {
  const { parentObjectId } = req.query;

  if (!parentObjectId) {
    return res.status(400).json({ message: 'Missing parentObjectId' });
  }

  if (!mongoose.Types.ObjectId.isValid(parentObjectId)) {
    return res.status(400).json({ message: 'Invalid parentObjectId format' });
  }

  try {
    console.log('Fetching updates for:', parentObjectId);
    const updates = await UpdateEntry.find({ parentObjectId });
    console.log('Updates found:', updates.length);

    if (updates.length === 0) {
      return res.status(404).json({ message: 'No update entries found for this parentObjectId' });
    }

    res.json(updates);
  } catch (err) {
    console.error('Error fetching update entries:', err);
    res.status(500).json({ message: 'Server error while fetching update entries', error: err.message });
  }
};

const updateEntry = async (req, res) => {
  try {
    console.log('✅ Received POST /update-entry');
    console.log('➡️ req.body:', req.body);
    console.log('📦 req.files:', req.files);

    const { parentObjectId, notes, date, userId } = req.body;

    // Validate required fields
    if (!parentObjectId || !notes || !date || !userId) {
      return res.status(400).json({ message: 'Missing required fields for update' });
    }

    // Fetch the parent entry to preserve name or other info if needed
    const parentEntry = await Entry.findById(parentObjectId);
    if (!parentEntry) {
      return res.status(404).json({ message: 'Parent entry not found' });
    }

    // Function to upload a file buffer to Cloudinary using streams
    const uploadToCloudinary = (file, index) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (err, result) => {
            if (err) {
              console.error(`❌ Cloudinary upload ${index} failed:`, err);
              reject(err);
            } else {
              console.log(`✅ Cloudinary upload ${index} success: ${result.secure_url}`);
              resolve(result.secure_url);
            }
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });

    // Upload images if any
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      console.log(`📤 Uploading ${req.files.length} images to Cloudinary...`);
      for (let i = 0; i < req.files.length; i++) {
        const url = await uploadToCloudinary(req.files[i], i);
        imageUrls.push(url);
      }
    }

    // Create new UpdateEntry document
    const newUpdateEntry = new UpdateEntry({
      parentObjectId,
      notes,
      date,
      images: imageUrls,
      userId,
    });

    console.log('📄 Saving update entry to MongoDB...');
    await newUpdateEntry.save();
    console.log('✅ Update entry saved.');

    res.status(200).json({
      message: 'Update entry added successfully',
      updateEntry: newUpdateEntry,
    });
  } catch (err) {
    console.error('🚨 Error in updateEntry:', err);
    res.status(500).json({ error: 'Something went wrong in updateEntry' });
  }
};


const getUpdateEntryDatesByUser = async (req, res) => {
  const { userId } = req.query;

  try {
    const entries = await UpdateEntry.find({ userId });
    const dates = entries.map(entry => entry.date);
    res.json(dates);
  } catch (err) {
    console.error('Error fetching update entry dates:', err);
    res.status(500).json({ message: 'Server error' });
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

export { updateEntry, deleteUpdateEntry, editUpdateEntry,getUpdatesByParent,getUpdateEntryDatesByUser };