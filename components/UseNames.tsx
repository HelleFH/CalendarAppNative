// hooks/useNames.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useNames = (currentUserId: string | null) => {
  const [allNames, setAllNames] = useState([]);

  const fetchNames = async () => {
    if (!currentUserId) return;
    try {
      const res = await axios.get('https://calendarappnative.onrender.com/entries/names', {
        params: { userId: currentUserId },
      });
      setAllNames(res.data);
    } catch (err) {
      console.error('Error fetching names:', err);
    }
  };

  useEffect(() => {
    fetchNames();
  }, [currentUserId]);

  return { allNames, fetchNames };
};
