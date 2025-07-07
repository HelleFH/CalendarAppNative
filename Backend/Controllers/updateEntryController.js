import streamifier from 'streamifier';
import cloudinary from 'cloudinary';
import UpdateEntry from '../models/updateEntryModel.js';
import Entry from '../models/entryModel.js'; // ✅ Fix incorrect import

// Cloudinary config
cloudinary.config({
  cloud_name: 'dvagswjsf',
  api_key: '541989745898263',
  api_secret: 'ppzQEDXFiCcFdicfNYCupeZaRu0',
});


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



const editUpdateEntry = async (req, res) => {
  try {
    const { entryId } = req.params;
    const { date, notes, userId } = req.body;

    const existingUpdateEntry = await UpdateEntry.findById(entryId);
    if (!existingUpdateEntry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Optional: check userId matches for security
    if (existingUpdateEntry.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update fields
    existingUpdateEntry.date = date;
    existingUpdateEntry.notes = notes;

    // Handle new images if any were uploaded
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map(file => file.path); // or `file.filename` depending on setup
      existingUpdateEntry.images = imagePaths;
    }

    await existingUpdateEntry.save();

    res.status(200).json({ message: 'Entry updated successfully', entry: existingUpdateEntry });
  } catch (error) {
    console.error('Error editing entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




const updateEntry = async (req, res) => {
  try {
    const imageUrls = [];

    console.log('✅ Received POST /update-entry');
    console.log('➡️ req.body:', req.body);
    console.log('📦 req.files length:', req.files?.length);

    const { parentObjectId, notes, date, userId, createdAt } = req.body;

    if (!parentObjectId || !notes || !date || !userId) {
      return res.status(400).json({ message: 'Missing required fields for update' });
    }

    // 🧩 Fetch original entry for name
    const parentEntry = await Entry.findById(parentObjectId);
    if (!parentEntry) {
      return res.status(404).json({ message: 'Parent entry not found' });
    }
    const uploadToCloudinaryBase64 = async (file, index) => {
      const base64 = file.buffer.toString('base64');
      const dataUrl = `data:${file.mimetype};base64,${base64}`;
    
      try {
        const result = await cloudinary.uploader.upload(dataUrl, {
          resource_type: 'image',
        });
        console.log(`✅ Cloudinary upload ${index} success: ${result.secure_url}`);
        return result.secure_url;
      } catch (err) {
        console.error(`❌ Cloudinary upload ${index} failed:`, err);
        throw err;
      }
    };

    
    for (let i = 0; i < req.files.length; i++) {
      const imageUrl = await uploadToCloudinaryBase64(req.files[i], i);
      imageUrls.push(imageUrl);
    }
    
    

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

    res.status(200).json({ message: 'Update entry added successfully', updateEntry: newUpdateEntry });
  } catch (err) {
    console.error('🚨 Error in updateEntry:', err);
    res.status(500).json({ error: 'Something went wrong in updateEntry' });
  }
};
export const getUpdatesByParent = async (req, res) => {
  const { parentObjectId } = req.query;

  if (!parentObjectId) {
    return res.status(400).json({ message: 'Missing parentObjectId' });
  }

  if (!mongoose.Types.ObjectId.isValid(parentObjectId)) {
    return res.status(400).json({ message: 'Invalid parentObjectId format' });
  }

  try {
    const updates = await UpdateEntry.find({ parentObjectId });
    if (updates.length === 0) {
      return res.status(404).json({ message: 'No update entries found' });
    }
    res.json(updates);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getUpdateEntriesByUserAndDate = async (req, res) => {
  const { userId, date } = req.query;

  if (!userId || !date) {
    return res.status(400).json({ message: 'Missing userId or date' });
  }

  try {
    const updates = await UpdateEntry.find({ userId, date });
    if (updates.length === 0) {
      return res.status(404).json({ message: 'No update entries found' });
    }
    res.json(updates);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getUpdateEntryDates = async (req, res) => {
  const { userId } = req.query;
  try {
    const entries = await UpdateEntry.find({ userId });
    const dates = entries.map(entry => entry.date);
    res.json(dates);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const editUpdateEntryHandler = async (req, res) => {
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
      const parsed = JSON.parse(originalImages);
      if (Array.isArray(parsed)) mergedImages = parsed;
    }

    const newImageUrls = [];
    for (const file of req.files || []) {
      const base64 = file.buffer.toString('base64');
      const dataUrl = `data:${file.mimetype};base64,${base64}`;
      const result = await cloudinary.uploader.upload(dataUrl, { resource_type: 'image' });
      newImageUrls.push(result.secure_url);
    }

    existingUpdateEntry.images = [...mergedImages, ...newImageUrls];
    await existingUpdateEntry.save();

    res.status(200).json({ message: 'Update entry updated!', entry: existingUpdateEntry });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
export { updateEntry, deleteUpdateEntry, editUpdateEntry,editUpdateEntryHandler, getUpdatesByParent, getUpdateEntryDates,getUpdateEntriesByUserAndDate };