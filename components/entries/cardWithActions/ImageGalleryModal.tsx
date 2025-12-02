import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/styles/ThemeProvider';
import { ThemedView } from '@/styles/ThemedView';
import { ThemedImage } from '@/styles/ThemedImage';
import { BaseModal } from '../baseModal';

interface ImageGalleryModalProps {
  visible: boolean;
  onClose: () => void;
  images: string[];
}

export const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  visible,
  onClose,
  images = [],
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { theme } = useTheme();

  const handleNext = () => setCurrentImageIndex((i) => (i + 1) % images.length);
  const handlePrev = () => setCurrentImageIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <BaseModal visible={visible} onClose={onClose} title="Gallery">
      {images.length > 0 && (
        <ThemedView>
          <ThemedImage size="cardLarge" source={{ uri: images[currentImageIndex] }} />

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
    </BaseModal>
  );
};
