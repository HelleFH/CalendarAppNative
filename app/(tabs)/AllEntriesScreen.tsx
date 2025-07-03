import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Modal, Button } from 'react-native';
import axios from 'axios';
import { EntryDisplay } from '@/components/EntryDisplay';
import { NotesAndImages } from '@/components/NotesAndImages';

import {
  saveEntryHandler,
  saveEditedEntryHandler,
  saveEditedUpdateEntryHandler,
  deleteEntryHandler,
  deleteUpdateEntryHandler,
  saveUpdateEntryHandler
} from '@/utils/entryHandler';
import { useNames } from '@/components/UseNames';
import { useCurrentUser } from '@/components/CurrentUser';

interface EntryProps {
  _id: string;
  name: string;
  date: string;
  notes: string;
  images?: string[];
}

interface UpdateEntryProps {
  _id: string;
  date: string;
  notes: string;
  images?: string[];
  parentObjectId?: string;
}

const AllEntriesScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [name, setName] = useState<string>('');
  const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({});
  const [entryForSelectedDate, setEntryForSelectedDate] = useState<any>(null);
  const [updateEntryForSelectedDate, setUpdateEntryForSelectedDate] = useState<any>(null);
  const [selectedOriginalEntry, setSelectedOriginalEntry] = useState<any>(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [parentObjectId, setParentObjectId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [entries, setEntries] = useState<EntryProps[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { currentUserId, isLoading } = useCurrentUser();
  const { allNames, fetchNames } = useNames(currentUserId);

  const fetchAllEntries = async () => {
    if (!currentUserId) return;
    try {
      const res = await axios.get('https://calendarappnative.onrender.com/entries/all', {
        params: { userId: currentUserId },
      });

      const data = Array.isArray(res.data) ? res.data : [res.data];
      setEntries(data);
    } catch (error) {
      console.error('Error fetching all entries:', error);
      setEntries([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllEntries();
    setRefreshing(false);
  };

  const handleDayPress = () => {
    // Placeholder: define this function or replace with appropriate logic
  };

  const fetchMarkedDates = () => {
    // Placeholder: define this function if needed
  };

  const saveEntry = () =>
    saveEntryHandler({
      selectedDate,
      notes,
      images,
      currentUserId,
      name,
      setMarkedDates,
      setIsCreateModalVisible,
      setEntryForSelectedDate,
      setSelectedOriginalEntry,
      setParentObjectId,
      fetchNames,
    });

  const saveEditedEntry = () =>
    saveEditedEntryHandler({
      editingEntryId,
      selectedDate,
      notes,
      currentUserId,
      name,
      images,
      setIsCreateModalVisible,
      setIsEditing,
      setEditingEntryId,
      handleDayPress,
      fetchMarkedDates,
      fetchNames,
    });

  const saveEditedUpdateEntry = () =>
    saveEditedUpdateEntryHandler({
      editingEntryId,
      selectedDate,
      notes,
      currentUserId,
      images,
      setIsCreateModalVisible,
      setIsEditing,
      setEditingEntryId,
      handleDayPress,
      fetchMarkedDates,
    });

  const handleDeleteEntry = (entryId: string) =>
    deleteEntryHandler({
      entryId,
      selectedDate,
      setMarkedDates,
      setEntryForSelectedDate,
      setUpdateEntryForSelectedDate,
      handleDayPress,
    });

  const handleDeleteUpdateEntry = (entryId: string) =>
    deleteUpdateEntryHandler({
      entryId,
      selectedDate,
      setMarkedDates,
      handleDayPress,
    });

  const handleUpdate = () =>
    saveUpdateEntryHandler({
      parentObjectId,
      selectedDate,
      notes,
      images,
      currentUserId,
      setIsUpdateModalVisible,
      setMarkedDates,
      setSelectedOriginalEntry,
      setParentObjectId,
      setEntryForSelectedDate,
    });

  const handleEdit = (entry: EntryProps) => {
    setNotes(entry.notes);
    setImages(entry.images || []);
    setName(entry.name);
    setSelectedDate(entry.date);
    setIsCreateModalVisible(true);
    setIsEditing(true);
    setEditingEntryId(entry._id);
  };

  const handleEditUpdate = (entry: UpdateEntryProps) => {
    setNotes(entry.notes);
    setImages(entry.images || []);
    setSelectedDate(entry.date);
    setIsUpdateModalVisible(true);
    setIsEditing(true);
    setEditingEntryId(entry._id);
  };

  useEffect(() => {
    fetchAllEntries();
  }, [currentUserId]);

  return (
    <ScrollView
      contentContainerStyle={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {entries.length > 0 ? (
        entries.map((entry) => (
          <EntryDisplay
            key={entry._id}
            entry={entry}
            onEdit={handleEdit}
            onDelete={handleDeleteEntry}
            onEditUpdate={handleEditUpdate}
            onDeleteUpdate={handleDeleteUpdateEntry}
          />
        ))
      ) : (
        <Text>No entries available.</Text>
      )}

      <Modal
        visible={isCreateModalVisible}
        animationType="slide"
        onRequestClose={() => setIsCreateModalVisible(false)}
      >
        <View style={{ padding: 20 }}>
          <NotesAndImages
            name={name}
            setName={setName}
            notes={notes}
            setNotes={setNotes}
            images={images}
            setImages={setImages}
            saveEntry={saveEntry}
          />
          <Button
            title={isEditing ? 'Save Changes' : 'Save Entry'}
            onPress={isEditing ? saveEditedEntry : saveEntry}
          />
          <Button
            title="Close"
            onPress={() => {
              setIsCreateModalVisible(false);
              setIsEditing(false);
              setEditingEntryId(null);
            }}
          />
        </View>
      </Modal>
    </ScrollView>
  );
};

export default AllEntriesScreen;