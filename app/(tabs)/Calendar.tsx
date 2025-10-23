import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { AppIconButton } from '@/components/AppIconButton';
import { CalendarComponent } from '../../components/CalendarComponent';
import { EntryDisplay } from '@/components/entry/EntryDisplay';
import { UpdateEntryDisplay } from '@/components/updateEntry/UpdateEntryDisplay';
import { ReminderDisplay } from '@/components/reminder/ReminderDisplay';
import { CreateEntryModal } from '@/components/entry/CreateEntryModal';
import { CreateUpdateEntryModal } from '@/components/updateEntry/CreateUpdateEntryModal';
import { CreateReminderModal } from '@/components/reminder/CreateReminderModal';
import { AddOptionsModal } from '@/components/AddOptionsModal';
import { commonStyles } from '@/styles/SharedStyles';
import { useEntries } from '@/hooks/useEntries';
import { TopMenu } from '@/components/TopMenu';
import { useCurrentUser } from '@/components/CurrentUser';
import { logoutUser } from '@/utils/auth';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/App';
import { deleteReminder } from '@/utils/api';
import { UpdateEntryProps } from '@/types/UpdateEntryProps';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';

interface EntryProps {
  _id: string;
  name: string;
  date: string;
  notes: string;
  images?: string[];
}

const HomeScreen = () => {
  const { currentUserId } = useCurrentUser();
  const [isAddOptionsVisible, setIsAddOptionsVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isReminderModalVisible, setIsReminderModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedOriginalEntry, setSelectedOriginalEntry] = useState<any>(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const today = new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(today);

  const [reminderDate, setReminderDate] = useState<Date | undefined>(undefined);
  const [editingUpdateEntry, setEditingUpdateEntry] = useState<UpdateEntryProps | null>(null);
  const {
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
    handleEditEntry,
    handleEditUpdate,
    handleEditReminder,
    notes,
    setNotes,
    images,
    setImages,
    name,
    setName,
    parentObjectId,
    setParentObjectId,
    allNames,
    handleUpdate,
  } = useEntries(currentUserId!);


  const handleEdit = (entry: EntryProps) => {
    setNotes(entry.notes);
    setImages(entry.images || []);
    setName(entry.name);
    setSelectedDate(entry.date);
    setIsCreateModalVisible(true);
    setIsEditing(true);
    setEditingEntryId(entry._id);
  };
  const [firstName, setFirstName] = useState<string | null>(null);


  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
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
        }}
      >     <Text>Hi, {firstName}</Text>
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

      {/* ➕ ADD BUTTON */}
      <View style={commonStyles.buttonWrapper}>
        <AppIconButton
          icon="add"
          label="Add"
          onPress={() => setIsAddOptionsVisible(true)}
          disabled={false}
        />
      </View>

      {/* ⚙️ ADD OPTIONS MODAL */}
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

      {Array.isArray(entryForSelectedDate) &&
        entryForSelectedDate.map((entry, i) => (
          <EntryDisplay
            key={entry._id || i}
            entry={entry}
            onDeleteEntry={handleDeleteEntry}
            onEditEntry={handleEdit}
            onEditUpdate={handleEditUpdate}
            onDeleteUpdate={handleDeleteUpdateEntry}
          />
        ))}

      {updateEntryForSelectedDate.map((update, i) => (
        <UpdateEntryDisplay
          key={update._id || i}
          entry={update}
          onEditUpdate={handleEditUpdate}
          onDeleteUpdate={handleDeleteUpdateEntry}
        />
      ))}

      {/* ⏰ REMINDERS */}
      {reminderForSelectedDate.map((reminder, i) => (
        <ReminderDisplay
          key={reminder._id || i}
          reminder={reminder}
          onEditReminder={handleEditReminder}
          onDeleteReminder={deleteReminder}
        />
      ))}
      <CreateEntryModal
        visible={isCreateModalVisible}
        onClose={() => {
          setIsCreateModalVisible(false);
          setIsEditing(false);
          setEditingEntryId(null);
        }}
        isEditing={isEditing}
        entryId={editingEntryId || undefined} // ✅ pass the actual id
        name={name}
        notes={notes}
        images={images}
        setName={setName}
        setNotes={setNotes}
        setImages={setImages}
        selectedDate={selectedDate}
        saveEditedEntry={saveEditedEntry} // from useEntries()
        saveEntry={saveEntry}
      />

      <CreateUpdateEntryModal
        visible={isUpdateModalVisible}
        onClose={() => setIsUpdateModalVisible(false)}
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
        isEditing={false}
        editingEntry={null}
        saveEntry={() =>
          handleUpdate({ parentObjectId, notes, images })
        }
      />

      <CreateReminderModal
        visible={isReminderModalVisible}
        onClose={() => setIsReminderModalVisible(false)}
        selectedDate={selectedDate}
        notes={notes}
        setNotes={setNotes}
        saveEntry={saveEntry} // or use saveReminderHandler if you have one
      />
    </ScrollView>
  );
};

export default HomeScreen;
