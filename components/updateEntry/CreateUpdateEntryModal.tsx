import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { UpdateNotesAndImages } from './UpdateNotesAndImages';
import { SelectEntryToUpdate } from './SelectEntryToUpdate';
import { useNames } from '@/components/UseNames';
import { useCurrentUser } from '../CurrentUser';
import { AppIconButton } from '../AppIconButton';
import { commonStyles } from '@/styles/SharedStyles';

interface UpdateEntryProps {
  _id: string;
  date: string;
  notes: string;
  images?: string[];
  parentObjectId?: string;
}

interface CreateUpdateEntryModalProps {
  visible: boolean;
  onClose: () => void;
  isEditing: boolean;
  editingEntry: UpdateEntryProps | null;
  saveEntry: () => void;
  saveEditedUpdateEntry: () => void;
  notes: string;
  setNotes: (n: string) => void;
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  parentObjectId: string | null;
  setParentObjectId: (id: string | null) => void;
  allNames: any[];
  name: string;
  setName: (n: string) => void;
}

export const CreateUpdateEntryModal: React.FC<CreateUpdateEntryModalProps> = ({
  visible,
  onClose,
  isEditing,
  editingEntry,
  saveEntry,
  saveEditedUpdateEntry,
  notes,
  setNotes,
  images,
  setImages,
  parentObjectId,
  setParentObjectId,
  allNames,
  name,
  setName,
}) => {
  const { currentUserId } = useCurrentUser();
  const { fetchNames } = useNames(currentUserId);

  const [selectingEntry, setSelectingEntry] = useState(!isEditing);

  useEffect(() => {
    if (visible) {
      if (isEditing && editingEntry) {
        setParentObjectId(editingEntry.parentObjectId ?? null);
        setNotes(editingEntry.notes);
        setImages(editingEntry.images ?? []);
        setName('');
        setSelectingEntry(false);
      } else {
        setParentObjectId(null);
        setNotes('');
        setImages([]);
        setName('');
        setSelectingEntry(true);
      }
    }
  }, [visible, isEditing, editingEntry, setParentObjectId, setNotes, setImages, setName]);

  const handleSave = () => {
    if (isEditing) {
      saveEditedUpdateEntry();
    } else {
      saveEntry();
    }
    onClose();
    setSelectingEntry(!isEditing);
    setParentObjectId(null);
    setNotes('');
    setImages([]);
    setName('');
  };


  const handleClose = () => {
    onClose();
    setSelectingEntry(false);
  };

  return (
<Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
  <View style={commonStyles.entryContainer}>
    
    {/* Show this ONLY when creating a new entry */}
    {!isEditing && (
      <SelectEntryToUpdate
        allNames={allNames}
        setParentObjectId={setParentObjectId}
        setNotes={setNotes}
        setImages={setImages}
        setName={setName}
        onEntrySelected={(id: string) => {
          setParentObjectId(id);
        }}
      />
    )}

    <UpdateNotesAndImages
      notes={notes}
      setNotes={setNotes}
      images={images}
      setImages={setImages}
      saveEntry={isEditing ? saveEditedUpdateEntry : saveEntry}
      initialImages={editingEntry?.images}
      isNewEntry={!isEditing} // correct dynamic value
    />

    <AppIconButton
      icon="save"
      label={isEditing ? 'Save Changes' : 'Save Entry'}
      onPress={handleSave}
      variant="edit"
    />

    <AppIconButton
      icon="close"
      label="Close"
      variant="close"
      onPress={handleClose}
    />
  </View>
</Modal>

  );
};


