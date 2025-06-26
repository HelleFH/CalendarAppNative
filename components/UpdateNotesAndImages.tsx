import React, { useEffect } from 'react';
import { View, TextInput, Button, Image, ScrollView, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppIconButton } from './AppIconButton';

interface UpdateNotesAndImagesProps {
  notes: string;
  setNotes: (notes: string) => void;
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  saveEntry: () => void;
  initialImages?: string[]; // Initial images when editing
}

export const UpdateNotesAndImages: React.FC<UpdateNotesAndImagesProps> = ({
  notes,
  setNotes,
  images,
  setImages,
  saveEntry,
  initialImages = [], // Default to an empty array if not editing
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

  // If editing, initialize images with the images that are part of the entry.
  useEffect(() => {
    if (initialImages && initialImages.length > 0) {
      setImages(initialImages);
    }
  }, [initialImages, setImages]);

  return (
    <View style={styles.entryContainer}>
      <TextInput
        style={styles.input}
        placeholder="Add notes"
        value={notes}
        onChangeText={setNotes}
      />
      <AppIconButton icon='add' label="Pick Images" onPress={pickImages} />

      <ScrollView horizontal>
        {/* Show all images: both picked and initial (for editing) */}
        {(images ?? []).map((imageUri, index) => (
          <Image key={index} source={{ uri: imageUri }} style={styles.image} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  entryContainer: { marginTop: 20, width: '80%' },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 10 },
  image: { width: 100, height: 100, marginRight: 10 },
});
