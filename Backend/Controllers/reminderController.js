import mongoose from 'mongoose';
import Reminder from "../models/reminderModel.js";


export const createReminder = async (req, res) => {
  const { userId, parentObjectId, date, notes } = req.body;

  console.log('Incoming reminder data:', { userId, parentObjectId, date, notes });

  if (!userId || !parentObjectId || !date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
console.log('Raw req.body:', req.body);

  try {
    const newReminder = new Reminder({
      userId,
      parentObjectId: new mongoose.Types.ObjectId(parentObjectId),
      date,
      notes,
    });

    await newReminder.save();
    return res.status(201).json({ message: 'Reminder created', reminder: newReminder });
  } catch (err) {
    console.error('Error creating reminder:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getRemindersByDate = async (req, res) => {
  const { userId, date } = req.query;

  if (!userId || !date) {
    return res.status(400).json({ message: 'Missing userId or date' });
  }

  try {
    const reminders = await Reminder.find({ userId, date });
    res.status(200).json(reminders);
  } catch (err) {
    console.error('Error fetching reminders:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteReminder = async (req, res) => {
  const { id } = req.params;

  try {
    const reminder = await Reminder.findByIdAndDelete(id);
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    res.status(200).json({ message: 'Reminder deleted' });
  } catch (err) {
    console.error('Error deleting reminder:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
