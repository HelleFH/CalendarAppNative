import React from 'react';
import { View, TextInput, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppIconButton } from './AppIconButton';
import { useTheme } from '@/styles/ThemeProvider';
import { deleteImageHandler } from '@/utils/entryHandler';
import { getImageStyle } from '@/styles/ThemeHelpers';

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
  const { theme } = useTheme();

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

  const inputStyle = {
    backgroundColor: theme.TextInput.rest.background,
    borderColor: theme.TextInput.rest.border,
    color: theme.TextInput.rest.text,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    fontSize: theme.fontSize.md,
  };

  const imageWrapperStyle = {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  };

  const imageStyle = {
    width: 100,
    height: 100,
    borderRadius: theme.radius.md,
  };

  return (
    <View style={{ width: '100%' }}>
      {showName && setName && (
        <TextInput
          style={inputStyle}
          placeholder="Enter name"
          placeholderTextColor={theme.colors.placeholder}
          value={name}
          onChangeText={setName}
        />
      )}

      <TextInput
        style={inputStyle}
        placeholder="Add notes"
        placeholderTextColor={theme.colors.placeholder}
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      {allowImages && setImages && (
        <>
          <AppIconButton
            icon="add"
            label="Pick Images"
            variant="Secondary"
            onPress={pickImages}
          />

          <ScrollView horizontal style={{ marginTop: theme.spacing.sm }}>
            <View >
              {images.map((uri, index) => (
                <View key={index}>
                  <Image source={{ uri }}    
                  style={[getImageStyle(theme, 'large'), { marginHorizontal: theme.spacing.sm }]}
                  
 />
                  {allowDeleteImages && (
                    <AppIconButton
                      icon="trash"
                      label="Delete"
                      variant="Delete"
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
