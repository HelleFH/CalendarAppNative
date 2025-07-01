import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { AppIconButton } from './AppIconButton';
import { sharedEntryStyles } from '@/SharedEntryStyles';
import { UpdateEntryDetailModal } from './UpdateEntryDetailModal'; 

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

  return (
    <View style={[sharedEntryStyles.container, sharedEntryStyles.updateContainer]}>
        <Text style={sharedEntryStyles.title}>{`Update for ${entry.date}`}</Text>
        <Text style={sharedEntryStyles.notes}>{entry.notes}</Text>
      <TouchableOpacity onPress={() => setShowDetailModal(true)} activeOpacity={0.7}>

        <ScrollView horizontal>
          {(entry.images ?? []).map((uri, idx) => (
            <Image key={idx} source={{ uri }} style={sharedEntryStyles.image} />
          ))}
        </ScrollView>
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
