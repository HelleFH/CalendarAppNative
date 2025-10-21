// utils/api.ts
import axios from 'axios';
import { useEffect, useState } from 'react';

interface ReminderData {
  date: string;
  notes: string;
  userId: string;
  parentObjectId: string;
}

const API_URL = 'http://localhost:5000';

// Fetch all names for a user

export const fetchNames = (userId: string) =>
  axios.get(`${API_URL}/entries/names`, { params: { userId } });

// Fetch combined marked dates with icons
export const fetchMarkedDatesCombined = async (userId: string) => {
  try {
    const res = await axios.get(`${API_URL}/entries/marked-dates`, { params: { userId } });
    return res.data; 
  } catch (err) {
    console.error('Error fetching marked dates combined:', err);
    return {};
  }
};

// Reminders
export const addReminder = async ({ date, notes, parentObjectId, userId }: ReminderData) => {
  const response = await axios.post(`${API_URL}/entries/reminders/create`, {
    date,
    notes,
    parentObjectId,
    userId,
  });
  return response.data;
};

export const deleteReminder = (id: string) =>
  axios.delete(`${API_URL}/entries/reminders/${id}`);

// Fetch all entries, updates, and reminders for a specific date (combined endpoint)
export const fetchEntriesForDateCombined = async (userId: string, date: string) => {
  try {
    const res = await axios.get(`${API_URL}/entries/entries-for-date`, { params: { userId, date } });
    return {
      originalEntries: res.data.entries || [],
      updateEntries: res.data.updates || [],
      reminders: res.data.reminders || [],
    };
  } catch (err) {
    console.error('Error fetching combined entries for date:', err);
    return { originalEntries: [], updateEntries: [], reminders: [] };
  }
};

// Update entry
interface EditEntryParams {
  editingEntryId: string;
  formData: FormData;
}
export const updateEntry = async ({ editingEntryId, formData }: EditEntryParams) => {
  try {
    await axios.put(`${API_URL}/entries/edit-entry/${editingEntryId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return true;
  } catch (error) {
    console.error('Error updating entry:', error);
    throw error;
  }
};

// Update update-entry
interface UpdateEntryParams {
  editingEntryId: string;
  formData: FormData;
}
export const updateUpdateEntry = async ({ editingEntryId, formData }: UpdateEntryParams) =>
  axios.put(`${API_URL}/entries/edit-update-entry/${editingEntryId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Delete operations
export const deleteEntry = async (entryId: string) =>
  axios.delete(`${API_URL}/entries/delete-entry/${entryId}`);

export const deleteUpdateEntry = async (entryId: string) =>
  axios.delete(`${API_URL}/entries/delete-update-entry/${entryId}`);

export const deleteEntryImage = async (entryId: string, imageUrl: string) => {
  const response = await axios.delete(`${API_URL}/entries/image`, { data: { entryId, imageUrl } });
  return response.data.images;
};

// Add operations
export const addEntry = async (formData: FormData) =>
  axios.post(`${API_URL}/entries/add-entry`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const addUpdateEntry = async (formData: FormData) =>
  axios.post(`${API_URL}/entries/update-entry`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Fetch by parentObjectId
export const fetchEntryById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/entries/by-parent/${id}`);
    return response.data.entry ?? null;
  } catch (error) {
    console.error('Failed to fetch entry by parentObjectId:', id, error);
    return null;
  }
};

export const fetchUpdateEntriesByParent = async (parentObjectId: string) => {
  try {
    const res = await axios.get(`${API_URL}/entries/update-entries/by-parent`, {
      params: { parentObjectId },
    });
    return res.data;
  } catch (err) {
    console.error('Error fetching update entries by parent:', err);
    return [];
  }
};

export const fetchRemindersByParent = async (parentObjectId: string) => {
  try {
    const res = await axios.get(`${API_URL}/entries/reminders/by-parent`, {
      params: { parentObjectId },
    });
    return res.data;
  } catch (err) {
    console.error('Error fetching reminders by parent:', err);
    return [];
  }
};

// Fetch all entries for a user
export const fetchAllEntries = async (userId: string) => {
  try {
    const res = await axios.get(`${API_URL}/entries/all`, { params: { userId } });
    return Array.isArray(res.data) ? res.data : [res.data];
  } catch (error) {
    console.error('Error fetching all entries:', error);
    return [];
  }
};
interface NameEntry {
  _id: string;
  name: string;
}

export const useNames = (currentUserId: string | null) => {
  const [allNames, setAllNames] = useState<NameEntry[]>([]);

  const fetchNames = async () => {
    if (!currentUserId) return;
    try {
      const res = await axios.get(`${API_URL}/entries/names`, {
        params: { userId: currentUserId },
      });
      setAllNames(res.data); // must be array of { _id, name }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNames();
  }, [currentUserId]);

  return { allNames, fetchNames };
};


