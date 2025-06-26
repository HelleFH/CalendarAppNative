import cloudinary from 'cloudinary';
import Entry from '../models/entryModel.js';
import multer from 'multer';
import streamifier from 'streamifier';

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
    const imageUrls = [];

    console.log('✅ Received POST /add-entry');
    console.log('➡️ req.body:', req.body);
    console.log('📦 req.files length:', req.files?.length);

    if (!req.files || req.files.length === 0) {
      console.warn('⚠️ No files uploaded.');
    } else {
      req.files.forEach((file, index) => {
        console.log(`🔍 File[${index}] - originalname: ${file.originalname}`);
        console.log(`        mimetype: ${file.mimetype}`);
        console.log(`        size: ${file.size}`);
        console.log(`        buffer type: ${typeof file.buffer}`);
        console.log(`        isBuffer: ${Buffer.isBuffer(file.buffer)}`);
      });
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
    
    const newEntry = new Entry({
      date: req.body.date,
      name: req.body.name,
      notes: req.body.notes,
      images: imageUrls,
      userId: req.body.userId,
    });

    console.log('📄 Saving entry to MongoDB...');
    await newEntry.save();
    console.log('✅ Entry saved.');

    res.status(200).json({ message: 'Entry added successfully', entry: newEntry });
  } catch (err) {
    console.error('🚨 Error in addEntry:', err);
    res.status(500).json({ error: 'Something went wrong in addEntry' });
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

export { addEntry, getAllNames };
