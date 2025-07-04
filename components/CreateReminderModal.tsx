import React, { useState, useEffect } from 'react';
import { Modal, View, Button, StyleSheet, TextInput, Text, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppIconButton } from './AppIconButton';
import { commonStyles } from '@/SharedStyles';
import { SelectEntryForReminder } from './SelectEntryForReminder';
import { formStyles } from '@/FormStyles';

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
  setName: (n: string) => void;
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
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
  setName,
  setImages,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Set today's date by default when modal opens and reminderDate not set
  useEffect(() => {
    if (visible && !reminderDate) {
      setReminderDate(new Date());
    }
  }, [visible, reminderDate, setReminderDate]);

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
    setShowDatePicker(false);
    if (selectedDate) {
      setReminderDate(selectedDate);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={commonStyles.entryContainer}>
        <SelectEntryForReminder
          allNames={allNames}
          setParentObjectId={setParentObjectId}
          setNotes={setNotes}
          setImages={setImages}
          setName={setName}
          onEntrySelected={(id: string) => setParentObjectId(id)}
        />
        <TextInput
          style={formStyles.input}
          placeholder="Enter reminder notes"
          value={notes}
          onChangeText={setNotes}
        />

        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, marginBottom: 10 }}>
            {reminderDate ? reminderDate.toLocaleDateString() : 'Select reminder date'}
          </Text>

          {Platform.OS === 'web' ? (
            <input
              type="date"
              value={reminderDate ? reminderDate.toISOString().substring(0, 10) : ''}
              onChange={(e) => {
                const selected = new Date(e.target.value + 'T00:00');
                setReminderDate(selected);
              }}
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

        <AppIconButton icon="save" label="Save Reminder" onPress={handleSaveReminder} variant="edit" />
        <AppIconButton icon="close" label="Close" onPress={onClose} variant="close" />
      </View>
    </Modal>
  );
};
