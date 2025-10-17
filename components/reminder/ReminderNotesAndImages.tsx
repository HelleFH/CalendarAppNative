import React, { useEffect } from 'react';
import { View, TextInput, Button, Image, ScrollView, StyleSheet } from 'react-native';
import { commonStyles } from '@/styles/SharedStyles';


interface ReminderNotesAndImages {
  notes: string;
  setNotes: (notes: string) => void;
  saveEntry: () => void;
}

export const ReminderNotesAndImages: React.FC<ReminderNotesAndImages> = ({
  notes,
  setNotes,
  saveEntry,
}) => {

  return (
   <View style={commonStyles.entryContainer}>
      <TextInput
        style={commonStyles.input}
        placeholder="Add notes"
        value={notes}
        onChangeText={setNotes}
      />
    </View>
  );
};

