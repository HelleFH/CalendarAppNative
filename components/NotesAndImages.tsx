import React from 'react';
import { View, TextInput, Button, Image, ScrollView, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppIconButton } from './AppIconButton';

interface NotesAndImagesProps {
  notes: string;
  setNotes: (notes: string) => void;
  images: string[]; // Images passed from parent (e.g., for editing)
  setImages: React.Dispatch<React.SetStateAction<string[]>>; // Set images after picking new ones
  name: string;
  setName: (name: string) => void;
  saveEntry: () => void;
}

export const NotesAndImages: React.FC<NotesAndImagesProps> = ({
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
      console.log('Picked image URIs:', uris);  // Debugging: ensure URIs are being picked correctly
      setImages((prevImages) => {
        const updatedImages = [...prevImages, ...uris];
        console.log('Updated images array:', updatedImages);  // Debugging: check images added to state
        return updatedImages;
      });
    } else {
      console.log('No images selected or picker was canceled.');
    }
  };
  

  return (
    <View style={styles.entryContainer}>
      <TextInput
        style={[styles.input && styles.disabledInput]}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        editable={true} 
      />
      <TextInput
        style={styles.input}
        placeholder="Add notes"
        value={notes}
        onChangeText={setNotes}
      />
      <AppIconButton icon='add' label="Pick Images" onPress={pickImages} />

      {/* Show both picked images and existing images if editing */}
      <ScrollView horizontal>
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
  disabledInput: { backgroundColor: '#f0f0f0', color: '#999' }, // optional style for disabled input
  image: { width: 100, height: 100, marginRight: 10 },
});
