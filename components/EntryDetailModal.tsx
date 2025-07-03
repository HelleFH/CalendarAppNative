import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, Text, Image, View } from 'react-native';
import { commonStyles } from '@/SharedStyles';
import { sharedEntryStyles } from '@/SharedEntryStyles';
import { AppIconButton } from './AppIconButton';
import { EntryDisplay } from './EntryDisplay';

interface EntryProps {
  _id: string;
  name: string;
  date: string;
  notes: string;
  images?: string[];
}

interface UpdateEntryProps {
  _id: string;
  date: string;
  notes: string;
  images?: string[];
  parentObjectId?: string;
}

interface EntryDetailModalProps {
  visible: boolean;
  entry: EntryProps | null;
  onClose: () => void;
  onEditUpdate: (entry: UpdateEntryProps) => void;
  onDeleteUpdate: (entryId: string) => void;
  onEditEntry: (entry: EntryProps) => void;
  onDeleteEntry: (entryId: string) => void;
}

export const EntryDetailModal: React.FC<EntryDetailModalProps> = ({
  visible,
  entry,
  onClose,
  onEditUpdate,
  onDeleteUpdate,
  onEditEntry,
  onDeleteEntry,
}) => {
  const [updateEntries, setUpdateEntries] = useState<UpdateEntryProps[]>([]);

  useEffect(() => {
    const fetchUpdates = async () => {
      if (!entry?._id) return;
      try {
        const response = await fetch(`https://calendarappnative.onrender.com/updates/${entry._id}`);
        const data: UpdateEntryProps[] = await response.json();
        setUpdateEntries(data);
      } catch (err) {
        console.error('Failed to fetch updates:', err);
      }
    };
    fetchUpdates();
  }, [entry]);

  if (!entry) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={commonStyles.modalOverlay}>
        <View style={commonStyles.modalContainer}>
          <ScrollView contentContainerStyle={commonStyles.modalContent}>
  <EntryDisplay
    entry={entry}
    onEditEntry={onEditEntry}
    onDeleteEntry={onDeleteEntry}
    onEditUpdate={onEditUpdate}
    onDeleteUpdate={onDeleteUpdate}
    showUpdatesInline={true} 

    
  />        
              <AppIconButton icon="close" label="Close" onPress={onClose} variant="close" />
      </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
