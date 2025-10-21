import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { AppIconButton } from '@/components/AppIconButton';
import { CalendarComponent } from '@/components/CalendarComponent';
import { EntryDisplay } from '@/components/entry/EntryDisplay';
import { UpdateEntryDisplay } from '@/components/updateEntry/UpdateEntryDisplay';
import { ReminderDisplay } from '@/components/reminder/ReminderDisplay';
import { AddOptionsModal } from '@/components/AddOptionsModal';
import { useEntries } from '@/hooks/useEntries';
import { logoutUser } from '@/utils/auth';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/App';
import { commonStyles } from '@/styles/SharedStyles';
import { TopMenu } from '@/components/TopMenu';
import { auth, db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { CreateEntryModal } from '@/components/entry/CreateEntryModal';
import { CreateReminderModal } from '@/components/reminder/CreateReminderModal';
import { CreateUpdateEntryModal } from '@/components/updateEntry/CreateUpdateEntryModal';
import { useTheme } from '@/styles/ThemeProvider';

const Calendar = () => {
  const {
    currentUserId,
    selectedDate,
    markedDates,
    handleDayPress,
    entryForSelectedDate,
    updateEntryForSelectedDate,
    reminderForSelectedDate,
    saveEntry,
    saveEditedEntry,
    saveEditedUpdateEntry,
    handleDeleteEntry,
    handleDeleteUpdateEntry,
    handleUpdate,
    notes,
    setNotes,
    images,
    setImages,
    name,
    setName,
    handleEditEntry,
    handleEditUpdate,
    handleEditReminder,
    allNames
  } = useEntries();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme } = useTheme();

  // Modal visibility states
  const [isAddOptionsVisible, setIsAddOptionsVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isReminderModalVisible, setIsReminderModalVisible] = useState(false);

  // Editing states
  const [isEditing, setIsEditing] = useState(false);
  const [editingUpdateEntry, setEditingUpdateEntry] = useState<any>(null);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [parentObjectId, setParentObjectId] = useState<string | null>(null);
  const [reminderDate, setReminderDate] = useState<Date | undefined>(undefined);
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    const loadUserName = async () => {
      if (!currentUserId) return;
      try {
        const userRef = doc(db, 'users', currentUserId);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          setFirstName(data.firstName || null);
        }
      } catch (err) {
        console.warn('Failed to load user first name', err);
      }
    };
    loadUserName();
  }, [currentUserId]);

  const handleSaveReminder = (date: Date) => {
    console.log('Reminder saved for:', date);
    setIsReminderModalVisible(false);
  };
  // 👉 function declarations (this is what you asked for)
  const handleSaveEntry = async () => {
    try {
      await saveEntry(); // calls the hook’s saveEntry()
    } catch (err) {
      console.error('Error saving entry:', err);
    }
  };

  return (
    <ScrollView contentContainerStyle={commonStyles.appContainer}>
      <View
        style={{
          flex: 1,
          padding: 15,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: theme.colors.background,
        }}
      >
        <Text style={{ color: theme.colors.text }}>Hi, {firstName || 'Guest'}!</Text>
        <TopMenu
          navigation={navigation}
          currentUserId={currentUserId}
          onLogout={() => logoutUser(navigation)}
        />
      </View>

      <Text style={commonStyles.header}>Plant Calendar</Text>

      <CalendarComponent
        selectedDate={selectedDate}
        markedDates={markedDates}
        onDayPress={handleDayPress}
      />

      <AppIconButton
        icon="add"
        label="Add"
        onPress={() => setIsAddOptionsVisible(true)}
      />

      {entryForSelectedDate.map(entry => (
        <EntryDisplay
          key={entry._id}
          entry={entry}
          onEditEntry={handleEditEntry}
          onEditUpdate={handleEditUpdate}
          onDeleteEntry={handleDeleteEntry}
          onDeleteUpdate={handleDeleteUpdateEntry}
        />
      ))}

      {updateEntryForSelectedDate.map(entry => (
        <UpdateEntryDisplay
          key={entry._id}
          entry={entry}
          onEditUpdate={handleEditUpdate}
          onDeleteUpdate={handleDeleteUpdateEntry}
        />
      ))}

      {reminderForSelectedDate.map(rem => (
        <ReminderDisplay
          key={rem._id}
          reminder={rem}
          onEditReminder={handleEditReminder}
          onDeleteReminder={() => {}}
        />
      ))}

      {/* Add Options Modal */}
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

      {/* Create Entry Modal */}
          <CreateEntryModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        isEditing={isEditing}
        saveEntry={handleSaveEntry}   
        saveEditedEntry={saveEditedEntry}
        notes={notes}
        setNotes={setNotes}
        images={images}
        setImages={setImages}
        name={name}
        setName={setName}
        selectedDate={selectedDate}
      />
      {/* Update Entry Modal */}
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
  name={name}
  setName={setName}
  editingEntry={editingUpdateEntry} 
  allNames={allNames}
/>


      {/* Reminder Modal */}
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
        setName={setName}
        setImages={setImages}
      />
    </ScrollView>
  );
};

export default Calendar;
