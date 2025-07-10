import React, { useState } from 'react';
import { Modal, View, Text, Button, TouchableOpacity } from 'react-native';
import { NotesAndImages } from './NotesAndImages';
import { AppIconButton } from '../AppIconButton';
import { commonStyles } from '@/styles/SharedStyles';
import { formStyles } from '@/styles/FormStyles';

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
  selectedDate: string;

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
  selectedDate
}) => {


  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={formStyles.container}>
        <Text style={formStyles.title}>Add a plant for {selectedDate} </Text>

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

        <TouchableOpacity onPress={() => {
          onClose();
        }} 
        >
          <Text style={commonStyles.cancelButton}>Cancel</Text>
        </TouchableOpacity>



      </View>
    </Modal>
  );
};

