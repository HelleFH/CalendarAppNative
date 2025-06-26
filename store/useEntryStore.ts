import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Next.js
interface Entry {
  _id: string;
  name: string;
  date: string;
  notes: string;
  images?: string[];
}

interface UpdateEntry {
  _id: string;
  date: string;
  notes: string;
  images?: string[];
  parentObjectId?: string;
}

interface EntryState {
  currentUserId: string | null;
  selectedDate: string;
  allNames: Entry[];
  entryForSelectedDate: Entry[];
  updateEntryForSelectedDate: UpdateEntry[];
  markedDates: { [date: string]: any };
  loading: boolean;

  setCurrentUserId: (id: string | null) => void;
  setSelectedDate: (date: string) => void;
  fetchAllNames: () => Promise<void>;
  fetchMarkedDates: () => Promise<void>;
  fetchEntriesByDate: (date: string) => Promise<void>;
  fetchUpdateEntriesByDate: (date: string) => Promise<void>;
  resetEntries: () => void;
}

export const useEntryStore = create<EntryState>((set, get) => ({
  currentUserId: null,
  selectedDate: '',
  allNames: [],
  entryForSelectedDate: [],
  updateEntryForSelectedDate: [],
  markedDates: {},
  loading: true,

  setCurrentUserId: (id) => set({ currentUserId: id }),

  setSelectedDate: (date) => set({ selectedDate: date }),

  fetchAllNames: async () => {
    const { currentUserId } = get();
    if (!currentUserId) return;
    try {
      const res = await axios.get(`${API_URL}/entries/names`, {
        params: { userId: currentUserId },
      });
      set({ allNames: res.data });
    } catch (err) {
      console.error('Error fetching names:', err);
    }
  },

  fetchMarkedDates: async () => {
    const { currentUserId } = get();
    if (!currentUserId) return;

    try {
      const entriesRes = await axios.get(`${API_URL}/entries/dates`, {
        params: { userId: currentUserId },
      });
      const updatesRes = await axios.get(`${API_URL}/entries/update-entries/dates`, {
        params: { userId: currentUserId },
      });

      const marked: { [date: string]: any } = {};
      entriesRes.data.forEach((d: string) => {
        marked[d] = { marked: true, dotColor: '#4CAF50' };
      });
      updatesRes.data.forEach((d: string) => {
        marked[d] = { marked: true, dotColor: 'blue' };
      });

      set({ markedDates: marked });
    } catch (err) {
      console.error('Failed to fetch dates:', err);
    }
  },

  fetchEntriesByDate: async (date) => {
    const { currentUserId } = get();
    if (!currentUserId) return;

    try {
      const res = await axios.get(`${API_URL}/entries`, {
        params: { userId: currentUserId, date },
      });
      const entries = Array.isArray(res.data) ? res.data : [res.data];
      set({ entryForSelectedDate: entries });
    } catch (err) {
      console.error('Error fetching entries:', err);
      set({ entryForSelectedDate: [] });
    }
  },

  fetchUpdateEntriesByDate: async (date) => {
    const { currentUserId } = get();
    if (!currentUserId) return;

    try {
      const res = await axios.get(`${API_URL}/entries/update-entries`, {
        params: { userId: currentUserId, date },
      });
      set({ updateEntryForSelectedDate: res.data });
    } catch (err) {
      console.error('Error fetching update entries:', err);
      set({ updateEntryForSelectedDate: [] });
    }
  },

  resetEntries: () =>
    set({
      entryForSelectedDate: [],
      updateEntryForSelectedDate: [],
    }),
}));
