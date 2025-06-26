import React from 'react';
import { Modal, View, Button, StyleSheet } from 'react-native';
import { NotesAndImages } from './NotesAndImages';

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
      <View style={styles.modalContent}>
        <NotesAndImages
          name={name}
          setName={setName}
          notes={notes}
          setNotes={setNotes}
          images={images}
          setImages={setImages}
          saveEntry={saveEntry}
        />

        <Button
          title={isEditing ? 'Save Changes' : 'Save Entry'}
          onPress={isEditing ? saveEditedEntry : saveEntry}
        />

        <Button
          title="Close"
          onPress={() => {
            onClose();
          }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
});
