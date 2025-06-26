import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Button } from 'react-native';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

interface UpdateEntryProps {
  _id: string;
  date: string;
  notes: string;
  images?: string[];
  parentObjectId?: string;  // For update entries, you might want to use this
}

interface UpdateEntryDisplayProps {
  entry: {
    _id: string;
    date: string;
    notes: string;
    images: string[];
    parentObjectId?: string;
  };
  onEditUpdate: (entry: UpdateEntryProps) => void;
  onDeleteUpdate: (entryId: string) => void; // or include `type: "original" | "update"` if needed
}

export const UpdateEntryDisplay: React.FC<UpdateEntryDisplayProps> = ({

  entry,
  onEditUpdate,
  onDeleteUpdate,
}) => {

  const [showDeleteModal, setShowDeleteModal] = useState(false); // ✅ State


  return (
    <View style={[styles.container && styles.updateContainer]}>
      <Text style={styles.title}>{`Update for ${entry.date}`}</Text>
      <Text style={styles.notes}>{entry.notes}</Text>
      <ScrollView horizontal>
        {(entry.images ?? []).map((uri, idx) => (
          <Image key={idx} source={{ uri }} style={styles.image} />
        ))}
      </ScrollView>
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <Button title="Edit" onPress={() => onEditUpdate(entry)} />

     <Button
         title="Delete"
         onPress={() => setShowDeleteModal(true)}
         color="red"
       />
      </View>
      <DeleteConfirmationModal
        visible={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => {
          onDeleteUpdate(entry._id);
          setShowDeleteModal(false);
        }}
        itemType="entry"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F0F8FF',
    borderRadius: 10,
  },
  updateContainer: {
    backgroundColor: '#E8F7FD', // A lighter blue for updates
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  name: {
    fontStyle: 'italic',
    marginBottom: 5,
  },
  notes: {
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
});