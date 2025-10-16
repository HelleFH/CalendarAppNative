import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { AppIconButton } from '@/components/AppIconButton';
import { CalendarComponent } from '@/components/CalendarComponent';
import { EntryDisplay } from '@/components/entry/EntryDisplay';
import { UpdateEntryDisplay } from '@/components/updateEntry/UpdateEntryDisplay';
import { ReminderDisplay } from '@/components/reminder/ReminderDisplay';
import { AddOptionsModal } from '@/components/AddOptionsModal';
import { CreateEntryModal } from '@/components/entry/CreateEntryModal';
import { CreateUpdateEntryModal } from '@/components/updateEntry/CreateUpdateEntryModal';
import { CreateReminderModal } from '@/components/reminder/CreateReminderModal';
import { useEntries } from '@/hooks/useEntries';
import { logoutUser } from '@/utils/auth';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/App';
import { NavigationProp } from '@react-navigation/native';
import { commonStyles } from '@/styles/SharedStyles';

const HomeScreen = () => {
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

  } = useEntries();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isAddOptionsVisible, setIsAddOptionsVisible] = useState(false);

  return (
    <ScrollView contentContainerStyle={commonStyles.appContainer}>
      <AppIconButton
        icon={currentUserId ? 'log-out-outline' : 'log-in-outline'}
        label={currentUserId ? 'Log out' : 'Log in'}
        onPress={() => currentUserId ? logoutUser(navigation) : navigation.navigate('LoginScreen')}
      />

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
          onDeleteReminder={() => {/* optional: add deleteReminderHandler here */ }}
        />
      ))}

      <AddOptionsModal
        visible={isAddOptionsVisible}
        onClose={() => setIsAddOptionsVisible(false)}
        onAddEntry={() => { }}
        onAddUpdate={() => { }}
        onAddReminder={() => { }}
      />
    </ScrollView>
  );
};

export default HomeScreen;
