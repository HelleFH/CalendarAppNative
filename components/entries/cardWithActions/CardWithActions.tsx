import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/styles/ThemeProvider';
import { ThemedView } from '@/styles/ThemedView';
import { ThemedText } from '@/styles/ThemedText';
import { ThemedButton } from '@/styles/ThemedTouchable';
import { ThemedImage } from '@/styles/ThemedImage';
import { DeleteConfirmationModal } from '../DeleteConfirmationModal';
import { ActionMenu } from './ActionMenu';
import { ImageGalleryModal } from './ImageGalleryModal';

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
    const [showGallery, setShowGallery] = useState(false);

  const [showMenu, setShowMenu] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { theme } = useTheme();

  const handleNext = () =>
    setCurrentImageIndex((i) => (i + 1) % images.length);
  const handlePrev = () =>
    setCurrentImageIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <ThemedView variant={size === 'large' ? 'cardLarge' : 'cardSmall'}>
      {images.length > 0 && (
        <ThemedView >
          <TouchableOpacity onPress={onImagePress} activeOpacity={0.9}>
            <ThemedImage
              size={size === 'large' ? 'cardLarge' : 'cardMedium'}
              source={{ uri: images[currentImageIndex] }}
            />
          </TouchableOpacity>

          {images.length > 1 && (
            <>
              <TouchableOpacity
                onPress={handlePrev}
                style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: [{ translateY: -10 }],
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  borderRadius: 20,
                  padding: 6,
                }}
              >
                <Ionicons name="chevron-back" size={24} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNext}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: [{ translateY: -10 }],
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  borderRadius: 20,
                  padding: 6,
                }}
              >
                <Ionicons name="chevron-forward" size={24} color="white" />
              </TouchableOpacity>
            </>
          )}
        </ThemedView>
      )}

      {/* Card Text */}
      <ThemedView
      variant='flexColumnSmall'
        style={{ flex: 1 }}
      >
        <ThemedText variant="title">{title}</ThemedText>
        <ThemedText variant="body"
        >{notes}</ThemedText>

        {/* ===== Small Card: 3-Dot Menu ===== */}
        {size === 'small' && (
          <View style={{ position: 'absolute', top: 0, right: 0 }}>
            <TouchableOpacity
              onPress={() => setShowMenu((prev) => !prev)}
              style={{ padding: 8 }}
            >
              <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.text} />
            </TouchableOpacity>

          </View>
        )}

        <ActionMenu
          visible={showMenu}
          onClose={() => setShowMenu(false)}
          onEdit={onEdit}
          onDelete={() => setShowDelete(true)}
          onView={onImagePress}
        />


        {/* ===== Large Card: Inline Buttons ===== */}
        {size === 'large' && (
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
        )}

        {extraActions}
      </ThemedView>



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
      <ImageGalleryModal
        visible={showDelete}
        onCancelGallery={() => setShowGallery(false)}
    
        itemType="entry"
      />
      {detailModal}
    </ThemedView>
  );
};
