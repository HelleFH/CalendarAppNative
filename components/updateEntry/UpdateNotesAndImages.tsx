import React, { useEffect } from 'react';
import { View, TextInput, Image, ScrollView, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { formStyles } from '@/styles/FormStyles';

import { EditableNotesWithImages } from '../EditableNotesWithImages';
interface UpdateNotesAndImagesProps {
  notes: string;
  setNotes: (notes: string) => void;
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  saveEntry: () => void;
  initialImages?: string[];
  isNewEntry: boolean; 
    isEditing: boolean;  
  name?: string;    
}

export const UpdateNotesAndImages: React.FC<UpdateNotesAndImagesProps> = ({
  notes,
  setNotes,
  images,
  setImages,
  saveEntry,
  initialImages = [],
  isNewEntry,
  isEditing,
  name
  
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
      setImages((prev: string[]) => [...new Set([...prev, ...uris])]);
    }
  };

  useEffect(() => {
    if (initialImages.length > 0) {
      setImages(initialImages);
    }
  }, [initialImages]);


  return (
  <EditableNotesWithImages
  showName={false}
  allowImages
  allowDeleteImages
  notes={notes}
  setNotes={setNotes}
  images={images}
  setImages={setImages}
/>

  );
};