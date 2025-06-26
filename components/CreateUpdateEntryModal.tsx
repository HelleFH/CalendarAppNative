import React, { useState } from 'react';
import { Modal, View, Button, StyleSheet } from 'react-native';
import { UpdateNotesAndImages } from './UpdateNotesAndImages';
import { SelectEntryToUpdate } from './SelectEntryToUpdate';
import { useNames } from '@/components/UseNames';
import { useCurrentUser } from './CurrentUser';

interface CreateUpdateEntryModalProps {
  visible: boolean;
  onClose: () => void;
  isEditing: boolean;
  saveEntry: () => void;
  saveEditedUpdateEntry: () => void;
  notes: string;
  setNotes: (notes: string) => void;
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  parentObjectId: string | null;
  setParentObjectId: (id: string | null) => void;
  allNames: any[];
}

export const CreateUpdateEntryModal: React.FC<CreateUpdateEntryModalProps> = ({
  visible,
  onClose,
  isEditing,
  saveEntry,
  saveEditedUpdateEntry,
  notes,
  setNotes,
  images,
  setImages,
  parentObjectId,
  setParentObjectId,
  allNames,
}) => {
  const [selectingEntry, setSelectingEntry] = useState(true);
  const [selectedOriginalEntry, setSelectedOriginalEntry] = useState<any>(null);
  const [name, setName] = useState<string>('');
  const { currentUserId } = useCurrentUser();
  const { fetchNames } = useNames(currentUserId);

  const handleEntrySelected = (id: string) => {
    setParentObjectId(id);
    setSelectingEntry(false);
  };

  const handleClose = () => {
    setSelectingEntry(true);
    setParentObjectId(null);
    setNotes('');
    setImages([]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View style={styles.modalContent}>
        {selectingEntry ? (
          <SelectEntryToUpdate
            creatingUpdate={true}
            allNames={allNames}
            setSelectedOriginalEntry={setSelectedOriginalEntry}
            setParentObjectId={setParentObjectId}
            setNotes={setNotes}
            setImages={setImages}
            setName={setName}
            setIsUpdateModalVisible={() => {}}
            onEntrySelected={handleEntrySelected}
          />
        ) : (
          <>
            <UpdateNotesAndImages
              notes={notes}
              setNotes={setNotes}
              images={images}
              setImages={setImages}
              saveEntry={saveEntry}
            />

            <Button
              title={isEditing ? 'Save Changes' : 'Save Entry'}
              onPress={isEditing ? saveEditedUpdateEntry : saveEntry}
            />

            <Button title="Close" onPress={handleClose} />
          </>
        )}
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
