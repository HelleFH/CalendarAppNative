import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { commonStyles } from '@/styles/SharedStyles';
import { formStyles } from '@/styles/FormStyles';
interface Entry {
  _id: string;
  name: string;
  notes?: string;
  images?: string[];
}

interface SelectEntryForReminderProps {
  allNames: Entry[];
  setParentObjectId: (id: string) => void;
  setNotes: (notes: string) => void;
  setImages: (images: string[]) => void;
  setName: (name: string) => void;
  onEntrySelected: (id: string) => void;
}

export const SelectEntryForReminder: React.FC<SelectEntryForReminderProps> = ({
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
        style={formStyles.input}
        dropdownIconColor="#319795"
        mode="dropdown"
          testID="picker"

      >
        <Picker.Item label="Select an entry..." value="" />
        {allNames.map((entry) => (
          <Picker.Item key={entry._id} label={entry.name} value={entry._id} />
        ))}
      </Picker>
  );
};
