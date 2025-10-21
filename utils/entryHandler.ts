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
  deleteEntryImage,

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
    await addEntry(formData);
    alert('Entry saved!');
    setParentObjectId(null);
    fetchNames?.();

    // refresh entries and marked dates
    if (handleDayPress) {
      await handleDayPress({ dateString: selectedDate });
    }

    setMarkedDates((prev: any) => ({
      ...prev,
      [selectedDate]: { marked: true, dotColor: '#4CAF50' },
    }));

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
}: any) => {
  if (!editingEntryId || !selectedDate || !notes || !currentUserId || !name) {
    alert('Missing data for editing.');
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
    await updateEntry({ editingEntryId, formData });
    alert('Entry updated!');
    setIsCreateModalVisible(false);
    setIsEditing(false);
    setEditingEntryId(null);
    handleDayPress({ dateString: selectedDate });
    fetchMarkedDates(currentUserId);
    fetchNames();
  } catch (error) {
    alert('Failed to update entry.');
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
    alert('Deleted entry');

    setMarkedDates((prev: any) => {
      const updated = { ...prev };
      delete updated[selectedDate];
      return updated;
    });

    setEntryForSelectedDate(null);
    setUpdateEntryForSelectedDate([]);
    handleDayPress({ dateString: selectedDate });
  } catch (err) {
    alert('Failed to delete entry');
  }
};

export const deleteImageHandler = async ({
  entryId,
  imageUrl,
  setImages,
}: {
  entryId: string;
  imageUrl: string;
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  if (!entryId || !imageUrl) {
    alert('Missing entry ID or image URL.');
    return;
  }

  try {
    const updatedImages = await deleteEntryImage(entryId, imageUrl);
    alert('Image deleted!');
    setImages(updatedImages);
  } catch (err) {
    console.error('Failed to delete image:', err);
    alert('Failed to delete image.');
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
    alert('Deleted update entry');

    setMarkedDates((prev: any) => {
      const updated = { ...prev };
      delete updated[selectedDate];
      return updated;
    });

    handleDayPress({ dateString: selectedDate });
  } catch (err) {
    alert('Failed to delete update entry');
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
    alert('Saved, but failed to update UI.');
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