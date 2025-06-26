import React, { useState } from 'react';
import { Modal, View, Button, StyleSheet, TextInput, Text, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { AppIconButton } from './AppIconButton';

interface CreateReminderModalProps {
  visible: boolean;
  onClose: () => void;
  saveReminder: (date: Date) => void;
  notes: string;
  setNotes: (notes: string) => void;
  parentObjectId: string | null;
  setParentObjectId: (id: string | null) => void;
  allNames: { _id: string; name: string }[];
  setReminderDate: (date: Date | undefined) => void;
  reminderDate?: Date;
}
export const CreateReminderModal: React.FC<CreateReminderModalProps> = ({
  visible,
  onClose,
  saveReminder,
  notes,
  setNotes,
  parentObjectId,
  setParentObjectId,
  allNames,
  reminderDate,     
  setReminderDate,  
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSaveReminder = () => {
    if (notes.trim() === '') {
      alert('Please enter reminder notes.');
      return;
    }

    if (!reminderDate) {
      alert('Please select a reminder date.');
      return;
    }

    saveReminder(reminderDate);
    setNotes('');
    setParentObjectId(null);
    onClose();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || reminderDate;
    setShowDatePicker(false);
    setReminderDate(currentDate);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContent}>
        <Picker
          selectedValue={parentObjectId}
          onValueChange={(itemValue) => setParentObjectId(itemValue)}
        >
          <Picker.Item label="Select a plant" value="" />
          {allNames.map((entry) => (
            <Picker.Item key={entry._id} label={entry.name} value={entry._id} />
          ))}
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="Enter reminder notes"
          value={notes}
          onChangeText={setNotes}
        />

        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {reminderDate ? reminderDate.toLocaleDateString() : 'Select reminder date'}
          </Text>

          {/* Web fallback using native HTML input */}
          {Platform.OS === 'web' ? (
            <input
              type="date"
              onChange={(e) => {
                const selected = new Date(e.target.value + 'T00:00'); // Add time to ensure correct Date object
                setReminderDate(selected);
              }}
              style={{ marginBottom: 20, fontSize: 16, padding: 8 }}
            />
          ) : (
            <>
              <Button title="Pick a Date" onPress={() => setShowDatePicker(true)} />
              {showDatePicker && (
                <DateTimePicker
                  value={reminderDate ?? new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </>
          )}
        </View>

        <AppIconButton icon='save' label="Save Reminder" onPress={handleSaveReminder} />
        <AppIconButton icon='close' label="Close" onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  dateContainer: {
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    marginBottom: 10,
  },
});
