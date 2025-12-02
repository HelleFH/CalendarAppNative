import React from 'react';
import { UpdateEntryDisplay } from './UpdateEntryDisplay';
import { BaseModal } from '../baseModal';

interface UpdateEntryProps {
  _id: string;
  date: string;
  notes: string;
  images?: string[];
  parentObjectId?: string;
}

interface UpdateEntryDetailModalProps {
  visible: boolean;
  entry: UpdateEntryProps | null;
  onClose: () => void;
  onEditUpdate: (entry: UpdateEntryProps) => void;
  onDeleteUpdate: (entryId: string) => void;
}

export const UpdateEntryDetailModal: React.FC<UpdateEntryDetailModalProps> = ({
  visible,
  entry,
  onClose,
  onEditUpdate,
  onDeleteUpdate,
}) => {
  if (!entry) return null;

  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title={entry.date}
    >    

          <UpdateEntryDisplay
            key={entry._id}
            entry={entry}
            onEditUpdate={onEditUpdate}
            onDeleteUpdate={onDeleteUpdate}
            disableDetailModal={true}
            onRequestCloseModal={onClose}
          />
   
    </BaseModal>
  );
};
