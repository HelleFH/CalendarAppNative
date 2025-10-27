import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CardWithActions } from "../CardWithActions";
import { EntryDetailModal } from "./EntryDetailModal";
import { ReminderDisplay } from "../reminder/ReminderDisplay";
import { UpdateEntryDisplay } from "../updateEntry/UpdateEntryDisplay";
import { fetchUpdateEntriesByParent, fetchRemindersByParent } from "@/utils/api";
import { ThemeProvider } from "@/styles/ThemeProvider";
import { ThemedView } from "@/styles/ThemedView";
import { ThemedText } from "../../styles/ThemedText";
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
interface UpdateEntryProps {
  _id: string;
  date: string;
  notes: string;
  images?: string[];
  parentObjectId?: string;
}
interface EntryDisplayProps {
  entry: EntryProps;
  onEditEntry: (entry: EntryProps) => void;
  onEditUpdate: (entry: UpdateEntryProps) => void;
  onDeleteEntry: (id: string) => void;
  onDeleteUpdate: (id: string) => void;
  disableDetailModal?: boolean;
  onRequestCloseModal?: () => void;
}

export const EntryDisplay: React.FC<EntryDisplayProps> = ({
  entry,
  onEditEntry,
  onDeleteEntry,
  onEditUpdate,
  onDeleteUpdate,
  disableDetailModal,
  onRequestCloseModal,
}) => {
  const [updateEntries, setUpdateEntries] = useState<UpdateEntryProps[]>([]);
  const [reminders, setReminders] = useState<ReminderProps[]>([]);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showUpdateList, setShowUpdateList] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!entry._id) return;
      try {
        const [updates, fetchedReminders] = await Promise.all([
          fetchUpdateEntriesByParent(entry._id),
          fetchRemindersByParent(entry._id),
        ]);
        setUpdateEntries(updates);
        setReminders(fetchedReminders);
      } catch (err) {
        console.error("Error loading entry data:", err);
      }
    };
    loadData();
  }, [entry._id]);

  return (
    <ThemedView variant="flexColumnSmall">
      <CardWithActions
        title={
          <ThemedText variant="title"
          >

            {entry.name}

          </ThemedText>
        }
        notes={entry.notes}
        images={entry.images ?? []}
        onPress={(e) => {
    // prevent bubbling from image tap
    e?.stopPropagation?.();
    if (!disableDetailModal) setShowEntryModal(false);
  }}

  onImagePress={(e) => {
    // prevent triggering card onPress
    e?.stopPropagation?.();
    setShowEntryModal(true); // or whatever you intend (e.g. open image viewer)
  }}
     onEdit={() => {
  onRequestCloseModal?.();
  setTimeout(() => onEditEntry(entry), 300);
}}
        
        size={disableDetailModal ? 'large' : 'small'} 
        onDelete={() => onDeleteEntry(entry._id)}
        extraActions={
          updateEntries.length > 0 && (
            <TouchableOpacity onPress={() => setShowUpdateList((prev) => !prev)}>
              <ThemedText variant="link"
              >
                <Ionicons
                  name={showUpdateList ? 'eye-off' : 'eye'}
                  color="#1E90FF"
                />
                {showUpdateList ? 'Hide Updates' : 'View Updates'}
              </ThemedText>
            </TouchableOpacity>
          )
        }
      />

      {/* Toggle update list */}
      {showUpdateList &&
        updateEntries.map((u) => (
          <UpdateEntryDisplay
            key={u._id}
            entry={{ ...u, images: u.images ?? [] }}
            onEditUpdate={onEditUpdate}
            onDeleteUpdate={onDeleteUpdate}
          />
        ))}

      {/* Related reminders */}
      {reminders.length > 0 &&
        reminders.map((reminder) => (
          <ReminderDisplay
            key={reminder._id}
            reminder={reminder}
            onEditReminder={() => { }}
            onDeleteReminder={() => { }}
          />
        ))}

      {/* Single entry detail modal */}
      <EntryDetailModal
        visible={showEntryModal}
        entry={entry}
        onClose={() => setShowEntryModal(false)}
        onEditUpdate={onEditUpdate}
        onDeleteUpdate={onDeleteUpdate}
        onDeleteEntry={onDeleteEntry}
        onEditEntry={onEditEntry}
      />
    </ThemedView>
  );
};