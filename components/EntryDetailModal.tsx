import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, Text, Image, View } from 'react-native';
import { EntryDisplay } from './EntryDisplay';
import { commonStyles } from '@/SharedStyles';
import { sharedEntryStyles } from '@/SharedEntryStyles';
import { AppIconButton } from './AppIconButton';

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
            <Text style={sharedEntryStyles.title}>{entry.name}</Text>
            <Text style={sharedEntryStyles.notes}>{entry.notes}</Text>

            <ScrollView horizontal>
              {(entry.images ?? []).map((uri, idx) => (
                <Image key={idx} source={{ uri }} style={sharedEntryStyles.image} />
              ))}
            </ScrollView>

            {/* Display updates if any */}
            {updateEntries.length > 0 && (
              <>
                <Text style={[sharedEntryStyles.title, { marginTop: 20 }]}>Updates</Text>
                {updateEntries.map((update) => (
                  <View key={update._id} style={sharedEntryStyles.entryContainer}>
                    <Text style={sharedEntryStyles.notes}>{update.notes}</Text>
                    <ScrollView horizontal>
                      {(update.images ?? []).map((uri, idx) => (
                        <Image key={idx} source={{ uri }} style={sharedEntryStyles.image} />
                      ))}
                    </ScrollView>
                    <View style={sharedEntryStyles.buttonWrapper}>
                      <AppIconButton icon="pencil" label="Edit" onPress={() => onEditUpdate(update)} variant="edit" />
                      <AppIconButton icon="remove" label="Delete" onPress={() => onDeleteUpdate(update._id)} variant="delete" />
                    </View>
                  </View>
                ))}
              </>
            )}

            <View style={[sharedEntryStyles.buttonWrapper, { marginTop: 20 }]}>
              <AppIconButton icon="pencil" label="Edit Entry" onPress={() => {
                onEditEntry(entry);
                onClose();
              }} variant="edit" />
              <AppIconButton icon="remove" label="Delete Entry" onPress={() => onDeleteEntry(entry._id)} variant="delete" />
              <AppIconButton icon="close" label="Close" onPress={onClose} variant="close" />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
