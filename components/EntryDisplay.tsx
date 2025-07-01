import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { UpdateEntryDisplay } from './UpdateEntryDisplay';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import axios from 'axios';
import { AppIconButton } from './AppIconButton';
import { EntryDetailModal } from './EntryDetailModal';
import { sharedEntryStyles } from '@/SharedEntryStyles';


interface EntryProps {
  _id: string;
  name: string;
  date: string;
  notes: string;
  images?: string[];
}
interface EntryDisplayProps {
  entry: EntryProps;
  onEditEntry: (entry: EntryProps) => void;
  onEditUpdate: (entry: UpdateEntryProps) => void;
  onDeleteEntry: (id: string) => void;
  onDeleteUpdate: (id: string) => void;
  onPress?: () => void;
  showUpdatesInline?: boolean;
}
interface UpdateEntryProps {
  _id: string;
  date: string;
  notes: string;
  images?: string[];
  parentObjectId?: string;
}


export const EntryDisplay: React.FC<EntryDisplayProps> = ({
  entry,
  onEditEntry,
  onDeleteEntry,
  onEditUpdate,
  onDeleteUpdate,
  onPress,

}) => {

  const [updateEntries, setUpdateEntries] = useState<UpdateEntryProps[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<EntryProps | null>(null);
  const [showUpdatesInline, setshowUpdatesInline] = useState(false);
  const [showUpdateList, setShowUpdateList] = useState(false);




  useEffect(() => {
    const fetchUpdateEntries = async () => {
      if (!entry._id) return;

      try {
        const res = await axios.get<UpdateEntryProps[]>(
          'https://calendarappnative.onrender.com/entries/update-entries/by-parent',
          {
            params: { parentObjectId: entry._id },
          }
        );

        setUpdateEntries(res.data);
      } catch (err) {
        console.error('Failed to fetch update entries:', err);
      }
    };

    fetchUpdateEntries();
  }, [entry._id]);




  return (
    <View style={sharedEntryStyles.container}>
      <TouchableOpacity
        onPress={() => {
          setSelectedEntry(entry);
          setShowEntryModal(true);
        }}
        activeOpacity={0.7}
      >
        <Text style={sharedEntryStyles.title}>{`Entry for ${entry.date}`}</Text>
        <Text style={sharedEntryStyles.name}>{entry.name}</Text>
        <Text style={sharedEntryStyles.notes}>{entry.notes}</Text>
        <ScrollView horizontal>
          {(entry.images ?? []).map((uri, idx) => (
            <Image key={idx} source={{ uri }} style={sharedEntryStyles.image} />
          ))}
        </ScrollView>
      </TouchableOpacity>

      <View style={sharedEntryStyles.buttonWrapper}>
        <AppIconButton
          icon="pencil"
          label="Edit"
          onPress={() => {
            onEditEntry(entry);
            setShowEntryModal(false);  // Close the EntryDetailModal
          }}
          variant="edit"
        />
        <AppIconButton icon="remove" label="Delete" onPress={() => onDeleteEntry(entry._id)} variant="delete" />
      </View>
      {showUpdatesInline ? (
        updateEntries.map((u) => (
          <UpdateEntryDisplay
            key={u._id}
            entry={{ ...u, images: u.images ?? [] }}
            onEditUpdate={onEditUpdate}
            onDeleteUpdate={onDeleteUpdate}
          />
        ))
      ) : (
        <>
          {updateEntries.length > 0 && (
            <AppIconButton
              icon="eye-outline"
              label={showUpdateList ? 'Hide Updates' : 'View Updates'}
              onPress={() => setShowUpdateList((prev) => !prev)}
              variant="secondary"
            />
          )}
          {showUpdateList &&
            updateEntries.map((u) => (
              <UpdateEntryDisplay
                key={u._id}
                entry={{ ...u, images: u.images ?? [] }}
                onEditUpdate={onEditUpdate}
                onDeleteUpdate={onDeleteUpdate}
              />
            ))}
        </>
      )}


      <DeleteConfirmationModal
        visible={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => {
          onDeleteEntry(entry._id);
          setShowDeleteModal(false);
        }}
        itemType="entry"
      />
      <EntryDetailModal
        visible={showEntryModal}
        entry={entry}
        onClose={() => setShowEntryModal(false)}
        onEditUpdate={onEditUpdate}
        onDeleteUpdate={onDeleteUpdate}
        onDeleteEntry={onDeleteEntry}
        onEditEntry={onEditEntry}
      />
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F0F8FF',
    borderRadius: 10,
  },
  updateContainer: {
    backgroundColor: '#E8F7FD',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  name: {
    fontStyle: 'italic',
    marginBottom: 5,
  },
  notes: {
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
});