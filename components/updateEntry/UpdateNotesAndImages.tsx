import React, { useEffect } from 'react';
import { View, TextInput, Image, ScrollView, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppIconButton } from '../AppIconButton';
import { formStyles } from '@/styles/FormStyles';
import { commonStyles } from '@/styles/SharedStyles';
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
    <View style={formStyles.container}>

      <TextInput
        style={formStyles.input}
        placeholder="Add notes"
        value={notes}
        onChangeText={setNotes}
      />

      <AppIconButton icon="add" label="Pick Images" onPress={pickImages} />

      <ScrollView horizontal style={formStyles.scrollContainer}>
        <View style={commonStyles.imageWrapper}>
          {images.map((uri, index) => (
            <Image key={index} source={{ uri }} style={formStyles.image} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};