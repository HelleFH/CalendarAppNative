import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { AppIconButton } from './AppIconButton';
import { sharedEntryStyles } from '@/SharedEntryStyles'; // Adjust path as needed
import { fetchAndSetParentEntry } from '@/utils/entryHandler';

interface ReminderProps {
  _id: string;
  date: string;
  notes: string;
  parentObjectId?: string;
}

interface ReminderDisplayProps {
  entry: ReminderProps;
  onEditReminder: (entry: ReminderProps) => void;
  onDeleteReminder: (entryId: string) => void;
}

export const ReminderDisplay: React.FC<ReminderDisplayProps> = ({
  entry,
  onEditReminder,
  onDeleteReminder,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [parentEntry, setParentEntry] = useState<{ name?: string } | null>(null);

  useEffect(() => {
    fetchAndSetParentEntry(entry, setParentEntry);
  }, [entry.parentObjectId]);

  return (
    <View style={sharedEntryStyles.entryContainer}>
      <Text style={sharedEntryStyles.title}>  {parentEntry?.name ? `Reminder for ${parentEntry.name}` : 'Loading...'}</Text>

      <Text style={sharedEntryStyles.notes}>{entry.notes}</Text>

      <View style={sharedEntryStyles.buttonWrapper}>
        <AppIconButton
          icon="pencil"
          label="Edit"
          onPress={() => onEditReminder(entry)}
          variant="edit"
        />
        <AppIconButton
          icon="remove"
          label="Delete"
          onPress={() => setShowDeleteModal(true)}
          variant="close"
        />
      </View>

      <DeleteConfirmationModal
        visible={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => {
          onDeleteReminder(entry._id);
          setShowDeleteModal(false);
        }}
        itemType="entry"
      />
    </View>
  );
};
