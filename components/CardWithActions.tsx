import React, { useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/styles/ThemeProvider';
import { ThemedView } from '@/styles/ThemedView';
import { ThemedText } from '../styles/ThemedText';
import { ThemedButton } from '@/styles/ThemedTouchable';
import { ThemedImage } from '@/styles/ThemedImage';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

interface CardWithActionsProps {
  title: React.ReactNode;
  subtitle?: string;
  notes: string;
  images?: string[];
  onEdit?: () => void;
  onDelete?: () => void;
  onPress?: (e?: any) => void;
  onImagePress?: (e?: any) => void;
  extraActions?: React.ReactNode;
  detailModal?: React.ReactNode;
  size?: 'small' | 'large';
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
  size = 'small',
}) => {
  const [showDelete, setShowDelete] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { theme } = useTheme();

  const handleNext = () =>
    setCurrentImageIndex((i) => (i + 1) % images.length);
  const handlePrev = () =>
    setCurrentImageIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <ThemedView variant={size === 'large' ? 'cardLarge' : 'cardSmall'}>
      {/* Card Content */}
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <ThemedView variant="flexColumnLarge">
          <ThemedText variant="title">{title}</ThemedText>
          {subtitle && <ThemedText variant="subtitle">{subtitle}</ThemedText>}
          <ThemedText variant="body">{notes}</ThemedText>
        </ThemedView>
      </TouchableOpacity>

      {/* Image Carousel */}
      {images.length > 0 && (
        <View style={{ marginTop: theme.spacing.sm }}>
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity onPress={onImagePress} activeOpacity={0.9}>
              <ThemedImage
                size={size === 'large' ? 'cardLarge' : 'cardSmall'}
                source={{ uri: images[currentImageIndex] }}
              />
            </TouchableOpacity>
          </View>

          {/* Left/Right Chevrons */}
          {images.length > 1 && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                position: 'absolute',
                top: '50%',
                left: 10,
                right: 10,
              }}
            >
              <TouchableOpacity onPress={handlePrev}>
                <Ionicons name="chevron-back" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNext}>
                <Ionicons name="chevron-forward" size={20} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Action Buttons */}
      <ThemedView variant="buttonRow">
        {onEdit && (
          <ThemedButton
            icon="pencil"
            label="Edit"
            onPress={onEdit}
            variant="Primary"
          />
        )}
        {onDelete && (
          <ThemedButton
            icon="remove"
            label="Delete"
            onPress={() => setShowDelete(true)}
            variant="Delete"
          />
        )}
      </ThemedView>

      {/* Extra actions and detail modal */}
      {extraActions}
      {detailModal}

      {/* Delete Confirmation */}
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
