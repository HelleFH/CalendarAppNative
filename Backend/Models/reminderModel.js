import mongoose from 'mongoose';


const reminderSchema = new mongoose.Schema({
  parentObjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Entry' },
  notes: String,
  date: String,
  userId: String,
}, {
  timestamps: true,
});



const Reminder = mongoose.model('Reminder', reminderSchema);

export default Reminder;
