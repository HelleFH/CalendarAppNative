import React, { useState, useEffect } from 'react';
import { Modal, View, Button, TextInput, Text, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppIconButton } from '../AppIconButton';
import { commonStyles } from '@/styles/SharedStyles';
import { SelectEntryForReminder } from './SelectEntryForReminder';
import { BaseModal } from '../baseModal';
import { useTheme } from '@/styles/ThemeProvider'; // <-- import your hook

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
  const { theme } = useTheme(); // <-- get theme here

  const [showDatePicker, setShowDatePicker] = useState(false);

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
    <BaseModal
      visible={visible}
      onClose={onClose}
      title="Create a reminder for one of your plants"
      saveLabel="Save Reminder"
      onSave={handleSaveReminder}
      saveVariant="Edit"
    >
      <SelectEntryForReminder
        allNames={allNames}
        setParentObjectId={setParentObjectId}
        setNotes={setNotes}
        setImages={setImages}
        setName={setName}
        onEntrySelected={(id: string) => setParentObjectId(id)}
      />

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.md,
          padding: theme.spacing.sm,
          color: theme.colors.text,
          backgroundColor: theme.colors.background,
          marginBottom: theme.spacing.md,
        }}
        placeholder="Enter reminder notes"
        placeholderTextColor={theme.colors.placeholder}
        value={notes}
        onChangeText={setNotes}
      />

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
    </BaseModal>
  );
};
