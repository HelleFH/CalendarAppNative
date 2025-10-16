import React, { useEffect } from 'react';
import { ScrollView, Text, RefreshControl } from 'react-native';
import { EntryDisplay } from '@/components/entry/EntryDisplay';
import { useEntries } from '@/hooks/useEntries';

const AllEntriesScreen = () => {
  const { currentUserId, entryForSelectedDate, handleDeleteEntry, handleEditEntry,
    handleEditUpdate, handleEditReminder,     handleDeleteUpdateEntry,
} = useEntries();

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {entryForSelectedDate.length > 0 ? (
        entryForSelectedDate.map(entry => (
          <EntryDisplay
            key={entry._id}
            entry={entry}
            onDeleteEntry={handleDeleteEntry}

            onEditEntry={handleEditEntry}
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
