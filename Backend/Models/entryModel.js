import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
  name: String,
  notes: String,
  images: [String],
  date: String,
  userId: String
});

const Entry = mongoose.model('Entry', entrySchema);

export default Entry;  // ES Module export
