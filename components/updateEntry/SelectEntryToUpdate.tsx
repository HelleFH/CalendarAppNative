// SelectEntryToUpdate.tsx
import React from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export interface NameEntry {
  _id: string;
  name: string;
}

interface Props {
  allNames: NameEntry[];
  selectedId: string;
  setSelectedId: (id: string) => void;
  setParentObjectId: (id: string | null) => void;
  setNotes: (notes: string) => void;
  setImages: (images: string[]) => void;
  setName: (name: string) => void;
}

export const SelectEntryToUpdate: React.FC<Props> = ({
  allNames,
  selectedId,
  setSelectedId,
  setParentObjectId,
  setNotes,
  setImages,
  setName,
}) => {
  const handleSelect = (id: string) => {
    setSelectedId(id);
    setParentObjectId(id);
    const selected = allNames.find((n) => n._id === id);
    if (selected) {
      setName(selected.name);
      setNotes('');
      setImages([]);
    }
  };

  return (
    <View>
      <Picker
        selectedValue={selectedId || ''}
        onValueChange={(itemValue) => handleSelect(itemValue)}
      >
        <Picker.Item label="Select a plant" value="" />
        {allNames.map((entry) => (
          <Picker.Item key={entry._id} label={entry.name} value={entry._id} />
        ))}
      </Picker>
    </View>
  );
};
