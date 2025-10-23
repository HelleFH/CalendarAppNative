import React, { useState } from 'react';
import { BaseModal } from '../baseModal';
import { NotesAndImages } from './NotesAndImages';

interface CreateEntryModalProps {
  visible: boolean;
  onClose: () => void;
  isEditing: boolean;
  saveEntry: () => void | Promise<void>;
  saveEditedEntry: (id: string) => void | Promise<void>; 
  notes: string;
  setNotes: (notes: string) => void;
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  name: string;
  setName: (name: string) => void;
  selectedDate: string;
  entryId?: string; 
}

interface EntryProps {
  _id: string;
  name: string;
  date: string;
  notes: string;
  images?: string[];
}

export const CreateEntryModal: React.FC<CreateEntryModalProps> = ({
  visible,
  onClose,
  isEditing,
  entryId,           // ✅ add this line
  saveEntry,
  saveEditedEntry,
  notes,
  setNotes,
  images,
  setImages,
  name,
  setName,
  selectedDate,
}) => {
  const [editingEntry, setEditingEntry] = useState<EntryProps | null>(null);

const handleSave = async () => {
  try {
    if (isEditing && entryId) {
      await saveEditedEntry(entryId); // ✅ pass the correct entry id
    } else {
      await saveEntry();
    }
    onClose();
  } catch (err) {
    console.error('Error saving entry:', err);
  }
};

  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title={`Add a plant for ${selectedDate}`}
      saveLabel={isEditing ? 'Save Changes' : 'Save Entry'}
      onSave={handleSave}
      saveVariant="Edit"
    >
      <NotesAndImages
        name={name}
        setName={setName}
        notes={notes}
        setNotes={setNotes}
        images={images}
        setImages={setImages}
        saveEntry={saveEntry}
    entryId={editingEntry?._id} />
    </BaseModal>
  );
};
