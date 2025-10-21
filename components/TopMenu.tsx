import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/styles/ThemeProvider';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/App';

interface TopMenuProps {
  navigation: NavigationProp<RootStackParamList>;
  currentUserId?: string | null;
  onLogout: () => void;
}

export const TopMenu: React.FC<TopMenuProps> = ({ navigation, currentUserId, onLogout }) => {
  const { theme } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number; width: number }>({ x: 0, y: 0, width: 0 });
  const buttonRef = useRef<View>(null);

  const toggleMenu = () => {
    if (!menuVisible && buttonRef.current) {
      buttonRef.current.measure((_fx, _fy, width, height, px, py) => {
        const screenWidth = Dimensions.get('window').width;
        const menuWidth = theme.sizes.menuWidth;
        const safeLeft = Math.min(px, screenWidth - menuWidth - theme.spacing.sm);
        setMenuPosition({ x: safeLeft, y: py + height, width: menuWidth });
      });
    }
    setMenuVisible(!menuVisible);
  };

  return (
    <View style={{ alignItems: 'flex-start', padding: theme.spacing.sm }}>
      <TouchableOpacity ref={buttonRef} onPress={toggleMenu} style={{ padding: theme.spacing.xs }}>
        <Ionicons name="menu" size={28} color={theme.colors.text} />
      </TouchableOpacity>

      <Modal transparent visible={menuVisible} animationType="fade">
        <Pressable style={styles.overlay} onPress={toggleMenu}>
          <View
            style={[
              styles.menu,
              {
                top: menuPosition.y,
                left: menuPosition.x,
                backgroundColor: theme.colors.background,
                width: theme.sizes.menuWidth,
                borderRadius: theme.radius.md,
                shadowColor: theme.colors.border,
              },
            ]}
          >
            {currentUserId ? (
              <>
                <MenuItem
                  icon="person-circle-outline"
                  text="Profile"
                  color={theme.colors.text}
                  onPress={() => {
                    toggleMenu();
                    navigation.navigate('ProfileScreen');
                  }}
                />
                <MenuItem
                  icon="log-out-outline"
                  text="Logout"
                  color={theme.colors.error}
                  onPress={() => {
                    toggleMenu();
                    onLogout();
                  }}
                />
              </>
            ) : (
              <MenuItem
                icon="log-in-outline"
                text="Login"
                color={theme.colors.text}
                onPress={() => {
                  toggleMenu();
                  navigation.navigate('LoginScreen');
                }}
              />
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const MenuItem = ({
  icon,
  text,
  color,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  color: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={22} color={color} />
    <Text style={[styles.menuText, { color }]}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  menu: {
    position: 'absolute',
    paddingVertical: 4,
    elevation: 5,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
  },
});
