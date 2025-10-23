import React, { useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { EntryDisplay } from '@/components/entry/EntryDisplay';
import { useCurrentUser } from '@/components/CurrentUser';
import { fetchAllEntries } from '@/utils/api';
import { commonStyles } from '@/styles/SharedStyles';
import { useEntries } from '@/hooks/useEntries';

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

  if (!currentUserId) return <Text>Loading...</Text>; // prevent rendering hooks prematurely

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
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
        <Text>No entries available.</Text>
      )}
    </ScrollView>
  );
};
export default AllEntriesScreen;