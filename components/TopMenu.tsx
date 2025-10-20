// components/TopMenu.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, Pressable } from 'react-native';
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

  const toggleMenu = () => setMenuVisible(!menuVisible);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
        <Ionicons name="menu" size={28} color="#0E4732" />
      </TouchableOpacity>

      <Modal transparent visible={menuVisible} animationType="fade">
        <Pressable style={styles.overlay} onPress={toggleMenu}>
          <View style={styles.menu}>
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
    alignItems: 'flex-end',
    padding: 10,
  },
  menuButton: {
    padding: 6,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menu: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 90,
    marginRight: 15,
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
