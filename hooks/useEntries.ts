import { useState, useEffect } from 'react';
import { 

} from '../utils/api';
import {
  saveEntryHandler,
  saveEditedEntryHandler,
  saveEditedUpdateEntryHandler,
  deleteEntryHandler,
  deleteUpdateEntryHandler,
  saveUpdateEntryHandler,
  saveReminderHandler,
  deleteReminderHandler
} from '../utils/entryHandler';
import { useNames } from '../utils/api';
import { useCurrentUser } from '../components/CurrentUser';

export const useEntries = () => {
  const { currentUserId } = useCurrentUser();
  const { allNames, fetchNames } = useNames(currentUserId);

  // --- Shared state ---
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [name, setName] = useState<string>('');
  const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({});
  const [entryForSelectedDate, setEntryForSelectedDate] = useState<any[]>([]);
  const [updateEntryForSelectedDate, setUpdateEntryForSelectedDate] = useState<any[]>([]);
  const [reminderForSelectedDate, setReminderForSelectedDate] = useState<any[]>([]);
  const [parentObjectId, setParentObjectId] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  // --- Fetch entries for date ---
  const handleDayPress = async (day: any) => {
    if (!currentUserId) return;

    const dateString = day.dateString || day;
    setSelectedDate(dateString);

    try {
      const { originalEntries, updateEntries, reminders } = await fetchEntriesForDateCombined(currentUserId, dateString);
      setEntryForSelectedDate(originalEntries);
      setUpdateEntryForSelectedDate(updateEntries);
      setReminderForSelectedDate(reminders);

      const newMarked = await fetchMarkedDatesCombined(currentUserId);
      setMarkedDates(newMarked);
    } catch (err) {
      console.error('Error fetching entries:', err);
    }
  };

  useEffect(() => {
    if (currentUserId) handleDayPress(selectedDate);
  }, [currentUserId]);

  // --- CRUD handlers (unified and re-exported) ---
  const saveEntry = () => saveEntryHandler({ 
    selectedDate, notes, images, currentUserId, name, 
    setMarkedDates, setEntryForSelectedDate, setParentObjectId, fetchNames, handleDayPress
  });

  const saveEditedEntry = () => saveEditedEntryHandler({
    editingEntryId, selectedDate, notes, currentUserId, name, images,
    setIsEditing, setEditingEntryId, handleDayPress, fetchMarkedDatesCombined, fetchNames
  });

  const saveEditedUpdateEntry = () => saveEditedUpdateEntryHandler({
    editingEntryId, selectedDate, notes, currentUserId, images,
    setIsEditing, setEditingEntryId, handleDayPress, fetchMarkedDatesCombined
  });

  const handleDeleteEntry = (entryId: string) =>
    deleteEntryHandler({ entryId, selectedDate, setMarkedDates, setEntryForSelectedDate, setUpdateEntryForSelectedDate, handleDayPress });

  const handleDeleteUpdateEntry = (entryId: string) =>
    deleteUpdateEntryHandler({ entryId, selectedDate, setMarkedDates, handleDayPress });
const handleUpdate = ({ parentObjectId, notes, images }: any) =>
  saveUpdateEntryHandler({
    parentObjectId,
    selectedDate,
    notes,
    images,
    currentUserId,
    setMarkedDates,
    setParentObjectId,
    setEntryForSelectedDate,
    handleDayPress,
  });


  const handleEditEntry = (entry: any) => {
  setNotes(entry.notes);
  setImages(entry.images || []);
  setName(entry.name);
  setSelectedDate(entry.date);
  setIsEditing(true);
  setEditingEntryId(entry._id);
};

const handleEditUpdate = (entry: any) => {
  setNotes(entry.notes);
  setImages(entry.images || []);
  setSelectedDate(entry.date);
  setIsEditing(true);
  setEditingEntryId(entry._id);
  setParentObjectId(entry.parentObjectId || null);
};

const handleEditReminder = (entry: any) => {
  setNotes(entry.notes);
  setSelectedDate(entry.date);
  setIsEditing(true);
  setEditingEntryId(entry._id);
};
 return {
  currentUserId,
  allNames,
  fetchNames,
  selectedDate,
  setSelectedDate,
  notes,
  setNotes,
  images,
  setImages,
  name,
  setName,
  markedDates,
  entryForSelectedDate,
  updateEntryForSelectedDate,
  reminderForSelectedDate,
  handleDayPress,
  saveEntry,
  saveEditedEntry,
  saveEditedUpdateEntry,
  handleDeleteEntry,
  handleDeleteUpdateEntry,
  handleUpdate,
  handleEditEntry,
  handleEditUpdate,
  handleEditReminder,
  parentObjectId,
  setParentObjectId,
  isEditing,
  setIsEditing,
  editingEntryId,
  setEditingEntryId,
};
};
