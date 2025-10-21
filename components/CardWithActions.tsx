import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { AppIconButton } from './AppIconButton';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { Ionicons } from '@expo/vector-icons';
import { commonStyles } from '@/styles/SharedStyles';

interface CardWithActionsProps {
  title: string;
  subtitle?: string;
  notes: string;
  images?: string[];
  onEdit?: () => void;
  onDelete?: () => void;
  onPress?: () => void;
  extraActions?: React.ReactNode;
  theme?: any;
  detailModal?: React.ReactNode; // any modal shown on press
}

export const CardWithActions: React.FC<CardWithActionsProps> = ({
  title,
  subtitle,
  notes,
  images = [],
  onEdit,
  onDelete,
  onPress,
  extraActions,
  detailModal,
}) => {
  const [showDelete, setShowDelete] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNext = () => setCurrentImageIndex((i) => (i + 1) % images.length);
  const handlePrev = () =>
    setCurrentImageIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <View style={commonStyles.entryContainer}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Text style={commonStyles.title}>{title}</Text>
        {subtitle && <Text style={commonStyles.subtitle}>{subtitle}</Text>}
        <Text style={commonStyles.notes}>{notes}</Text>

        {images.length > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
            {images.length > 1 && (
              <TouchableOpacity onPress={handlePrev}>
                <Ionicons name="chevron-back" size={24} color="black" />
              </TouchableOpacity>
            )}
            <Image source={{ uri: images[currentImageIndex] }} style={commonStyles.image} />
            {images.length > 1 && (
              <TouchableOpacity onPress={handleNext}>
                <Ionicons name="chevron-forward" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </TouchableOpacity>

      <View style={commonStyles.buttonWrapper}>
        {onEdit && <AppIconButton icon="pencil" label="Edit" onPress={onEdit} variant="Primary" />}
        {onDelete && (
          <AppIconButton
            icon="remove"
            label="Delete"
            onPress={() => setShowDelete(true)}
            variant="Delete"
          />
        )}
        {extraActions}
      </View>

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
    </View>
  );
};
