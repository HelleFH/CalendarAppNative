import React from 'react';
import { Modal, View, Button, StyleSheet } from 'react-native';
import { NotesAndImages } from './NotesAndImages';
import { AppIconButton } from './AppIconButton';
import { commonStyles } from '@/SharedStyles';

interface CreateEntryModalProps {
  visible: boolean;
  onClose: () => void;
  isEditing: boolean;
  saveEntry: () => void;
  saveEditedEntry: () => void;
  notes: string;
  setNotes: (notes: string) => void;
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  name: string;
  setName: (name: string) => void;
}

export const CreateEntryModal: React.FC<CreateEntryModalProps> = ({
  visible,
  onClose,
  isEditing,
  saveEntry,
  saveEditedEntry,
  notes,
  setNotes,
  images,
  setImages,
  name,
  setName,
}) => {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={commonStyles.entryContainer}>
        <NotesAndImages
          name={name}
          setName={setName}
          notes={notes}
          setNotes={setNotes}
          images={images}
          setImages={setImages}
          saveEntry={saveEntry}
        />

        <AppIconButton
        icon='save'
          label={isEditing ? 'Save Changes' : 'Save Entry'}
          onPress={isEditing ? saveEditedEntry : saveEntry}
                    variant='edit'

        />

        <AppIconButton
        icon='close'
          label="Close"
          variant='close'
          onPress={() => {
            onClose();
          }}
        />
      </View>
    </Modal>
  );
};

