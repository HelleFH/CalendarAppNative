import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Button } from 'react-native';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { AppIconButton } from './AppIconButton';

interface ReminderProps {
  _id: string;
  date: string;
  notes: string;
  parentObjectId?: string;  
}

interface ReminderDisplayProps {
  entry: {
    _id: string;
    date: string;
    notes: string;
    parentObjectId?: string;
  };
  onEditReminder: (entry: ReminderProps) => void;
  onDeleteReminder: (entryId: string) => void; 
}

export const ReminderDisplay: React.FC<ReminderDisplayProps> = ({

  entry,
  onEditReminder,
  onDeleteReminder,
}) => {

  const [showDeleteModal, setShowDeleteModal] = useState(false); // ✅ State


  return (
    <View style={[styles.container && styles.updateContainer]}>
      <Text style={styles.title}>{`Reminder for ${entry.date}`}</Text>
      <Text style={styles.notes}>{entry.notes}</Text>
     
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
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
  console.log('entry:', entry);
  console.log('entry._id:', entry._id);
  onDeleteReminder(entry._id);
  setShowDeleteModal(false);
}}
        itemType="entry"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F0F8FF',
    borderRadius: 10,
  },
  updateContainer: {
    backgroundColor: '#E8F7FD', 
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  name: {
    fontStyle: 'italic',
    marginBottom: 5,
  },
  notes: {
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
});