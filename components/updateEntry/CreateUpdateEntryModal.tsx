// CreateUpdateEntryModal.tsx
import React, { useState, useEffect } from 'react';
import { BaseModal } from '../baseModal';
import { UpdateNotesAndImages } from './UpdateNotesAndImages';
import { SelectEntryToUpdate } from './SelectEntryToUpdate';
import { useCurrentUser } from '../CurrentUser';

interface UpdateEntryProps {
  _id: string;
  date: string;
  notes: string;
  images?: string[];
  parentObjectId?: string;
}

interface CreateUpdateEntryModalProps {
  visible: boolean;
  onClose: () => void;
  isEditing: boolean;
  editingEntry: UpdateEntryProps | null;
  saveEntry: () => void | Promise<void>;
  saveEditedUpdateEntry: () => void | Promise<void>;
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  parentObjectId: string | null;
  setParentObjectId: (id: string | null) => void;
  allNames: { _id: string; name: string }[];
  name: string;
  setName: (name: string) => void;
}

export const CreateUpdateEntryModal: React.FC<CreateUpdateEntryModalProps> = ({
  visible,
  onClose,
  isEditing,
  editingEntry,
  saveEntry,
  saveEditedUpdateEntry,
  notes,
  setNotes,
  images,
  setImages,
  parentObjectId,
  setParentObjectId,
  allNames,
  name,
  setName,
}) => {
  const { currentUserId } = useCurrentUser();
  const [selectedId, setSelectedId] = useState<string>('');

  // Initialize modal fields once when it opens
  useEffect(() => {
    if (!visible) return;

    if (isEditing && editingEntry) {
      setParentObjectId(editingEntry.parentObjectId || '');
      setSelectedId(editingEntry.parentObjectId || '');
      setNotes(editingEntry.notes);
      setImages(editingEntry.images || []);
      setName(allNames.find(n => n._id === editingEntry.parentObjectId)?.name || '');
    } else if (!isEditing) {
      setParentObjectId('');
      setSelectedId('');
      setNotes('');
      setImages([]);
      setName('');
    }
  }, [visible]);

  // Sync selectedId with parentObjectId
  useEffect(() => {
    setParentObjectId(selectedId);
    const selectedName = allNames.find(n => n._id === selectedId)?.name || '';
    setName(selectedName);
  }, [selectedId, allNames]);

  const handleSave = () => {
    if (!parentObjectId) {
      alert('No entry selected.');
      return;
    }
    if (!notes || images.length === 0) {
      alert('Please provide notes and at least one image.');
      return;
    }

    if (isEditing) saveEditedUpdateEntry();
    else saveEntry();

    onClose();
  };

  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title={isEditing ? `Edit update for ${name}` : 'Create an update'}
      saveLabel={isEditing ? 'Save Changes' : 'Save'}
      onSave={handleSave}
      saveVariant="Edit"
    >
      <SelectEntryToUpdate
        allNames={allNames}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        setParentObjectId={setParentObjectId}
        setNotes={setNotes}
        setImages={setImages}
        setName={setName}
      />

      <UpdateNotesAndImages
        notes={notes}
        setNotes={setNotes}
        images={images}
        setImages={setImages}
        saveEntry={isEditing ? saveEditedUpdateEntry : saveEntry}
        initialImages={editingEntry?.images || []}
        isNewEntry={!isEditing}
        isEditing={isEditing}
        name={name}
      />
    </BaseModal>
  );
};
