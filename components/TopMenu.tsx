import React, { useState, useRef } from 'react';
import { View, Modal, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/App';
import { useTheme } from '@/styles/ThemeProvider';
import { ThemedButton } from '@/styles/ThemedTouchable';

interface TopMenuProps {
  navigation: NavigationProp<RootStackParamList>;
  currentUserId?: string | null;
  onLogout: () => void;
}

export const TopMenu: React.FC<TopMenuProps> = ({ navigation, currentUserId, onLogout }) => {
  const { theme } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const buttonRef = useRef<View>(null);

  const toggleMenu = () => {
    if (!menuVisible && buttonRef.current) {
      buttonRef.current.measure((_fx, _fy, width, height, px, py) => {
        const screenWidth = Dimensions.get('window').width;
        const menuWidth = theme.sizes.menuWidth;
        const safeLeft = Math.min(px, screenWidth - menuWidth - theme.spacing.sm);
        setMenuPosition({ x: safeLeft, y: py + height });
      });
    }
    setMenuVisible(!menuVisible);
  };

  const handleNavigate = (screen: keyof RootStackParamList) => {
    toggleMenu();
    navigation.navigate(screen);
  };

  return (
    <View style={theme.layout.topMenu.container}>
      <ThemedButton
        icon="menu"
        variant="Tertiary"
        onPress={toggleMenu}
      />

      <Modal transparent visible={menuVisible} animationType="fade">
        <Pressable style={theme.layout.topMenu.overlay} onPress={toggleMenu}>
          <View style={[theme.layout.topMenu.menu, { top: menuPosition.y, left: menuPosition.x }]}>
            {currentUserId ? (
              <>
                <ThemedButton
                  icon="person-circle-outline"
                  label="Profile"
                  variant="Tertiary"
                  onPress={() => handleNavigate('ProfileScreen')}
                />
                <ThemedButton
                  icon="log-out-outline"
                  label="Logout"
                  variant="Delete"
                  onPress={() => {
                    toggleMenu();
                    onLogout();
                  }}
                />
              </>
            ) : (
              <ThemedButton
                icon="log-in-outline"
                label="Login"
                variant="Tertiary"
                onPress={() => handleNavigate('LoginScreen')}
              />
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};
