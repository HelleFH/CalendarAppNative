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
<CardWithActions
  title={`Update for ${parentEntry?.name} (${entry.date})`}
  notes={entry.notes}
  images={entry.images ?? []}
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

  );
};
