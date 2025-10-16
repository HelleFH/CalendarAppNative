import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { UpdateEntryDisplay } from '../updateEntry/UpdateEntryDisplay';
import { DeleteConfirmationModal } from '../DeleteConfirmationModal';
import { AppIconButton } from '../AppIconButton';
import { EntryDetailModal } from './EntryDetailModal';
import { commonStyles } from '@/styles/SharedStyles';
import { Ionicons } from '@expo/vector-icons';
import { ReminderDisplay } from '../reminder/ReminderDisplay';
import { fetchUpdateEntriesByParent, fetchRemindersByParent } from '@/utils/api';

interface EntryProps {
  _id: string;
  name: string;
  date: string;
  notes: string;
  images?: string[];
}
interface ReminderProps {
  _id: string;
  date: string;
  notes: string;
  parentObjectId?: string;
}
interface EntryDisplayProps {
  entry: EntryProps;
  onEditEntry: (entry: EntryProps) => void;
  onEditUpdate: (entry: UpdateEntryProps) => void;
  onDeleteEntry: (id: string) => void;
  onDeleteUpdate: (id: string) => void;
  onPress?: () => void;
  showUpdatesInline?: boolean;
  disableDetailModal?: boolean;
  onRequestCloseModal?: () => void;
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
  onRequestCloseModal

}) => {

  const [updateEntries, setUpdateEntries] = useState<UpdateEntryProps[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showUpdatesInline, setshowUpdatesInline] = useState(false);
  const [showUpdateList, setShowUpdateList] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reminders, setReminders] = useState<ReminderProps[]>([]);

useEffect(() => {
  const loadUpdateEntries = async () => {
    if (!entry._id) return;

    try {
      const updates = await fetchUpdateEntriesByParent(entry._id);
      setUpdateEntries(updates);
    } catch (err) {
      console.error('Error loading update entries:', err);
    }
  };

  loadUpdateEntries();
}, [entry._id]);

useEffect(() => {
  const loadReminders = async () => {
    if (!entry._id) return;

    try {
      const fetchedReminders = await fetchRemindersByParent(entry._id);
      setReminders(fetchedReminders);
    } catch (err) {
      console.error('Error loading reminders:', err);
    }
  };

  loadReminders();
}, [entry._id]);

  const images = entry.images ?? [];

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };


  return (
    <View style={commonStyles.container}>
      <TouchableOpacity  
        onPress={() => {
          if (!disableDetailModal) setShowEntryModal(true);
        }}
        activeOpacity={0.7}
      >
        <Text style={commonStyles.title}>{entry.name} ({entry.date})</Text>
        <Text style={commonStyles.subtitle}>{entry.name}</Text>
        <Text style={commonStyles.notes}>{entry.notes}</Text>
        {images.length > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
            {images.length > 1 && (
              <TouchableOpacity onPress={handlePrevImage}>
                <Ionicons name="chevron-back" size={24} color="black" />
              </TouchableOpacity>
            )}
            <Image source={{ uri: images[currentImageIndex] }} style={commonStyles.image} />
            {images.length > 1 && (
              <TouchableOpacity onPress={handleNextImage}>
                <Ionicons name="chevron-forward" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </TouchableOpacity>

      <View style={commonStyles.buttonWrapper}>
        <AppIconButton
          icon="pencil"
          label="Edit"
          onPress={() => {
            onEditEntry(entry);
            if (onRequestCloseModal) onRequestCloseModal();
          }}
          variant="edit"
        />
        <AppIconButton icon="remove" label="Delete" onPress={() => onDeleteEntry(entry._id)} variant="delete" />
                    {updateEntries.length > 0 && (
            <TouchableOpacity onPress={() => setShowUpdateList((prev) => !prev)}>

              <Text style={commonStyles.link}>

                <Ionicons name="eye" size={16} color="#1E90FF" style={commonStyles.icon} />
                {showUpdateList ? 'Hide Updates' : 'View Updates'}
              </Text>
            </TouchableOpacity>
          )}
      </View>
      {showUpdatesInline ? (
        updateEntries.map((u) => (
          <UpdateEntryDisplay
            key={u._id}
            entry={{ ...u, images: u.images ?? [] }}
            onEditUpdate={onEditUpdate}
            onDeleteUpdate={onDeleteUpdate}
          />
        ))
      ) : (
        <>

          {showUpdateList &&
            updateEntries.map((u) => (
              <UpdateEntryDisplay
                key={u._id}
                entry={{ ...u, images: u.images ?? [] }}
                onEditUpdate={onEditUpdate}
                onDeleteUpdate={onDeleteUpdate}
              />
            ))}
        </>
      )}
{reminders.length > 0 && (
  reminders.map((reminder) => (
    <ReminderDisplay
      key={reminder._id}
      reminder={reminder}
      onEditReminder={() => {}}
      onDeleteReminder={() => {}}
    />
  ))
)}
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
