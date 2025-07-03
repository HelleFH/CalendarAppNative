import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { UpdateEntryDisplay } from './UpdateEntryDisplay';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import axios from 'axios';
import { AppIconButton } from './AppIconButton';
import { EntryDetailModal } from './EntryDetailModal';
import { sharedEntryStyles } from '@/SharedEntryStyles';
import { Ionicons } from '@expo/vector-icons';

interface EntryProps {
  _id: string;
  name: string;
  date: string;
  notes: string;
  images?: string[];
}

interface EntryDisplayProps {
  entry: EntryProps;
  onEditEntry: (entry: EntryProps) => void;
  onEditUpdate: (entry: UpdateEntryProps) => void;
  onDeleteEntry: (id: string) => void;
  onDeleteUpdate: (id: string) => void;
  onPress?: () => void;
  disableDetailModal?: boolean;
}

interface UpdateEntryProps {
  _id: string;
  date: string;
  notes: string;
  images?: string[];
  parentObjectId?: string;
}

export const EntryDisplay: React.FC<EntryDisplayProps> = ({
  entry,
  onEditEntry,
  onDeleteEntry,
  onEditUpdate,
  onDeleteUpdate,
  onPress,
  disableDetailModal,
}) => {
  const [updateEntries, setUpdateEntries] = useState<UpdateEntryProps[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<EntryProps | null>(null);
  const [showUpdateList, setShowUpdateList] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  
useEffect(() => {
  const fetchUpdateEntries = async () => {
    if (!entry._id) return;

    try {
      const res = await axios.get<UpdateEntryProps[]>(
        'https://calendarappnative.onrender.com/entries/update-entries/by-parent',
        {
          params: { parentObjectId: entry._id },
        }
      );
      console.log('Fetched update entries:', res.data);
      setUpdateEntries(res.data);
    } catch (err) {
      console.error('Failed to fetch update entries:', err);
    }
  };

  fetchUpdateEntries();
}, [entry._id]);

  const images = entry.images ?? [];

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          if (!disableDetailModal) {
            setSelectedEntry(entry);
            setShowEntryModal(true);
          }
        }}
        activeOpacity={0.7}
      >
        <Text style={sharedEntryStyles.title}>{`${entry.name} ${entry.date}`}</Text>
        <Text style={sharedEntryStyles.name}>{entry.name}</Text>
        <Text style={sharedEntryStyles.notes}>{entry.notes}</Text>

        {images.length > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
            {images.length > 1 && (
              <TouchableOpacity onPress={handlePrevImage}>
                <Ionicons name="chevron-back" size={24} color="black" />
              </TouchableOpacity>
            )}
            <Image source={{ uri: images[currentImageIndex] }} style={sharedEntryStyles.image} />
            {images.length > 1 && (
              <TouchableOpacity onPress={handleNextImage}>
                <Ionicons name="chevron-forward" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </TouchableOpacity>

      <View style={sharedEntryStyles.buttonWrapper}>
        <AppIconButton
          icon="pencil"
          label="Edit"
          onPress={() => {
            onEditEntry(entry);
            setShowEntryModal(false);
          }}
          variant="edit"
        />
        <AppIconButton
          icon="remove"
          label="Delete"
          onPress={() => setShowDeleteModal(true)}
          variant="delete"
        />
      </View>

      {/* Toggle button for collapsible updates */}
      {updateEntries.length > 0 && (
        <TouchableOpacity onPress={() => setShowUpdateList((prev) => !prev)}>
          <Text style={styles.link}>
            <Ionicons
              name={showUpdateList ? 'chevron-up' : 'chevron-down'}
              size={16}
              color="#1E90FF"
              style={styles.icon}
            />
            {showUpdateList ? 'Hide Updates' : 'View Updates'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Render updates only when toggled */}
      {showUpdateList &&
        updateEntries.map((u) => (
          <UpdateEntryDisplay
            key={u._id}
            entry={{ ...u, images: u.images ?? [] }}
            onEditUpdate={onEditUpdate}
            onDeleteUpdate={onDeleteUpdate}
          />
        ))}

      <DeleteConfirmationModal
        visible={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => {
          onDeleteEntry(entry._id);
          setShowDeleteModal(false);
        }}
        itemType="entry"
      />

      <EntryDetailModal
        visible={showEntryModal}
        entry={entry}
        onClose={() => setShowEntryModal(false)}
        onEditUpdate={onEditUpdate}
        onDeleteUpdate={onDeleteUpdate}
        onDeleteEntry={onDeleteEntry}
        onEditEntry={onEditEntry}
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
    backgroundColor: '#E8F7FD',
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
  icon: {},
  link: {
    color: '#1E90FF',
    textDecorationLine: 'underline',
    fontSize: 14,
    marginVertical: 6,
  },
});
