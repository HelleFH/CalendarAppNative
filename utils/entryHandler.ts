import axios from 'axios';
import { Types } from 'mongoose';

import {
  addEntry,
  updateEntry,
  addUpdateEntry,
  updateUpdateEntry,
  deleteEntry,
  deleteUpdateEntry,
  deleteReminder,
  addReminder,
  fetchEntryById,
  fetchAllEntries,

} from '@/utils/api';
import { createFormData } from '@/utils/createFormData';

export const saveReminderHandler = async (payload: any) => {
  console.log('saveReminderHandler received:', payload);

  const {
    date,
    notes,
    currentUserId,
    parentObjectId,
    setMarkedDates,
    setIsReminderModalVisible,
    setEntryForSelectedDate,
    setSelectedOriginalEntry,
    setParentObjectId,
    fetchNames,
    handleDayPress,
    selectedDate,

  } = payload;

  if (!date || !notes || !currentUserId || !parentObjectId) {
    alert('Please provide all inputs (date, notes, user, plant).');
    console.log('Missing one of these:', { date, notes, currentUserId, parentObjectId });
    return;
  }

  try {
    const response = await addReminder({
      date,
      notes,
      userId: currentUserId,
      parentObjectId,
    });

    alert('Reminder saved!');
        handleDayPress({ dateString: selectedDate });

    setEntryForSelectedDate(response.entry);
    setMarkedDates((prev: any) => ({
      ...prev,
      [date]: { marked: true, dotColor: '#4CAF50' },
    }));

    setIsReminderModalVisible(false);
    setSelectedOriginalEntry(null);
    setParentObjectId(null);
    fetchNames();

  } catch (error: any) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : error instanceof Error
        ? error.message
        : 'Unknown error';

    if (message === 'Name already exists. Please choose a different one.') {
      alert('That name is already used. Please choose a unique name.');
    } else {
      alert(`Error saving reminder: ${message}`);
    }
  }
};

export const deleteReminderHandler = async ({
  reminderId,
  onSuccess,
}: {
  reminderId: string;
  onSuccess?: () => void;
}) => {
  if (!reminderId) {
    alert('Missing reminder ID for deletion.');
    return;
  }

  try {
    console.log('entry in ReminderDisplay:', reminderId);
    await deleteReminder(reminderId);
    alert('Reminder deleted!');
    onSuccess?.();
  } catch (error: any) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : 'Failed to delete reminder.';
    alert(message);
  }
};

export const fetchAndSetParentEntry = async (
  entry: { parentObjectId?: string | Types.ObjectId },
  setParentEntry: React.Dispatch<React.SetStateAction<any>>
) => {
  if (entry.parentObjectId) {
    const parentId = typeof entry.parentObjectId === 'string'
      ? entry.parentObjectId
      : entry.parentObjectId.toString();

    console.log('Fetching entry with ID:', parentId);
    try {
      const data = await fetchEntryById(parentId);
      console.log('Data received from fetchEntryById:', data);
      setParentEntry(data ?? null);
    } catch (err) {
      console.error('Error in fetchAndSetParentEntry:', err);
      setParentEntry(null);
    }
  } else {
    console.log('No parentObjectId found in entry:', entry);
    setParentEntry(null);
  }
};

export const saveEntryHandler = async ({
  selectedDate,
  notes,
  images,
  currentUserId,
  name,
  setMarkedDates,
  setEntryForSelectedDate,
  setParentObjectId,
  fetchNames,
  handleDayPress,
}: any) => {
  if (!selectedDate || !notes || images.length === 0 || !currentUserId || !name) {
    alert('Please provide all inputs (date, notes, images, name, and login).');
    return;
  }

  const formData = await createFormData({
    data: {
      date: selectedDate,
      notes,
      userId: currentUserId,
      name,
      createdAt: new Date().toISOString(),
    },
    images,
  });

  try {
    const response = await addEntry(formData);
    alert('Entry saved!');
    setEntryForSelectedDate(response.data.entry);
    setMarkedDates((prev: any) => ({
      ...prev,
      [selectedDate]: { marked: true, dotColor: '#4CAF50' },
    }));
    setParentObjectId(null);
    fetchNames();
    handleDayPress({ dateString: selectedDate });

  } catch (error: any) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : error instanceof Error
        ? error.message
        : 'Unknown error';

    if (message === 'Name already exists. Please choose a different one.') {
      alert('That name is already used. Please choose a unique name.');
    } else {
      alert(`Error saving entry: ${message}`);
    }
  }
};


