import mongoose from 'mongoose';

const updateEntrySchema = new mongoose.Schema({
  parentObjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Entry' },
  notes: String,
  images: [String],
  date: String,
  userId: String,
}, {
  timestamps: true,
});


const UpdateEntry = mongoose.model('UpdateEntry', updateEntrySchema);

export default UpdateEntry;