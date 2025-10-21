import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, Pressable } from 'react-native';
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
      buttonRef.current.measure((_fx, _fy, width, height, px, py) => setMenuPosition({ x: px, y: py + height, width }));
    }
    setMenuVisible(!menuVisible);
  };

  return (
    <View style={{ alignItems: 'flex-start', padding: theme.spacing.sm }}>
      <TouchableOpacity ref={buttonRef} onPress={toggleMenu} style={{ padding: theme.spacing.xs }}>
        <Ionicons name="menu" size={28} color={theme.colors.text} />
      </TouchableOpacity>

      <Modal transparent visible={menuVisible} animationType="fade">
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }} onPress={toggleMenu}>
          <View
            style={{
              position: 'absolute',
              top: menuPosition.y,
              left: menuPosition.x,
              backgroundColor: theme.colors.background,
              borderRadius: theme.radius.md,
              paddingVertical: theme.spacing.xs,
              width: theme.sizes.menuWidth,
              elevation: 5,
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            {currentUserId ? (
              <>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', padding: theme.spacing.sm }}
                  onPress={() => {
                    toggleMenu();
                    navigation.navigate('ProfileScreen');
                  }}
                >
                  <Ionicons name="person-circle-outline" size={22} color={theme.colors.text} />
                  <Text style={{ fontSize: theme.fontSize.lg, marginLeft: theme.spacing.sm, color: theme.colors.text }}>Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', padding: theme.spacing.sm }}
                  onPress={() => {
                    toggleMenu();
                    onLogout();
                  }}
                >
                  <Ionicons name="log-out-outline" size={22} color={theme.colors.error} />
                  <Text style={{ fontSize: theme.fontSize.lg, marginLeft: theme.spacing.sm, color: theme.colors.error }}>Logout</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', padding: theme.spacing.sm }}
                onPress={() => {
                  toggleMenu();
                  navigation.navigate('LoginScreen');
                }}
              >
                <Ionicons name="log-in-outline" size={22} color={theme.colors.text} />
                <Text style={{ fontSize: theme.fontSize.lg, marginLeft: theme.spacing.sm, color: theme.colors.text }}>Login</Text>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};
