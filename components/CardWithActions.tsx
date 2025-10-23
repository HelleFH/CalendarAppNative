import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppIconButton } from './AppIconButton';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { useTheme } from '../styles/ThemeProvider';
import { getImageStyle } from '@/styles/ThemeHelpers';

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
    onParentPress?: () => void;

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

  const { theme } = useTheme();
  const handleNext = () => setCurrentImageIndex((i) => (i + 1) % images.length);
  const handlePrev = () =>
    setCurrentImageIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        borderRadius: theme.radius.md,
        padding: theme.spacing.xl,
        marginVertical: theme.spacing.sm,
        display:'flex',
        maxWidth:400,
        marginHorizontal:'auto',
        gap:30,
      }}
    >
      <TouchableOpacity     style={{
   
        display:'flex',
        gap:20,
        justifyContent:'center',
        alignItems:'center',
      }}onPress={onPress} activeOpacity={0.7}>
        <Text style={{ fontSize: theme.fontSize.lg, color: theme.colors.text, fontWeight: 'bold' }}>
          {title}
        </Text>
        {subtitle && (
          <Text style={{ fontSize: theme.fontSize.md, color: theme.colors.text }}>
            {subtitle}
          </Text>
        )}
        <Text style={{ fontSize: theme.fontSize.md, color: theme.colors.text }}>{notes}</Text>

        {images.length > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: theme.spacing.sm }}>
            {images.length > 1 && (
              <TouchableOpacity onPress={handlePrev}>
                <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onImagePress}>
              <Image
                source={{ uri: images[currentImageIndex] }}
                style={[getImageStyle(theme, 'large'), { marginHorizontal: theme.spacing.sm }]}
              />
            </TouchableOpacity>
            {images.length > 1 && (
              <TouchableOpacity onPress={handleNext}>
                <Ionicons name="chevron-forward" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', gap: theme.spacing.sm,  justifyContent:'center', }}>
        {onEdit && <AppIconButton icon="pencil" label="Edit" onPress={onEdit} variant="Primary" />}
        {onDelete && <AppIconButton icon="remove" label="Delete" onPress={() => setShowDelete(true)} variant="Delete" />}
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
