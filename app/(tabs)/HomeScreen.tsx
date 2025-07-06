import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AppIconButton } from '@/components/AppIconButton';
import { CalendarComponent } from '../../components/CalendarComponent';
import { EntryDisplay } from '../../components/EntryDisplay';
import { UpdateEntryDisplay } from '../../components/UpdateEntryDisplay';
import { fetchMarkedDates, fetchEntriesForDate } from '@/utils/api';
import { CreateEntryModal } from '@/components/CreateEntryModal';
import { CreateUpdateEntryModal } from '@/components/CreateUpdateEntryModal';
import { useCurrentUser } from '@/components/CurrentUser';
import { useNames } from '@/components/UseNames';
import { CreateReminderModal } from '@/components/CreateReminderModal';
import {
  saveEntryHandler,
  saveEditedEntryHandler,
  saveEditedUpdateEntryHandler,
  deleteEntryHandler,
  deleteUpdateEntryHandler,
  saveUpdateEntryHandler,
  saveReminderHandler,
  deleteReminderHandler,
} from '@/utils/entryHandler';
import { ReminderDisplay } from '@/components/ReminderDisplay';
import { AddOptionsModal } from '@/components/AddOptionsModal';
import { commonStyles } from '@/SharedStyles';

interface Reminder {
  _id: string;
  date: string;
  notes: string;
  parentObjectId?: string;
}

interface UpdateEntry {
  _id: string;
  date: string;
  notes: string;
  images?: string[];
  parentObjectId?: string;
}

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

interface ReminderProps {
  _id: string;
  date: string;
  notes: string;
  parentObjectId?: string;
}

