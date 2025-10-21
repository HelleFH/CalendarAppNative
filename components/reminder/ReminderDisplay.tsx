import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DeleteConfirmationModal } from '../DeleteConfirmationModal';
import { AppIconButton } from '../AppIconButton';
import { commonStyles } from '@/styles/SharedStyles';
import { fetchAndSetParentEntry } from '@/utils/entryHandler';
import { EntryDetailModal } from '../entry/EntryDetailModal';
import { Ionicons } from '@expo/vector-icons';
import { CardWithActions } from '../CardWithActions';

interface ReminderProps {
  _id: string;
  date: string;
  notes: string;
  parentObjectId?: string;
}

interface EntryProps {
  _id: string;
  name: string;
  date: string;
  notes: string;
  images?: string[];
}

interface ReminderDisplayProps {
  reminder: ReminderProps;
  onEditReminder: (entry: ReminderProps) => void;
  onDeleteReminder: (entryId: string) => void;
}

export const ReminderDisplay: React.FC<ReminderDisplayProps> = ({
  reminder,
  onEditReminder,
  onDeleteReminder,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [parentEntry, setParentEntry] = useState<EntryProps | null>(null);
  const [showParentModal, setShowParentModal] = useState(false); // ✅ new state

useEffect(() => {
  if (reminder?.parentObjectId) {
    fetchAndSetParentEntry(reminder, setParentEntry);
  }
}, [reminder?.parentObjectId]);

  return (
<CardWithActions
  title={`Reminder for ${parentEntry?.name}`}
  notes={reminder.notes}
  onEdit={() => onEditReminder(reminder)}
  onDelete={() => onDeleteReminder(reminder._id)}
  detailModal={
    parentEntry && (
      <EntryDetailModal
        visible={showParentModal}
        entry={parentEntry}
        onClose={() => setShowParentModal(false)}
        onEditUpdate={() => {}}
        onDeleteUpdate={() => {}}
        onDeleteEntry={() => {}}
        onEditEntry={() => {}}
      />
    )
  }
/>

  );
};
