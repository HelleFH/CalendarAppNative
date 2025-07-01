import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

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
    <View style={styles.container}>
      <Text style={styles.label}>Select an entry to update:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={handleSelect}
          style={styles.picker}
          dropdownIconColor="#319795"
          mode="dropdown"
        >
          <Picker.Item label="Select an entry..." value="" />
          {allNames.map((entry) => (
            <Picker.Item key={entry._id} label={entry.name} value={entry._id} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F855A',
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#319795',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#E6FFFA',
  },
  picker: {
    height: 50,
    color: '#2F855A',
  },
});