export const saveEditedEntryHandler = async ({
  editingEntryId,
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
}: {
  editingEntryId: string;
  selectedDate: string;
  notes: string;
  currentUserId: string;
  name: string;
  images: string[];
  setIsCreateModalVisible: (visible: boolean) => void;
  setIsEditing: (val: boolean) => void;
  setEditingEntryId: (id: string | null) => void;
  handleDayPress: (date: { dateString: string }) => void;
  fetchMarkedDates: (userId: string) => void;
  fetchNames: () => void;
}) => {
  // ✅ Step 1: Validate
  if (!editingEntryId || !selectedDate || !notes || !currentUserId || !name) {
    alert('Missing data for editing.');
    return;
  }

  try {
    // ✅ Step 2: Prepare form data — no new createdAt for updates
    const formData = await createFormData({
      data: {
        date: selectedDate,
        notes,
        userId: currentUserId,
        name,
        updatedAt: new Date().toISOString(), // ✅ use updatedAt instead
      },
      images,
    });

    // ✅ Step 3: Perform update API call
    await updateEntry({ editingEntryId, formData });

    alert('Entry updated successfully!');

    // ✅ Step 4: Reset modal + refresh UI
    setIsCreateModalVisible(false);
    setIsEditing(false);
    setEditingEntryId(null);
    handleDayPress({ dateString: selectedDate });
    fetchMarkedDates(currentUserId);
    fetchNames();
  } catch (error: any) {
    console.error('Failed to update entry:', error);
    alert('Failed to update entry. Please try again.');
  }
};


export const saveEditedUpdateEntryHandler = async ({
  editingEntryId,
  selectedDate,
  notes,
  currentUserId,
  images,
  setIsCreateModalVisible,
  setIsEditing,
  setEditingEntryId,
  handleDayPress,
  fetchMarkedDates,
}: any) => {
  if (!editingEntryId || !selectedDate || !notes || !currentUserId) {
    alert('Missing data for editing.');
    return;
  }

  const data = {
    entryId: editingEntryId,
    date: selectedDate,
    notes,
    userId: currentUserId,
  };

  const formData = await createFormData({ data, images });

  try {
    await updateUpdateEntry({ editingEntryId, formData });
    alert('Update entry updated!');
    setIsCreateModalVisible(false);
    setIsEditing(false);
    setEditingEntryId(null);
    handleDayPress({ dateString: selectedDate });
    fetchMarkedDates(currentUserId);
  } catch (error) {
    alert('Failed to  update entry.');
  }
};

export const deleteEntryHandler = async ({
  entryId,
  selectedDate,
  setMarkedDates,
  setEntryForSelectedDate,
  setUpdateEntryForSelectedDate,
  handleDayPress,
}: any) => {
  try {
    await deleteEntry(entryId);

    // Update the UI after deletion
    setMarkedDates?.((prev: any) => {
      const updated = { ...prev };
      delete updated[selectedDate];
      return updated;
    });

    setEntryForSelectedDate?.(null);
    setUpdateEntryForSelectedDate?.([]);
    handleDayPress?.({ dateString: selectedDate });

  
  } catch (err) {
    console.error('Error deleting entry:', err);
  }
};

export const deleteUpdateEntryHandler = async ({
  entryId,
  selectedDate,
  setMarkedDates,
  handleDayPress,
}: any) => {
  try {
    await deleteUpdateEntry(entryId); 
    console.log('Deleted entry successfully');

    setMarkedDates((prev: any) => {
      const updated = { ...prev };
      if (selectedDate) delete updated[selectedDate];
      return updated;
    });

    if (handleDayPress) handleDayPress({ dateString: selectedDate });
    alert('Deleted update entry ');
  } catch (err) {
    console.error('Error deleting update entry:', err);
    alert(' Failed to delete update entry');
  }
};

export const saveUpdateEntryHandler = async ({
  parentObjectId,
  selectedDate,
  notes,
  images,
  currentUserId,
  setIsUpdateModalVisible,
  setMarkedDates,
  setSelectedOriginalEntry,
  setParentObjectId,
  setEntryForSelectedDate,
  handleDayPress,
}: any) => {
  if (!parentObjectId) {
    alert('No entry selected for updating.');
    return;
  }

  if (!selectedDate || !notes || images.length === 0 || !currentUserId) {
    alert('Please provide all inputs (date, notes, images, login).');
    return;
  }

  const formData = await createFormData({
    data: {
      date: selectedDate,
      notes,
      userId: currentUserId,
      parentObjectId,
      updatedAt: new Date().toISOString(),
    },
    images,
  });
try {
  const response = await addUpdateEntry(formData);
  console.log('Update Entry response:', response);

  const entry = response?.data?.updateEntry;

  if (!entry) {
    console.error('No entry returned in response:', response);
    alert('Update saved, but no entry was returned. UI update skipped.');
    return;
  }

  alert('Update Entry Saved!');

  try {
    setEntryForSelectedDate(entry);
    setMarkedDates((prev: any) => ({
      ...prev,
      [selectedDate]: { marked: true, dotColor: '#4CAF50' },
    }));
    setIsUpdateModalVisible(false);
    setSelectedOriginalEntry(null);
    setParentObjectId(null);
    handleDayPress({ dateString: selectedDate });
  } catch (stateUpdateError) {
    console.error('State update failed:', stateUpdateError);
  }
} catch (error) {
  console.error('Save failed:', error);
  alert('Failed to save update entry.');
}

};


export const fetchAllEntriesHandler = async ({
  userId,
  setEntries,
}: {
  userId: string;
  setEntries: (entries: any[]) => void;
}) => {
  if (!userId) return;

  const entries = await fetchAllEntries(userId);
  setEntries(entries);
};

