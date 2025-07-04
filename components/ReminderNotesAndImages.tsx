import React, { useEffect } from 'react';
import { View, TextInput, Button, Image, ScrollView, StyleSheet } from 'react-native';
import { commonStyles } from '@/SharedStyles';


interface UpdateNotesAndImagesProps {
  notes: string;
  setNotes: (notes: string) => void;
  saveEntry: () => void;
}

export const UpdateNotesAndImages: React.FC<UpdateNotesAndImagesProps> = ({
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

