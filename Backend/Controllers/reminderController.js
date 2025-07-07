import mongoose from 'mongoose';
import Reminder from "../models/reminderModel.js";

const createReminder = async (req, res) => {
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

const getRemindersByDate = async (req, res) => {
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

const deleteReminder = async (req, res) => {
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

const getRemindersByUserAndDate = async (req, res) => {
  const { userId, date } = req.query;

  if (!userId || !date) {
    return res.status(400).json({ message: 'Missing userId or date' });
  }

  try {
    const reminders = await Reminder.find({ userId, date });
    if (reminders.length === 0) {
      return res.status(404).json({ message: 'No reminders found for this user and date' });
    }
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getReminderDates = async (req, res) => {
  const { userId } = req.query;
  try {
    const reminders = await Reminder.find({ userId });
    const dates = reminders.map(reminder => reminder.date);
    res.json(dates);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getRemindersByParent = async (req, res) => {
  const { parentObjectId } = req.query;

  if (!parentObjectId) {
    return res.status(400).json({ message: 'Missing parentObjectId' });
  }

  if (!mongoose.Types.ObjectId.isValid(parentObjectId)) {
    return res.status(400).json({ message: 'Invalid parentObjectId format' });
  }

  try {
    const reminders = await Reminder.find({ parentObjectId });
    return res.status(200).json(reminders);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching reminders', error: err.message });
  }
};

export {
  createReminder,
  getRemindersByDate,
  deleteReminder,
  getRemindersByUserAndDate,
  getReminderDates,
  getRemindersByParent
};
