import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { DeleteConfirmationModal } from '../DeleteConfirmationModal';
import { AppIconButton } from '../AppIconButton';
import { commonStyles } from '@/styles/SharedStyles';
import { UpdateEntryDetailModal } from './UpdateEntryDetailModal';
import { Ionicons } from '@expo/vector-icons';
import { fetchAndSetParentEntry } from '@/utils/entryHandler';
import { EntryDetailModal } from '../entry/EntryDetailModal';
import { CardWithActions } from '../CardWithActions';
import { useTheme } from '@/styles/ThemeProvider';

interface UpdateEntryProps {
  _id: string;
  date: string;
  notes: string;
  images?: string[];
  parentObjectId?: string;
}
interface EntryProps {
  _id: string;
  name: string;
  date: string;
  notes: string;
  images?: string[];
}
interface UpdateEntryDisplayProps {
  entry: UpdateEntryProps;
  onEditUpdate: (entry: UpdateEntryProps) => void;
  onDeleteUpdate: (entryId: string) => void;
  disableDetailModal?: boolean;
  fetchNames?: () => Promise<void>;
  setEditingEntryId?: React.Dispatch<React.SetStateAction<string | null>>;
  parentEntryName?: string;
  setParentObjectId?: React.Dispatch<React.SetStateAction<string | null>>;
  onRefreshEntries?: () => void;
  onRequestCloseModal?: () => void;
}

export const UpdateEntryDisplay: React.FC<UpdateEntryDisplayProps> = ({
  entry,
  onEditUpdate,
  onDeleteUpdate,
  disableDetailModal = false,
  setEditingEntryId,
  parentEntryName,
  onRequestCloseModal,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [parentEntry, setParentEntry] = useState<EntryProps | null>(null);

  const images = entry.images ?? [];
  const { theme } = useTheme();

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (parentEntryName) {
      setParentEntry({
        _id: entry.parentObjectId || 'unknown',
        name: parentEntryName,
        date: '',
        notes: '',
        images: [],
      });
    } else {
      fetchAndSetParentEntry(entry, setParentEntry);
    }
  }, [entry.parentObjectId, parentEntryName]);

useEffect(() => {
  if (entry?.parentObjectId) {
    fetchAndSetParentEntry(entry, setParentEntry);
  }
}, [entry?.parentObjectId]);
return (
  <>
      <View style={commonStyles.container}>
  
 <CardWithActions
  title={
    <Text style={{ fontSize: theme.fontSize.lg, color: theme.colors.text, fontWeight: 'bold' }}>
      Update for{' '}
      {parentEntry?.name ? (
        <Text
          style={{ color: '#1E90FF', textDecorationLine: 'underline' }}
          onPress={() => setShowEntryModal(true)}
        >
          {parentEntry.name}
        </Text>
      ) : 'Unknown Parent'}{' '}
      ({entry.date})
    </Text>
  }
  notes={entry.notes}
  images={entry.images ?? []}
  onPress={() => setShowEntryModal(true)}
  onEdit={() => {
    onEditUpdate(entry);
    setEditingEntryId?.(entry._id);
    onRequestCloseModal?.();
  }}
  onDelete={() => onDeleteUpdate(entry._id)}
  detailModal={
    <UpdateEntryDetailModal
      visible={showDetailModal}
      entry={entry}
      onClose={() => setShowDetailModal(false)}
      onEditUpdate={onEditUpdate}
      onDeleteUpdate={onDeleteUpdate}
    />
  }
/>


    {parentEntry && (
      <EntryDetailModal
        visible={showEntryModal}
        entry={parentEntry}
        onClose={() => setShowEntryModal(false)}
        onEditUpdate={onEditUpdate}
        onDeleteUpdate={onDeleteUpdate}
        onDeleteEntry={() => {}}
        onEditEntry={() => {}}
      />
    )}
      </View >

  </>
);

};
