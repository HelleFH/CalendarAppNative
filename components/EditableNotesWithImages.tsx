import React, { useEffect } from 'react';
import { View, TextInput, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppIconButton } from './AppIconButton';
import { commonStyles } from '@/styles/SharedStyles';
import { formStyles } from '@/styles/FormStyles';
import { deleteImageHandler } from '@/utils/entryHandler';

interface EditableNotesWithImagesProps {
  name?: string;
  setName?: (name: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  images?: string[];
  setImages?: React.Dispatch<React.SetStateAction<string[]>>;
  entryId?: string;
  showName?: boolean;
  allowImages?: boolean;
  allowDeleteImages?: boolean;
}

export const EditableNotesWithImages: React.FC<EditableNotesWithImagesProps> = ({
  name,
  setName,
  notes,
  setNotes,
  images = [],
  setImages,
  entryId,
  showName = false,
  allowImages = false,
  allowDeleteImages = false,
}) => {

  const pickImages = async () => {
    if (!setImages) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });
    if (!result.canceled && result.assets) {
      const uris = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...new Set([...prev, ...uris])]);
    }
  };

  const handleDeleteImage = (uri: string) => {
    if (!setImages) return;
    setImages((prev) => prev.filter((img) => img !== uri));
    if (entryId) deleteImageHandler({ entryId, imageUrl: uri, setImages });
  };

  return (
    <View style={formStyles.container}>
      {showName && setName && (
        <TextInput
          style={formStyles.input}
          placeholder="Enter name"
          value={name}
          onChangeText={setName}
        />
      )}

      <TextInput
        style={formStyles.input}
        placeholder="Add notes"
        value={notes}
        onChangeText={setNotes}
      />

      {allowImages && setImages && (
        <>
          <AppIconButton icon="add" label="Pick Images" onPress={pickImages} />
          <ScrollView horizontal style={formStyles.scrollContainer}>
            <View style={commonStyles.imageWrapper}>
              {images.map((uri, index) => (
                <View key={index} style={{ marginRight: 10 }}>
                  <Image source={{ uri }} style={formStyles.image} />
                  {allowDeleteImages && (
                    <AppIconButton
                      icon="trash"
                      label="Delete"
                      onPress={() => handleDeleteImage(uri)}
                    />
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
};
