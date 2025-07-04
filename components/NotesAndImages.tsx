import React from 'react';
import { View, TextInput, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppIconButton } from './AppIconButton';
import { formStyles } from '@/FormStyles';
import { commonStyles } from '@/SharedStyles';

interface NotesAndImagesProps {
  notes: string;
  setNotes: (notes: string) => void;
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
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
      setImages((prevImages) => [...prevImages, ...uris]);
    }
  };

  return (
    <View style={formStyles.container}>
      <TextInput
        style={[formStyles.input, formStyles.disabledInput]}
        placeholder="Enter Plant name"
        value={name}
        onChangeText={setName}
        editable={true}
      />
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