const HomeScreen = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [notes, setNotes] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [name, setName] = useState<string>('');
  const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({});
  const [entryForSelectedDate, setEntryForSelectedDate] = useState<any>(null);
  const [updateEntryForSelectedDate, setUpdateEntryForSelectedDate] = useState<any>(null);
  const [reminderForSelectedDate, setReminderForSelectedDate] = useState<any>(null);
  const [selectedOriginalEntry, setSelectedOriginalEntry] = useState<any>(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [parentObjectId, setParentObjectId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const { currentUserId } = useCurrentUser();
  const { allNames, fetchNames } = useNames(currentUserId);
  const [isReminderModalVisible, setIsReminderModalVisible] = useState(false);
  const [reminderDate, setReminderDate] = useState<Date | undefined>(undefined);
  const [isAddOptionsVisible, setIsAddOptionsVisible] = useState(false);
  const [editingUpdateEntry, setEditingUpdateEntry] = useState<UpdateEntryProps | null>(null);

  const handleDayPress = async (day: any) => {
    setSelectedDate(day.dateString);
    setEntryForSelectedDate([]);
    setUpdateEntryForSelectedDate([]);
    setReminderForSelectedDate([]);
    setNotes('');
    setImages([]);

    if (!currentUserId) return;

    try {
const { originalEntries, updateEntries, reminders } = await fetchEntriesForDate(currentUserId, day.dateString);
      setEntryForSelectedDate(originalEntries);
      setUpdateEntryForSelectedDate(updateEntries);
      setReminderForSelectedDate(reminders);

      const newMarked = await fetchMarkedDates(currentUserId);
      setMarkedDates(newMarked);
    } catch (err) {
      console.error('Error fetching entries:', err);
    }
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

  const handleDeleteReminder = (reminderId: string) => {
    if (!currentUserId) {
      alert('User ID not available.');
      return;
    }

    deleteReminderHandler({
      reminderId,
      onSuccess: async () => {
        const newMarked = await fetchMarkedDates(currentUserId);
        setMarkedDates(newMarked);
        handleDayPress({ dateString: selectedDate });
      },
    });
  };

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
    setIsEditing(true);
    setEditingEntryId(entry._id);
    setEditingUpdateEntry(entry);
    setIsUpdateModalVisible(true);
  };

  const handleEditReminder = (entry: ReminderProps) => {
    setNotes(entry.notes);
    setSelectedDate(entry.date);
    setIsReminderModalVisible(true);
    setIsEditing(true);
    setEditingEntryId(entry._id);
  };

  const handleSaveReminder = (reminderDate: Date) => {
    if (!reminderDate || !notes || !parentObjectId || !currentUserId) {
      alert('Please fill in all the required fields.');
      return;
    }

    saveReminderHandler({
      date: reminderDate.toISOString().split('T')[0],
      notes,
      currentUserId,
      parentObjectId,
      setMarkedDates,
      setIsReminderModalVisible,
      setEntryForSelectedDate,
      setSelectedOriginalEntry,
      setParentObjectId,
      fetchNames,
    });
  };

  useEffect(() => {
    handleDayPress({ dateString: today });
  }, [currentUserId]);

  return (
<ScrollView contentContainerStyle={commonStyles.appContainer}>
      <Text style={commonStyles.title}>Plant Calendar</Text>

      <CalendarComponent
        selectedDate={selectedDate}
        markedDates={markedDates}
        onDayPress={handleDayPress}
      />
      <View style={commonStyles.buttonWrapper}>
        <AppIconButton
          icon="add"
          label="Add"
          onPress={() => setIsAddOptionsVisible(true)}
          disabled={false}
          variant="secondary"
        />
      </View>
      {Array.isArray(entryForSelectedDate) &&
        entryForSelectedDate.map((entry, index) => (
          <EntryDisplay
            key={entry._id || index}
            entry={entry}
            onEditEntry={handleEdit}
            onEditUpdate={handleEditUpdate}
            onDeleteEntry={handleDeleteEntry}
            onDeleteUpdate={handleDeleteUpdateEntry}
            onPress={() => setIsViewModalVisible(true)}
            showUpdatesInline={false}
          />
        ))}

      {Array.isArray(updateEntryForSelectedDate) &&
        updateEntryForSelectedDate.map((entry: UpdateEntry) => (
          <UpdateEntryDisplay
            key={entry._id}
            entry={{ ...entry, images: entry.images ?? [] }}
            onEditUpdate={handleEditUpdate}
            onDeleteUpdate={handleDeleteUpdateEntry}
          />
        ))}

      {Array.isArray(reminderForSelectedDate) &&
        reminderForSelectedDate.map((entry: Reminder) => (
          <ReminderDisplay
            key={entry._id}
            onEditReminder={handleEditReminder}
            onDeleteReminder={handleDeleteReminder}
            reminder={entry}
          />
        ))}



      {selectedOriginalEntry && (
        <View style={commonStyles.buttonWrapper}>
          <AppIconButton
            label="View Entry"
            icon="eye-outline"
            onPress={() => setIsViewModalVisible(true)}
            variant="secondary"
          />
        </View>
      )}

      <CreateEntryModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        isEditing={isEditing}
        saveEntry={saveEntry}
        saveEditedEntry={saveEditedEntry}
        notes={notes}
        setNotes={setNotes}
        images={images}
        setImages={setImages}
        name={name}
        setName={setName}
      />

      <CreateUpdateEntryModal
        visible={isUpdateModalVisible}
        onClose={() => {
          setIsUpdateModalVisible(false);
          setIsEditing(false);
          setEditingUpdateEntry(null);
          setEditingEntryId(null);
        }}
        isEditing={isEditing}
        saveEntry={handleUpdate}
        saveEditedUpdateEntry={saveEditedUpdateEntry}
        notes={notes}
        setNotes={setNotes}
        images={images}
        setImages={setImages}
        parentObjectId={parentObjectId}
        setParentObjectId={setParentObjectId}
        allNames={allNames}
        name={name}
        setName={setName}
        editingEntry={editingUpdateEntry}
      />

      <CreateReminderModal
        visible={isReminderModalVisible}
        onClose={() => setIsReminderModalVisible(false)}
        saveReminder={handleSaveReminder}
        notes={notes}
        setNotes={setNotes}
        parentObjectId={parentObjectId}
        setParentObjectId={setParentObjectId}
        allNames={allNames}
        setReminderDate={setReminderDate}
        reminderDate={reminderDate}
      />

      {reminders.map((reminder, index) => (
        <Text key={index}>
          {`Reminder on ${reminder.date}: ${reminder.notes}`}
        </Text>
      ))}

      <AddOptionsModal
        visible={isAddOptionsVisible}
        onClose={() => setIsAddOptionsVisible(false)}
        onAddEntry={() => {
          setIsAddOptionsVisible(false);
          setParentObjectId(null);
          setNotes('');
          setImages([]);
          setIsCreateModalVisible(true);
        }}
        onAddUpdate={() => {
          setIsAddOptionsVisible(false);
          setNotes('');
          setImages([]);
          setIsUpdateModalVisible(true);
        }}
        onAddReminder={() => {
          setIsAddOptionsVisible(false);
          setNotes('');
          setParentObjectId(null);
          setIsReminderModalVisible(true);
        }}
      />
</ScrollView>
  );
};


export default HomeScreen;