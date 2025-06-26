import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Button } from 'react-native';
import { UpdateEntryDisplay } from './UpdateEntryDisplay';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import axios from 'axios';
import { AppIconButton } from './AppIconButton';


interface EntryProps {
  _id: string;
  name: string;
  date: string;
  notes: string;
  images?: string[];
}
interface EntryDisplayProps {
  entry: EntryProps;
  onEdit: (entry: EntryProps) => void;
  onDelete: (entryId: string) => void;
  onEditUpdate: (entry: UpdateEntryProps) => void; // 👈 Add
  onDeleteUpdate: (entryId: string) => void;       // 👈 Add
}
interface UpdateEntryProps {
  _id: string;
  date: string;
  notes: string;
  images?: string[];
  parentObjectId?: string;  // For update entries, you might want to use this
}


export const EntryDisplay: React.FC<EntryDisplayProps> = ({
  entry,
  onEdit,
  onDelete,
  onEditUpdate,
  onDeleteUpdate, // ✅ include these
}) => {

  const [updateEntries, setUpdateEntries] = useState<UpdateEntryProps[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // ✅ State

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
    <View style={[styles.container && styles.updateContainer]}>
      <Text style={styles.title}>{`Entry for ${entry.date}`}</Text>

      <Text style={styles.name}>{entry.name}</Text>

      <Text style={styles.notes}>{entry.notes}</Text>
      <ScrollView horizontal>
        {(entry.images ?? []).map((uri, idx) => (
          <Image key={idx} source={{ uri }} style={styles.image} />
        ))}
      </ScrollView>
      
      <AppIconButton icon='pencil'
        label="Edit" onPress={() => onEdit(entry)} />

      <AppIconButton
        icon='remove'
        label="Delete"
        onPress={() => setShowDeleteModal(true)}
      />
      {updateEntries.map((u) => (
        <UpdateEntryDisplay
          key={u._id}
          entry={{ ...u, images: u.images ?? [] }} // ✅ ensure images is never undefined
          onEditUpdate={onEditUpdate}
          onDeleteUpdate={onDeleteUpdate}
        />
      ))}

      <DeleteConfirmationModal
        visible={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => {
          onDelete(entry._id);
          setShowDeleteModal(false);
        }}
        itemType="entry"
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