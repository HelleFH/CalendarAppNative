import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DeleteConfirmationModal } from '../DeleteConfirmationModal';
import { AppIconButton } from '../AppIconButton';
import { commonStyles } from '@/styles/SharedStyles';
import { fetchAndSetParentEntry } from '@/utils/entryHandler';
import { EntryDetailModal } from '../entry/EntryDetailModal';
import { Ionicons } from '@expo/vector-icons';

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
    <View style={commonStyles.entryContainer}>
      {/* ✅ Make the name clickable */}
      {parentEntry?.name ? (
<View style={{ flexDirection: 'row', alignItems: 'center' }}>
  <Ionicons name="alarm-outline" size={20} />
  <Text style={commonStyles.subtitle}>
    Reminder for{' '}
    <Text
      style={[commonStyles.subtitle, { color: 'blue', textDecorationLine: 'underline' }]}
      onPress={() => setShowParentModal(true)}
    >
      {parentEntry.name}
    </Text>
  </Text>
</View>

        
      ) : (
        <Text style={commonStyles.title}>Loading...</Text>
      )}

      <Text   style={commonStyles.notes}>{reminder.notes}</Text>

      <View style={commonStyles.buttonWrapper}>
        <AppIconButton
          icon="pencil"
          label="Edit"
          onPress={() => onEditReminder(reminder)}
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
          onDeleteReminder(reminder._id);
          setShowDeleteModal(false);
        }}
        itemType="entry"
      />
    </View>
  );
};
