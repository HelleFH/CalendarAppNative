import React, { useState } from 'react';
import { useTheme } from '@/styles/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { ThemedButton } from '@/styles/ThemedTouchable';
import { ThemedImage } from '@/styles/ThemedImage';

interface CardWithActionsProps {
  title: React.ReactNode;
  subtitle?: string;
  notes: string;
  images?: string[];
  onEdit?: () => void;
  onDelete?: () => void;
  onPress?: () => void;
  onImagePress?: () => void;
  extraActions?: React.ReactNode;
  detailModal?: React.ReactNode;
}

export const CardWithActions: React.FC<CardWithActionsProps> = ({
  title,
  subtitle,
  notes,
  images = [],
  onEdit,
  onDelete,
  onPress,
  onImagePress,
  extraActions,
  detailModal,
}) => {
  const [showDelete, setShowDelete] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  const handleNext = () => setCurrentImageIndex((i) => (i + 1) % images.length);
  const handlePrev = () =>
    setCurrentImageIndex((i) => (i - 1 + images.length) % images.length);
  const { theme } = useTheme();

  return (
    
    <ThemedView variant="cardSmall">
      <ThemedButton onPress={onPress}>
        <ThemedText variant="title">{title}</ThemedText>
        {subtitle && <ThemedText variant="subtitle">{subtitle}</ThemedText>}
        <ThemedText variant="body">{notes}</ThemedText>

        {images.length > 0 && (
          <ThemedView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            {images.length > 1 && (
              <ThemedButton onPress={handlePrev}>
                <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
              </ThemedButton>
            )}

            <ThemedButton onPress={onImagePress}>
              <ThemedImage  source={{ uri: images[currentImageIndex] }} style={{ marginHorizontal: theme.spacing.sm }} />
            </ThemedButton>

            {images.length > 1 && (
              <ThemedButton onPress={handleNext}>
                <Ionicons name="chevron-forward" size={24} color={theme.colors.text} />
              </ThemedButton>
            )}
          </ThemedView>
        )}
      </ThemedButton>

      <ThemedView style={{ flexDirection: 'row', marginTop: theme.spacing.sm, gap: theme.spacing.sm }}>
        {onEdit && <ThemedButton icon="pencil" label="Edit" onPress={onEdit} variant="Primary" />}
        {onDelete && <ThemedButton icon="remove" label="Delete" onPress={() => setShowDelete(true)} variant="Delete" />}
        {extraActions}
      </ThemedView>

      {detailModal}

      <DeleteConfirmationModal
        visible={showDelete}
        onCancel={() => setShowDelete(false)}
        onConfirm={() => {
          onDelete?.();
          setShowDelete(false);
        }}
        itemType="entry"
      />
    </ThemedView>
  );
};
