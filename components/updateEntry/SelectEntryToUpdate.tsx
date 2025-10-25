import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { formStyles } from '@/styles/FormStyles';
interface Entry {
  _id: string;
  name: string;
  notes?: string;
  images?: string[];
}

interface SelectEntryToUpdateProps {
  allNames: Entry[];
  setParentObjectId: (id: string) => void;
  setNotes: (notes: string) => void;
  setImages: (images: string[]) => void;
  setName: (name: string) => void;
  onEntrySelected: (id: string) => void;
}

export const SelectEntryToUpdate: React.FC<SelectEntryToUpdateProps> = ({
  allNames,
  setParentObjectId,
  setNotes,
  setImages,
  setName,
  onEntrySelected,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>('');

  const handleSelect = (itemValue: string) => {
    setSelectedValue(itemValue);
    const selectedEntry = allNames.find((e) => e._id === itemValue);
    if (selectedEntry) {
      setParentObjectId(selectedEntry._id);
      setNotes(selectedEntry.notes || '');
      setImages(selectedEntry.images || []);
      setName(selectedEntry.name);
      onEntrySelected(selectedEntry._id);
    }
  };

  return (

    <Picker
      selectedValue={selectedValue}
      onValueChange={handleSelect}
      style={{ ...formStyles.input, marginTop: 30 }}
      dropdownIconColor="#319795"
      mode="dropdown"
    >
      <Picker.Item label="Choose a plant to update..." value="" />
      {allNames.map((entry) => (
        <Picker.Item key={entry._id} label={entry.name} value={entry._id} />
      ))}
    </Picker>
  );
};