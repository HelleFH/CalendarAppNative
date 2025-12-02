import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import { deleteImageHandler } from '@/utils/entryHandler';
import { ThemedButton } from '@/styles/ThemedTouchable';
import { useTheme } from '@/styles/ThemeProvider';
import { ThemedImage } from '@/styles/ThemedImage';
import { ThemedScrollView } from '@/styles/ThemedScrollView';
import { FormInput } from '../forms/FormInput';
import { ThemedView } from '@/styles/ThemedView';

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
  onSave: () => void;


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
  onSave,

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

  // ✅ Delete image
  const handleDeleteImage = (uri: string) => {
    if (!setImages) return;
    setImages((prev) => prev.filter((img) => img !== uri));
    if (entryId) deleteImageHandler({ entryId, imageUrl: uri, setImages });
  };

  return (
    <ThemedScrollView variant="flexColumnLarge">
      {showName && setName && (
        <FormInput
          label="Plant Name"
          placeholder="Enter name"
          value={name}
          onChangeText={setName}
          required
        />
      )}

      <FormInput
        label="Notes"
        placeholder="Add notes"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      {allowImages && setImages && (
        <>
          <ThemedButton
            icon="add"
            label="Pick Images"
            variant="Secondary"
            onPress={pickImages}
          />

          <ThemedScrollView horizontal variant='flexColumnSmall'>
              {images.map((uri, index) => (
                <ThemedView  key={index}>
                          {allowDeleteImages && (
                    <ThemedButton
                      icon="trash"
                      variant="Delete"
                      onPress={() => handleDeleteImage(uri)}
                      style={{width:15, height:15, paddingHorizontal:16, paddingVertical:16, position:'absolute', opacity:0.7, right:0,}}
                    />
                  )}
                  <ThemedImage source={{ uri }} size="cardSmall" />

          
                </ThemedView>
              ))}
             
             {(setNotes !== undefined || setName !== undefined || setImages !== undefined) && (
              <ThemedButton
                icon="save"
                label="Save"
                variant="Primary"
                onPress={() => onSave()}
              />
            )}

          </ThemedScrollView>
        </>
      )}
    </ThemedScrollView>
  );
};