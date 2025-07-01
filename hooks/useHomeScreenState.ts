import { useState } from 'react';

export const useHomeScreenState = () => {
  return {
    reminders: useState([]),
    selectedDate: useState(''),
    notes: useState(''),
    images: useState([]),
    name: useState(''),
    markedDates: useState({}),
    entryForSelectedDate: useState(null),
    updateEntryForSelectedDate: useState(null),
    reminderForSelectedDate: useState(null),
    selectedOriginalEntry: useState(null),
    isUpdateModalVisible: useState(false),
    isViewModalVisible: useState(false),
    isCreateModalVisible: useState(false),
    parentObjectId: useState<string | null>(null),
    isEditing: useState(false),
    editingEntryId: useState<string | null>(null),
    isReminderModalVisible: useState(false),
    reminderDate: useState<Date | undefined>(undefined),
    isAddOptionsVisible: useState(false),
  };
};
