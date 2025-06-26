import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';


interface Reminder {
  _id: string;
  name: string;
}

interface SelectEntryForReminderProps {
  creatingReminder: boolean;
  allNames: Reminder[];
  setSelectedOriginalEntry: (entry: Reminder) => void;
  setParentObjectId: (id: string) => void;
  setNotes: (notes: string) => void;
  setIsReminderModalVisible: (visible: boolean) => void;
  setReminderDate: (date: string) => void;
}

export const SelectEntryForReminder: React.FC<SelectEntryForReminderProps> = ({
  creatingReminder,
  allNames,
  setSelectedOriginalEntry,
  setNotes,
  setReminderDate,
  setParentObjectId,
  setIsReminderModalVisible,
}) => {
  const [selectedEntryId, setSelectedEntry] = useState<string>('');
  const [notes, setNotesInput] = useState<string>('');
  const [reminderDate, setReminderDateInput] = useState<string>('');

  if (!creatingReminder) return null;

  return (
    <View>
      <Text>Select an entry to update:</Text>
      <Picker
        selectedValue={selectedEntryId}
        onValueChange={(itemValue) => {
          const selectedEntry = allNames.find(entry => entry._id === itemValue);
          if (selectedEntry) {
            setSelectedOriginalEntry(selectedEntry);
            setParentObjectId(selectedEntry._id);
            setNotes('');
            setIsReminderModalVisible(true);
          }
        }}
      >
        {allNames.length === 0 ? (
          <Picker.Item label="No entries available" value="" />
        ) : (
          allNames.map(entry => (
            <Picker.Item key={entry._id} label={entry.name} value={entry._id} />
          ))
        )}
      </Picker>






    </View>
  );
};
