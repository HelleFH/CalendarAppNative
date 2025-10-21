import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { UpdateEntryDisplay } from '../updateEntry/UpdateEntryDisplay';
import { DeleteConfirmationModal } from '../DeleteConfirmationModal';
import { AppIconButton } from '../AppIconButton';
import { EntryDetailModal } from './EntryDetailModal';
import { commonStyles } from '@/styles/SharedStyles';
import { Ionicons } from '@expo/vector-icons';
import { ReminderDisplay } from '../reminder/ReminderDisplay';
import { fetchUpdateEntriesByParent, fetchRemindersByParent } from '@/utils/api';
import { CardWithActions } from '../CardWithActions';

interface EntryProps {
  _id: string;
  name: string;
  date: string;
  notes: string;
  images?: string[];
}
interface ReminderProps {
  _id: string;
  date: string;
  notes: string;
  parentObjectId?: string;
}
interface EntryDisplayProps {
  entry: EntryProps;
  onEditEntry: (entry: EntryProps) => void;
  onEditUpdate: (entry: UpdateEntryProps) => void;
  onDeleteEntry: (id: string) => void;
  onDeleteUpdate: (id: string) => void;
  onPress?: () => void;
  showUpdatesInline?: boolean;
  disableDetailModal?: boolean;
 testID?: string;
   onRequestCloseModal?: () => void;
  updateEntries?: UpdateEntryProps[];
}
interface UpdateEntryProps {
  _id: string;
  date: string;
  notes: string;
  images?: string[];
  parentObjectId?: string;
   testID?: string;
}

export const EntryDisplay: React.FC<EntryDisplayProps> = ({
  entry,
  onEditEntry,
  onDeleteEntry,
  onEditUpdate,
  onDeleteUpdate,

 testID
}) => {

  const [updateEntries, setUpdateEntries] = useState<UpdateEntryProps[]>([]);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showUpdateList, setShowUpdateList] = useState(false);
  const [reminders, setReminders] = useState<ReminderProps[]>([]);

useEffect(() => {
  const loadUpdateEntries = async () => {
    if (!entry._id) return;

    try {
      const updates = await fetchUpdateEntriesByParent(entry._id);
      setUpdateEntries(updates);
    } catch (err) {
      console.error('Error loading update entries:', err);
    }
  };

  loadUpdateEntries();
}, [entry._id]);

useEffect(() => {
  const loadReminders = async () => {
    if (!entry._id) return;

    try {
      const fetchedReminders = await fetchRemindersByParent(entry._id);
      setReminders(fetchedReminders);
    } catch (err) {
      console.error('Error loading reminders:', err);
    }
  };

  loadReminders();
}, [entry._id]);


  return (
<CardWithActions
  title={`${entry.name} (${entry.date})`}
  subtitle={entry.name}
  notes={entry.notes}
  images={entry.images ?? []}
  onEdit={() => onEditEntry(entry)}
  onDelete={() => onDeleteEntry(entry._id)}
  extraActions={
    updateEntries.length > 0 && (
      <TouchableOpacity onPress={() => setShowUpdateList((prev) => !prev)}>
        <Text style={commonStyles.link}>
          <Ionicons name="eye" size={16} color="#1E90FF" style={commonStyles.icon} />
          {showUpdateList ? 'Hide Updates' : 'View Updates'}
        </Text>
      </TouchableOpacity>
    )
  }
  detailModal={
    <EntryDetailModal
      visible={showEntryModal}
      entry={entry}
      onClose={() => setShowEntryModal(false)}
      onEditUpdate={onEditUpdate}
      onDeleteUpdate={onDeleteUpdate}
      onDeleteEntry={onDeleteEntry}
      onEditEntry={onEditEntry}
    />
  }
/>

  );
};
