import React, { useEffect, useState } from "react";
import { CardWithActions } from "../cardWithActions/CardWithActions";
import { UpdateEntryDetailModal } from "./UpdateEntryDetailModal";
import { EntryDetailModal } from "../entry/EntryDetailModal";
import { fetchAndSetParentEntry } from "@/utils/entryHandler";
import { ThemedText } from "../../../styles/ThemedText";
import { ThemedView } from "@/styles/ThemedView";

interface UpdateEntryProps {
  _id: string;
  date: string;
  notes: string;
  images?: string[];
  parentObjectId?: string;
}

interface EntryProps {
  _id: string;
  name: string;
  date: string;
  notes: string;
  images?: string[];
}

interface UpdateEntryDisplayProps {
  entry: UpdateEntryProps;
  onEditUpdate: (entry: UpdateEntryProps) => void;
  onDeleteUpdate: (entryId: string) => void;
  disableDetailModal?: boolean;
  fetchNames?: () => Promise<void>;
  setEditingEntryId?: React.Dispatch<React.SetStateAction<string | null>>;
  parentEntryName?: string;
  setParentObjectId?: React.Dispatch<React.SetStateAction<string | null>>;
  onRefreshEntries?: () => void;
  onRequestCloseModal?: () => void;
}

export const UpdateEntryDisplay: React.FC<UpdateEntryDisplayProps> = ({
  entry,
  onEditUpdate,
  onDeleteUpdate,
  disableDetailModal,
  setEditingEntryId,
  parentEntryName,
  onRequestCloseModal,
}) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showParentEntryModal, setShowParentEntryModal] = useState(false);
  const [parentEntry, setParentEntry] = useState<EntryProps | null>(null);

  useEffect(() => {
    if (parentEntryName) {
      setParentEntry({
        _id: entry.parentObjectId || "unknown",
        name: parentEntryName,
        date: "",
        notes: "",
        images: [],
      });
    } else if (entry?.parentObjectId) {
      fetchAndSetParentEntry(entry, setParentEntry);
    }
  }, [entry.parentObjectId, parentEntryName]);

  return (
    <ThemedView>
      <CardWithActions
        title={
          !disableDetailModal && (
            <ThemedText>
              Update for{" "}
              {parentEntry?.name ? (
                <ThemedText
                  variant="link"
                  onPress={() => setShowParentEntryModal(true)}
                >
                  {parentEntry.name}
                </ThemedText>
              ) : (
                "Unknown Parent"
              )}{" "}
          
            </ThemedText>
          )
        }
        notes={entry.notes}
        images={entry.images ?? []}
        onPress={(e) => {
          e?.stopPropagation?.();
          if (!disableDetailModal) setShowDetailModal(true);
        }}
        onImagePress={(e) => {
          e?.stopPropagation?.();
          if (!disableDetailModal) setShowDetailModal(true);
        }}
        onEdit={() => {
          onRequestCloseModal?.();
          setTimeout(() => {
            onEditUpdate(entry);
            setEditingEntryId?.(entry._id);
          }, 300);
        }}
        onDelete={() => onDeleteUpdate(entry._id)}
        size={disableDetailModal ? "large" : "small"}
      />

      {/* Update Entry Detail Modal */}
      <UpdateEntryDetailModal
        visible={showDetailModal}
        entry={entry}
        onClose={() => setShowDetailModal(false)}
        onEditUpdate={onEditUpdate}
        onDeleteUpdate={onDeleteUpdate}
      />

      {/* Parent Entry Modal */}
      {parentEntry && (
        <EntryDetailModal
          visible={showParentEntryModal}
          entry={parentEntry}
          onClose={() => setShowParentEntryModal(false)}
          onEditUpdate={onEditUpdate}
          onDeleteUpdate={onDeleteUpdate}
          onDeleteEntry={() => {}}
          onEditEntry={() => {}}
        />
      )}
    </ThemedView>
  );
};
