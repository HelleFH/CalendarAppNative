// utils/fetchNames.ts
import axios from 'axios';

export const fetchNamesForUser = async (userId: string | null) => {
  if (!userId) return [];
  try {
    const res = await axios.get('http://localhost:5000/entries/names', {
      params: { userId },
    });
    return res.data;
  } catch (err) {
    console.error('Error fetching names:', err);
    return [];
  }
};
