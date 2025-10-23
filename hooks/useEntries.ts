import { useState, useEffect } from 'react';
import { fetchEntriesForDateCombined, fetchMarkedDates, fetchMarkedDatesCombined } from '../utils/api';
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
export const useEntries = (_id?: string) => {
  const { currentUserId } = useCurrentUser();

  const { allNames, fetchNames } = useNames(currentUserId ?? ''); 

  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({});
  const [entryForSelectedDate, setEntryForSelectedDate] = useState<any[]>([]);
  const [updateEntryForSelectedDate, setUpdateEntryForSelectedDate] = useState<any[]>([]);
  const [reminderForSelectedDate, setReminderForSelectedDate] = useState<any[]>([]);
  const [parentObjectId, setParentObjectId] = useState<string | null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

    useEffect(() => {
    if (!currentUserId) return;
    handleDayPress(selectedDate);
  }, [currentUserId]);

  const handleDayPress = async (day: any) => {
    if (!currentUserId) return;

    const dateString = day?.dateString || day;
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


  const saveEntry = () => saveEntryHandler({
    selectedDate, notes, images, currentUserId, name,
    setMarkedDates, setEntryForSelectedDate, setParentObjectId, fetchNames, handleDayPress
  });

const saveEditedEntry = (entryId: string) => {
  if (!entryId || !currentUserId) {
    alert("Cannot edit: missing user or entry ID.");
    return;
  }

  saveEditedEntryHandler({
    editingEntryId: entryId,
    selectedDate,
    notes,
    currentUserId,
    name,
    images,
    setIsCreateModalVisible,
    setIsEditing,
    setEditingEntryId,
    handleDayPress,
    fetchMarkedDates,
    fetchNames,
  });
};



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
   setIsCreateModalVisible(true); 
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
