import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { AppIconButton } from './AppIconButton';
import { commonStyles } from '@/SharedStyles';
import { fetchAndSetParentEntry } from '@/utils/entryHandler';
import { EntryDetailModal } from './EntryDetailModal'; // ✅ make sure this is imported

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
  const [parentEntry, setParentEntry] = useState<EntryProps | null>(null);
  const [showParentModal, setShowParentModal] = useState(false); // ✅ new state

  useEffect(() => {
    fetchAndSetParentEntry(entry, setParentEntry);
  }, [entry.parentObjectId]);

  return (
    <View style={commonStyles.entryContainer}>
      {/* ✅ Make the name clickable */}
      {parentEntry?.name ? (
        <TouchableOpacity onPress={() => setShowParentModal(true)}>
          <Text style={[commonStyles.title, { color: 'blue' }]}>
            Reminder for {parentEntry.name}
          </Text>
        </TouchableOpacity>
      ) : (
        <Text style={commonStyles.title}>Loading...</Text>
      )}

      <Text >{entry.notes}</Text>

      <View style={commonStyles.buttonWrapper}>
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

      {/* ✅ Show modal when parent name is clicked */}
      {parentEntry && (
        <EntryDetailModal
          visible={showParentModal}
          entry={parentEntry}
          onClose={() => setShowParentModal(false)}
          onEditUpdate={() => { }} 
          onDeleteUpdate={() => { }}
          onDeleteEntry={() => { }}
          onEditEntry={() => { }} />
      )}

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
