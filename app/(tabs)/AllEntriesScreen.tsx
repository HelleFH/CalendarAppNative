import React, { useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { EntryDisplay } from '@/components/entry/EntryDisplay';
import { useCurrentUser } from '@/components/CurrentUser';
import { fetchAllEntries } from '@/utils/api';
import { useEntries } from '@/hooks/useEntries';
import { ThemedText } from '@/styles/ThemedText';
import { ThemedScrollView } from '@/styles/ThemedScrollView';


interface EntryProps {
  _id: string;
  name: string;
  date: string;
  notes: string;
  images?: string[];
}
 const AllEntriesScreen = () => {
  const { currentUserId } = useCurrentUser();
  const [entries, setEntries] = useState<EntryProps[]>([]);

  // Only call your hooks that depend on user ID once it's available
  const {
    handleEditEntry,
    handleEditUpdate,
    handleDeleteEntry,
    handleDeleteUpdateEntry,
  } = useEntries(currentUserId ?? ''); // pass empty string as fallback

  useEffect(() => {
    if (!currentUserId) return; // guard
    const loadEntries = async () => {
      const allEntries = await fetchAllEntries(currentUserId);
      setEntries(allEntries);
    };
    loadEntries();
  }, [currentUserId]);

  if (!currentUserId) return <ThemedText>Loading...</ThemedText>; // prevent rendering hooks prematurely

  return (
    <ThemedScrollView>
      {entries.length > 0 ? (
        entries.map((entry) => (
          <EntryDisplay
            key={entry._id}
            entry={entry}
            onEditEntry={handleEditEntry}
            onDeleteEntry={handleDeleteEntry}
            onEditUpdate={handleEditUpdate}
            onDeleteUpdate={handleDeleteUpdateEntry}
          />
        ))
      ) : (
        <ThemedText>No entries available.</ThemedText>
      )}
    </ThemedScrollView>
  );
};
export default AllEntriesScreen;