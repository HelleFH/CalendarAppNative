import React, { useEffect } from 'react';
import { View, TextInput, Button, Image, ScrollView, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

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
    <View style={styles.entryContainer}>
      <TextInput
        style={styles.input}
        placeholder="Add notes"
        value={notes}
        onChangeText={setNotes}
      />


    </View>
  );
};

const styles = StyleSheet.create({
  entryContainer: { marginTop: 20, width: '80%' },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 10 },
  image: { width: 100, height: 100, marginRight: 10 },
});
