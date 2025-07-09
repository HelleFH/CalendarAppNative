import React, { useEffect, useState } from 'react';
import {  Text, ScrollView, RefreshControl } from 'react-native';
import { EntryDisplay } from '@/components/entry/EntryDisplay';

import {
  saveEntryHandler,
  saveEditedEntryHandler,
  saveEditedUpdateEntryHandler,
  deleteEntryHandler,
  deleteUpdateEntryHandler,
  saveUpdateEntryHandler,
  fetchAllEntriesHandler
} from '@/utils/entryHandler';
import { useNames } from '@/utils/api';
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
  if (currentUserId) {
    await fetchAllEntriesHandler({ userId: currentUserId, setEntries });
  }
};

  const onRefresh = async () => {
    setRefreshing(true);
  };

  const handleDayPress = () => {
  };

  const fetchMarkedDates = () => {
  };

  const saveEntry = (dateString: string) =>
    saveEntryHandler({
      selectedDate: dateString,
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
      handleDayPress,
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
            onEditUpdate={handleEditUpdate}
            onDeleteUpdate={handleDeleteUpdateEntry}
            onEditEntry={handleEdit}
            onDeleteEntry={handleDeleteEntry} />
        ))
      ) : (
        <Text>No entries available.</Text>
      )}

   
    </ScrollView>
  );
};

export default AllEntriesScreen;