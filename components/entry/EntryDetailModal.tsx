import React, { useEffect, useState } from 'react';
import { Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EntryDisplay } from './EntryDisplay';
import { ThemedView } from '@/styles/ThemedView';
import { ThemedButton } from '@/styles/ThemedTouchable';
import { useTheme } from '@/styles/ThemeProvider';
import { ThemedScrollView } from '@/styles/ThemedScrollView';
import { BaseModal } from '../baseModal';

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
  const { theme } = useTheme();

  useEffect(() => {
    const fetchUpdates = async () => {
      if (!entry?._id) return;
      try {
        const response = await fetch(
          `https://calendarappnative.onrender.com/entries/update-entries/by-parent/${entry._id}`
        );
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
<BaseModal
  visible={visible}
  onClose={onClose}
  title={entry.name} 
>
    <EntryDisplay
      key={entry._id}
      entry={entry}
      onEditUpdate={onEditUpdate}
      onDeleteUpdate={onDeleteUpdate}
      onDeleteEntry={onDeleteEntry}
      onEditEntry={onEditEntry}
      disableDetailModal={true}
      onRequestCloseModal={onClose}
    />

    {updateEntries.map((update) => (
      <EntryDisplay
        key={update._id}
        entry={update as EntryProps}
        onEditUpdate={onEditUpdate}
        onDeleteUpdate={onDeleteUpdate}
        onDeleteEntry={onDeleteEntry}
        onEditEntry={onEditEntry}
        disableDetailModal={true}
        onRequestCloseModal={onClose}
      />
    ))}
</BaseModal>

  );
};
