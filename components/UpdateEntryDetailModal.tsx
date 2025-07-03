import React from 'react';
import { Modal, ScrollView, View } from 'react-native';
import { AppIconButton } from './AppIconButton';
import { sharedEntryStyles } from '@/SharedEntryStyles';
import { commonStyles } from '@/SharedStyles';
import { UpdateEntryDisplay } from './UpdateEntryDisplay';

interface UpdateEntryProps {
  _id: string;
  date: string;
  notes: string;
  images?: string[];
  parentObjectId?: string;
}

interface UpdateEntryDetailModalProps {
  visible: boolean;
  entry: UpdateEntryProps;
  onClose: () => void;
  onEdit: (entry: UpdateEntryProps) => void;
  onDelete: (id: string) => void;
}

export const UpdateEntryDetailModal: React.FC<UpdateEntryDetailModalProps> = ({
  visible,
  entry,
  onClose,
  onEdit,
  onDelete,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={commonStyles.modalOverlay}>
        <View style={commonStyles.modalContainer}>
          <ScrollView contentContainerStyle={commonStyles.modalContent}>
     <UpdateEntryDisplay
  entry={entry}
  onEditUpdate={onEdit}
  onDeleteUpdate={onDelete}
  disableDetailModal={true} 
/>
            <AppIconButton icon="close" label="Close" onPress={onClose} variant="close" />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
