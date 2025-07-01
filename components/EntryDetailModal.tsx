import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, Text, View } from 'react-native';
import { EntryDisplay } from './EntryDisplay';
import { commonStyles } from '@/SharedStyles';
import { AppIconButton } from './AppIconButton';

interface EntryProps {
    _id: string;
    name: string;
    date: string;
    notes: string;
    images?: string[];
}

interface UpdateEntryProps {
    _id: string;
    date: string;
    notes: string;
    images?: string[];
    parentObjectId?: string;
}

interface EntryDetailModalProps {
    visible: boolean;
    entry: EntryProps | null;
    onClose: () => void;
    onEditUpdate: (entry: UpdateEntryProps) => void;
    onDeleteUpdate: (entryId: string) => void;
    onEditEntry: (entry: EntryProps) => void;
    onDeleteEntry: (entryId: string) => void;
}

export const EntryDetailModal: React.FC<EntryDetailModalProps> = ({
    visible,
    entry,
    onClose,
    onEditUpdate,
    onDeleteUpdate,
    onEditEntry,
    onDeleteEntry,

}) => {
    const [updateEntries, setUpdateEntries] = useState<UpdateEntryProps[]>([]);

    useEffect(() => {
        const fetchUpdates = async () => {
            if (!entry?._id) return;
            try {
                const response = await fetch(`https://calendarappnative.onrender.com/updates/${entry._id}`);
                const data: UpdateEntryProps[] = await response.json();
                setUpdateEntries(data);
            } catch (err) {
                console.error('Failed to fetch updates:', err);
            }
        };
        fetchUpdates();
    }, [entry]);

    if (!entry) return null;

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <ScrollView contentContainerStyle={commonStyles.modalContent}>
                {/* Display main entry */}
                <EntryDisplay
                    entry={entry}
                    showUpdatesInline={false}
                    onEditUpdate={onEditUpdate}
                    onDeleteUpdate={onDeleteUpdate}
                    onEditEntry={(entry) => {
                        onEditEntry(entry);
                        onClose();
                    }}
                    onDeleteEntry={onDeleteEntry}
                />

                <AppIconButton
                    icon="close"
                    label="Close"
                    onPress={onClose}
                    variant="close"
                />
            </ScrollView>
        </Modal>
    );
};
