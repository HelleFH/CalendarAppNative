import { View, TouchableOpacity, Text, StyleSheet, Modal, Pressable } from 'react-native';
import React, { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/App';

interface TopMenuProps {
  navigation: NavigationProp<RootStackParamList>;
  currentUserId?: string | null;
  onLogout: () => void;
}

export const TopMenu: React.FC<TopMenuProps> = ({ navigation, currentUserId, onLogout }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number; width: number }>({
    x: 0,
    y: 0,
    width: 0,
  });
  const buttonRef = useRef<View>(null);

  const toggleMenu = () => {
    if (!menuVisible && buttonRef.current) {
      // measure the button position for absolute placement
      buttonRef.current.measure((_fx, _fy, width, height, px, py) => {
        setMenuPosition({ x: px, y: py + height, width });
      });
    }
    setMenuVisible(!menuVisible);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity ref={buttonRef} onPress={toggleMenu} style={styles.menuButton}>
        <Ionicons name="menu" size={28} color="#0E4732" />
      </TouchableOpacity>

      <Modal transparent visible={menuVisible} animationType="fade">
        <Pressable style={styles.overlay} onPress={toggleMenu}>
          <View
            style={[
              styles.menu,
              {
                position: 'absolute',
                top: menuPosition.y,
                left: menuPosition.x,
              },
            ]}
          >
            {currentUserId ? (
              <>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    toggleMenu();
                    navigation.navigate('ProfileScreen');
                  }}
                >
                  <Ionicons name="person-circle-outline" size={22} color="#0E4732" />
                  <Text style={styles.menuText}>Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    toggleMenu();
                    onLogout();
                  }}
                >
                  <Ionicons name="log-out-outline" size={22} color="#D32F2F" />
                  <Text style={[styles.menuText, { color: '#D32F2F' }]}>Logout</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  toggleMenu();
                  navigation.navigate('LoginScreen');
                }}
              >
                <Ionicons name="log-in-outline" size={22} color="#0E4732" />
                <Text style={styles.menuText}>Login</Text>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    padding: 10,
  },
  menuButton: {
    padding: 6,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  menu: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 8,
    width: 160,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#0E4732',
  },
});
