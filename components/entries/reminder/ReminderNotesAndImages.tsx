import React from 'react';
import { EditableNotesWithImages } from '../EditableNotesWithImages';


interface ReminderNotesAndImagesProps {
  notes: string;
  setNotes: (notes: string) => void;
  saveEntry: () => void;
}

export const ReminderNotesAndImages: React.FC<ReminderNotesAndImagesProps> = ({
  notes,
  setNotes,
  saveEntry,
}) => {

  return (
<EditableNotesWithImages
  showName={false}
  allowImages={false}
  notes={notes}
  setNotes={setNotes}
/>

  );
};

