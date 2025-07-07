import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { DeleteConfirmationModal } from '../DeleteConfirmationModal';
import { AppIconButton } from '../AppIconButton';
import { commonStyles } from '@/styles/SharedStyles';
import { UpdateEntryDetailModal } from './UpdateEntryDetailModal';
import { Ionicons } from '@expo/vector-icons';
import { fetchAndSetParentEntry } from '@/utils/entryHandler';
import { EntryDetailModal } from '../entry/EntryDetailModal';

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

  return (
    <View >
      {parentEntry?.name ? (
       <Text style={commonStyles.title}>
  Update for{' '}
  <Text
    style={[commonStyles.title, { textDecorationLine: 'underline', color: 'blue' }]}
    onPress={() => setShowEntryModal(true)}
  >
    {parentEntry.name}
  </Text>{' '}
  ({entry.date})
</Text>
      ) : (
        <Text style={commonStyles.title}>Loading...</Text>
      )}

      <Text style={commonStyles.notes}>{entry.notes}</Text>

      <TouchableOpacity
        onPress={() => {
          if (!disableDetailModal) setShowDetailModal(true);
        }}
        activeOpacity={0.7}
      >
        {images.length > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
            {images.length > 1 && (
              <TouchableOpacity onPress={handlePrevImage}>
                <Ionicons name="chevron-back" size={24} color="black" />
              </TouchableOpacity>
            )}
            <Image source={{ uri: images[currentImageIndex] }} style={commonStyles.image} />
            {images.length > 1 && (
              <TouchableOpacity onPress={handleNextImage}>
                <Ionicons name="chevron-forward" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </TouchableOpacity>

      <View style={commonStyles.buttonWrapper}>
        <AppIconButton
          icon="pencil"
          label="Edit"
          onPress={() => {
            onEditUpdate(entry);
            setEditingEntryId?.(entry._id);
            onRequestCloseModal?.();
          }}
          variant="edit"
        />
        <AppIconButton
          icon="remove"
          label="Delete"
          onPress={() => setShowDeleteModal(true)}
          variant="delete"
        />
      </View>

      {parentEntry && (
        <EntryDetailModal
          visible={showEntryModal}
          entry={parentEntry}
          onClose={() => setShowEntryModal(false)}
          onEditUpdate={onEditUpdate}
          onDeleteUpdate={onDeleteUpdate}
          onDeleteEntry={() => { }}
          onEditEntry={() => { }}
        />
      )}

      <DeleteConfirmationModal
        visible={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => {
          onDeleteUpdate(entry._id);
          setShowDeleteModal(false);
        }}
        itemType="update"
      />

      <UpdateEntryDetailModal
        visible={showDetailModal}
        entry={{
          ...entry,
          name: parentEntry?.name || 'Unknown',
        }}
        onClose={() => setShowDetailModal(false)}
        onEditUpdate={onEditUpdate}
        onDeleteUpdate={onDeleteUpdate}
      />
    </View>
  );
};
