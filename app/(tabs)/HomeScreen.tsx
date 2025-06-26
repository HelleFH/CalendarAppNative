import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { CalendarComponent } from '../../components/CalendarComponent';
import { EntryDisplay } from '../../components/EntryDisplay';
import { UpdateEntryDisplay } from '../../components/UpdateEntryDisplay';
import { fetchMarkedDates, fetchEntriesForDate } from '@/utils/api';
import { CreateEntryModal } from '@/components/CreateEntryModal';
import { CreateUpdateEntryModal } from '@/components/CreateUpdateEntryModal';
import { SelectEntryToUpdate } from '@/components/SelectEntryToUpdate';
import { useCurrentUser } from '@/components/CurrentUser';
import { useNames } from '@/components/UseNames';
import { SelectEntryForReminder } from '@/components/SelectEntryForReminder';
import { CreateReminderModal } from '@/components/CreateReminderModal';
import {
  saveEntryHandler,
  saveEditedEntryHandler,
  saveEditedUpdateEntryHandler,
  deleteEntryHandler,
  deleteUpdateEntryHandler,
  saveUpdateEntryHandler,
  saveReminderHandler,
  deleteReminderHandler
} from '@/utils/entryHandler';
import { ReminderDisplay } from '@/components/ReminderDisplay';

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
  parentObjectId?: string;  // For update entries, you might want to use this
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
  parentObjectId?: string;  // For update entries, you might want to use this
}
interface ReminderProps {
  _id: string;
  date: string;
  notes: string;
  parentObjectId?: string;  // For update entries, you might want to use this
}

const HomeScreen = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [name, setName] = useState<string>('');
  const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({});
  const [entryForSelectedDate, setEntryForSelectedDate] = useState<any>(null);
  const [updateEntryForSelectedDate, setUpdateEntryForSelectedDate] = useState<any>(null);
  const [reminderForSelectedDate, setReminderForSelectedDate] = useState<any>(null);

  const [selectedOriginalEntry, setSelectedOriginalEntry] = useState<any>(null);
  const [creatingUpdate, setCreatingUpdate] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [parentObjectId, setParentObjectId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const { currentUserId, isLoading } = useCurrentUser();
  const { allNames, fetchNames } = useNames(currentUserId);
  const [isReminderModalVisible, setIsReminderModalVisible] = useState(false);
  const [creatingReminder, setCreatingReminder] = useState(false);
const [reminderDate, setReminderDate] = useState<Date | undefined>(undefined);

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
      setMarkedDates(newMarked); // ✅ Update calendar dots
    } catch (err) {
      console.error('Error fetching entries:', err);
      setEntryForSelectedDate([]);
      setUpdateEntryForSelectedDate([]);
      setReminderForSelectedDate([]);

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
    setIsCreateModalVisible(true); // Reuse the modal
    setIsEditing(true);
    setEditingEntryId(entry._id);
  };

  const handleEditUpdate = (entry: UpdateEntryProps) => {
    setNotes(entry.notes);
    setImages(entry.images || []);
    setSelectedDate(entry.date);
    setIsUpdateModalVisible(true); // Reuse the modal
    setIsEditing(true);
    setEditingEntryId(entry._id);
  };


  const handleEditReminder = (entry: ReminderProps) => {
    setNotes(entry.notes);
    setSelectedDate(entry.date);
    setIsReminderModalVisible(true); // Reuse the modal
    setIsEditing(true);
    setEditingEntryId(entry._id);
  };
 const handleSaveReminder = () => {
  if (!reminderDate || !notes || !parentObjectId || !currentUserId) {
    alert('Please fill in all the required fields.');
    return;
  }

  saveReminderHandler({
selectedDate: reminderDate?.toISOString().split('T')[0] ?? '', // ✅ safe + typed
    notes,
    currentUserId,
    parentObjectId,
    setMarkedDates,
    setIsReminderModalVisible,
    setEntryForSelectedDate,
    setSelectedOriginalEntry,
    setParentObjectId,
    reminderDate: reminderDate.toISOString().split('T')[0],
  });
};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plant Calendar</Text>

      <CalendarComponent
        selectedDate={selectedDate}
        markedDates={markedDates}
        onDayPress={handleDayPress}
      />
      {Array.isArray(entryForSelectedDate) && entryForSelectedDate.length > 0 ? (
        entryForSelectedDate.map((entry, index) => (
          <EntryDisplay
            key={entry._id || index}
            entry={entry}
            onEdit={handleEdit}
            onEditUpdate={handleEditUpdate}
            onDelete={handleDeleteEntry}
            onDeleteUpdate={handleDeleteUpdateEntry}
          />
        ))
      ) : (
        <Text>No entries for selected date</Text>
      )}

      {Array.isArray(updateEntryForSelectedDate) && updateEntryForSelectedDate.length > 0 ? (
        updateEntryForSelectedDate.map((entry: UpdateEntry) => (
          <UpdateEntryDisplay
            key={entry._id}
            entry={{ ...entry, images: entry.images ?? [] }} // 👈 Ensures images is always string[]
            onEditUpdate={handleEditUpdate}
            onDeleteUpdate={handleDeleteUpdateEntry}
          />

        ))
      ) : (
        <Text>No update entries for selected date</Text>
      )}

      {Array.isArray(reminderForSelectedDate) && reminderForSelectedDate.length > 0 ? (
        reminderForSelectedDate.map((entry: Reminder) => (
          <ReminderDisplay
            key={entry._id}
            onEditReminder={handleEditReminder}
            onDeleteReminder={handleDeleteReminder}
            entry={entry}
          />
        ))
      ) : (
        <Text>No reminders for selected date</Text>
      )}


      <Button
        title="Create New Entry"
        disabled={!selectedDate}
        onPress={() => {
          setParentObjectId(null);
          setNotes('');
          setImages([]);
          setIsCreateModalVisible(true);
        }}
      />

      <Button title="Create Update" onPress={() => setIsUpdateModalVisible(true)} />


      {/* Create Entry Modal */}
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
        onClose={() => setIsUpdateModalVisible(false)}
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
      />

<CreateReminderModal
        visible={isReminderModalVisible}
        onClose={() => setIsReminderModalVisible(false)}
        saveReminder={(selectedDate) => {
          // handle the selectedDate here
          console.log('Reminder set for:', selectedDate);
          setIsReminderModalVisible(false);
        } }
        notes={notes}
        setNotes={setNotes}
        parentObjectId={parentObjectId}
        setParentObjectId={setParentObjectId}
        allNames={allNames} setReminderDate={function (date: Date | undefined): void {
          throw new Error('Function not implemented.');
        } }/>


 <Button
  title="Create Reminder"
  onPress={() => {
    setNotes('');
    setParentObjectId(null);
    setIsReminderModalVisible(true);
  }}
/>
      <Text>Reminders:</Text>
      {reminders.map((reminder, index) => (
        <Text key={index}>{`Reminder on ${reminder.date}: ${reminder.notes}`}</Text>
      ))}
      {selectedOriginalEntry && (
        <Button
          title="View Entry"
          onPress={() => setIsViewModalVisible(true)}
        />
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  modalContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
});

export default HomeScreen;