import React from 'react';
import { View, TextInput, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppIconButton } from '../AppIconButton';
import { formStyles } from '@/styles/FormStyles';
import { commonStyles } from '@/styles/SharedStyles';
import { deleteImageHandler } from '@/utils/entryHandler';
import { EditableNotesWithImages } from '../EditableNotesWithImages';

interface NotesAndImagesProps {
  notes: string;
  setNotes: (notes: string) => void;
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  name: string;
  setName: (name: string) => void;
  entryId?: string;
  saveEntry: () => void;
}

export const NotesAndImages: React.FC<NotesAndImagesProps> = ({
  entryId,
  notes,
  setNotes,
  images,
  setImages,
  name,
  setName,
  saveEntry,
}) => {
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets) {
      const uris = result.assets.map((asset) => asset.uri);
      setImages((prevImages) => [...prevImages, ...uris]);
    }
  };
  const handleDeleteImage = (uri: string) => {
  console.log('Attempting to delete image:', uri);
  console.log('Current entryId:', entryId);

  // Always remove from local state
  setImages((prev) => prev.filter((img) => img !== uri));

  if (entryId) {
    console.log(`Deleting image ${uri} from entry ${entryId}`);
    deleteImageHandler({ entryId, imageUrl: uri, setImages });
  } else {
    console.warn('Cannot delete image from server before saving entry.');
  }
};
  return (
  <EditableNotesWithImages
  showName
  allowImages
  allowDeleteImages
  name={name}
  setName={setName}
  notes={notes}
  setNotes={setNotes}
  images={images}
  setImages={setImages}
  entryId={entryId}
/>

  );
};
