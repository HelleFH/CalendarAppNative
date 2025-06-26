// utils/api.ts
import axios from 'axios';

interface ReminderData {
  date: string;
  notes: string;
  userId: string;
  parentObjectId:string;
}

const API_URL = 'http://localhost:5000';

export const fetchNames = (userId: string) =>
  axios.get(`${API_URL}/entries/names`, { params: { userId } });

export const fetchMarkedDates = async (userId: string) => {
  const [entries, updates, reminders] = await Promise.all([
    axios.get(`${API_URL}/entries/dates`, { params: { userId } }),
    axios.get(`${API_URL}/entries/update-entries/dates`, { params: { userId } }),
        axios.get(`${API_URL}/entries/reminders/dates`, { params: { userId } }),

  ]);

  const markedEntries: { [date: string]: any } = {};
  entries.data.forEach((date: string) => {
    markedEntries[date] = { marked: true, dotColor: '#4CAF50' };
  });

      reminders.data.forEach((date: string) => {
    markedEntries[date] = { marked: true, dotColor: 'red' };
  });

  updates.data.forEach((date: string) => {
    markedEntries[date] = { marked: true, dotColor: 'blue' };
  });
  

  return markedEntries;
};


export const addReminder = async ({
  date,
  notes,
  parentObjectId, 
  userId,
}: ReminderData) => {
  const response = await axios.post(`${API_URL}/entries/reminders/create`, {
    date,
    notes,
    parentObjectId, 
    userId,
  });
  return response.data;  
};

export const deleteReminder = (id: string) => {
  
  return axios.delete(`${API_URL}/entries/reminders/${id}`);
};

export const fetchOriginalEntries = async (userId: string, date: string) => {
  try {
    const res = await axios.get(`${API_URL}/entries`, {
      params: { userId, date },
    });
    return Array.isArray(res.data) ? res.data : [res.data];
  } catch (err) {
    console.error('Error fetching original entries:', err);
    return [];
  }
};

export const fetchUpdateEntries = async (userId: string, date: string) => {
  try {
    const res = await axios.get(`${API_URL}/entries/update-entries`, {
      params: { userId, date },
    });
    return Array.isArray(res.data) ? res.data : [res.data];
  } catch (err) {
    console.error('Error fetching update entries:', err);
    return [];
  }
};
export const fetchReminders = async (userId: string, date: string) => {
  try {
    const res = await axios.get(`${API_URL}/entries/reminders`, {
      params: { userId, date },
    });
    return Array.isArray(res.data) ? res.data : [res.data];
  } catch (err) {
    console.error('Error fetching reminders:', err);
    return [];
  }
};
export const fetchEntriesForDate = async (userId: string, date: string) => {
  try {
    const [originalEntries, updateEntries, reminders] = await Promise.all([
      fetchOriginalEntries(userId, date),
      fetchUpdateEntries(userId, date),
      fetchReminders(userId, date),

    ]);

    return { originalEntries, updateEntries, reminders };
  } catch (err) {
    console.error('Error in fetchEntriesForDate:', err);
    return { originalEntries: [], updateEntries: [], reminders: [] };
  }
};

interface EditEntryParams {
  editingEntryId: string;
  formData: FormData;
}

export const updateEntry = async ({ editingEntryId, formData }: EditEntryParams) => {
  try {
    await axios.put(`${API_URL}/entries/edit-entry/${editingEntryId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return true;
  } catch (error) {
    console.error('Error updating entry:', error);
    throw error;
  }
};

interface UpdateEntryParams {
  editingEntryId: string;
  formData: FormData;
}


export const updateUpdateEntry = async ({ editingEntryId, formData }: UpdateEntryParams) => {
  await axios.put(`${API_URL}/entries/edit-update-entry/${editingEntryId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteEntry = async (entryId: string) => {
  await axios.delete(`${API_URL}/entries/delete-entry/${entryId}`);
};

export const deleteUpdateEntry = async (entryId: string) => {
  await axios.delete(`${API_URL}/entries/delete-update-entry/${entryId}`);
};

export const addEntry = async (formData: FormData) => {
  return await axios.post(`${API_URL}/entries/add-entry`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const addUpdateEntry = async (formData: FormData) => {
  return axios.post(`${API_URL}/entries/update-entry`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};