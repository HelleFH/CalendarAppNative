import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { AppIconButton } from './AppIconButton';
import { sharedEntryStyles } from '@/SharedEntryStyles';
import { UpdateEntryDetailModal } from './UpdateEntryDetailModal';
import { Ionicons } from '@expo/vector-icons';
import { fetchEntryById } from '@/utils/api';
import { fetchAndSetParentEntry } from '@/utils/entryHandler';

interface UpdateEntryProps {
  _id: string;
  date: string;
  notes: string;
  images?: string[];
  parentObjectId?: string;
}

interface UpdateEntryDisplayProps {
  entry: UpdateEntryProps;
  onEditUpdate: (entry: UpdateEntryProps) => void;
  onDeleteUpdate: (entryId: string) => void;
}

export const UpdateEntryDisplay: React.FC<UpdateEntryDisplayProps> = ({
  entry,
  onEditUpdate,
  onDeleteUpdate,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [parentEntry, setParentEntry] = useState<{ name?: string } | null>(null);

  const images = entry.images ?? [];

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };
useEffect(() => {
  fetchAndSetParentEntry(entry, setParentEntry);
}, [entry.parentObjectId]);

  return (
    <View>
      <Text style={sharedEntryStyles.title}>  {parentEntry?.name ? `Update for ${parentEntry.name}` : 'Loading...'}
</Text>
      <Text style={sharedEntryStyles.notes}>{entry.notes}</Text>
      <TouchableOpacity onPress={() => setShowDetailModal(true)} activeOpacity={0.7}>

        {images.length > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
            {images.length > 1 && (
              <TouchableOpacity onPress={handlePrevImage}>
                <Ionicons name="chevron-back" size={24} color="black" />
              </TouchableOpacity>
            )}
            <Image source={{ uri: images[currentImageIndex] }} style={sharedEntryStyles.image} />
            {images.length > 1 && (
              <TouchableOpacity onPress={handleNextImage}>
                <Ionicons name="chevron-forward" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </TouchableOpacity>

      <View style={sharedEntryStyles.buttonWrapper}>
        <AppIconButton icon="pencil" label="Edit" onPress={() => onEditUpdate(entry)} variant="edit" />
        <AppIconButton icon="remove" label="Delete" onPress={() => setShowDeleteModal(true)} variant="delete" />
      </View>

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
        entry={entry}
        onClose={() => setShowDetailModal(false)}
        onEdit={onEditUpdate}
        onDelete={onDeleteUpdate}
      />
    </View>
  );
};
