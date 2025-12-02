// ThemeProvider.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TextStyle, ViewStyle } from 'react-native';

// ============================================
// 🔹 Type Definitions
// ============================================

type ButtonState = { background: string; text: string; border?: string };
type ButtonVariant = { rest: ButtonState; pressed: ButtonState; disabled: ButtonState };

type TextInputState = {
  background: string;
  border: string;
  text: string;
  placeholder: string;
  style: ViewStyle & TextStyle;
};
type TextInputVariant = { rest: TextInputState; focus: TextInputState; disabled: TextInputState };

type ImageVariant = {
  width: number;
  height: number;
  borderRadius: number;
  resizeMode: 'cover' | 'contain' | 'stretch' | 'center' | 'repeat';
  marginHorizontal: string;
};

type TextVariants = Record<'title' | 'subtitle' | 'body' | 'note' | 'link', TextStyle>;
type CardVariants = Record<'small' | 'large' |'medium' | 'shadow', ViewStyle>;
type ModalVariants = Record<'overlay' | 'content' | 'title' | 'buttonSpacing', ViewStyle | TextStyle>;

type TopMenu = {
  container: ViewStyle;
  button: ViewStyle;
  overlay: ViewStyle;
  menu: ViewStyle;
  menuItem: ViewStyle;
  menuItemText: TextStyle;
};

type LayoutVariants = {
  viewVariants: Record<
    'flexRowLarge' | 'flexRowSmall' | 'flexColumnLarge' | 'flexColumnSmall',
    ViewStyle
  >;
  topMenu: TopMenu;
  screenContainer: ViewStyle;
  card: CardVariants;
  buttonRow: ViewStyle;
  modal: ModalVariants;
};

// ============================================
// 🔹 Theme Type
// ============================================

export type Theme = {
  colors: {
    primary: string;
    text: string;
    textSecondary: string;
    placeholder: string;
    background: string;
    surface: string;
    error: string;
    border: string;
    shadow?: string;
  };
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number };
  radius: { sm: number; md: number; lg: number };
  fontSize: { sm: number; md: number; lg: number; xl: number; xxl: number };
  textVariants: TextVariants;
  layout: LayoutVariants;
  sizes: {
    logoSmall: { width: number; height: number };
    logoLarge: { width: number; height: number };
    menuWidth: number;
  };
  Button: Record<'Primary' | 'Secondary' | 'Tertiary' | 'Delete' | 'Edit' | 'Close', ButtonVariant>;
  TextInput: TextInputVariant;
  Image: Record<'small' | 'medium' | 'large' | 'cardSmall' | 'cardLarge'| 'cardMedium', ImageVariant>;
};

// ============================================
// 🔹 Theme Context
// ============================================

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useTheme = (): ThemeContextProps => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('⚠️ useTheme must be used within a ThemeProvider');
  return ctx;
};

// ============================================
// 🔹 Shared Style Tokens
// ============================================

const baseSpacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
const baseRadius = { sm: 4, md: 10, lg: 20 };
const baseFontSize = { sm: 12, md: 14, lg: 16, xl: 20, xxl: 24 };

// Base button styles reused by both themes
const baseButtons = {
  Primary: { rest: { background: '#0E4732', text: '#fff' }, pressed: { background: '#0C3E2C', text: '#fff' }, disabled: { background: '#0E4732', text: '#fff' } },
  Secondary: { rest: { background: '#2E7D32', text: '#fff' }, pressed: { background: '#276B2C', text: '#fff' }, disabled: { background: '#2E7D32', text: '#fff' } },
  Edit: { rest: { background: '#1976D2', text: '#fff' }, pressed: { background: '#1565C0', text: '#fff' }, disabled: { background: '#1976D2', text: '#fff' } },
  Delete: { rest: { background: '#D32F2F', text: '#fff' }, pressed: { background: '#B71C1C', text: '#fff' }, disabled: { background: '#D32F2F', text: '#fff' } },
  Close: { rest: { background: 'transparent', text: '#E53E3E' }, pressed: { background: 'transparent', text: '#C53030' }, disabled: { background: 'transparent', text: '#FFBABA' } },
  Tertiary: { rest: { background: 'transparent', text: '#000' }, pressed: { background: 'transparent', text: '#000' }, disabled: { background: 'transparent', text: '#888' } },
};

// ============================================
// 🔹 Light Theme
// ============================================

export const lightTheme: Theme = {
  colors: {
    primary: '#333',
    text: '#222',
    textSecondary: '#555',
    placeholder: '#aaa',
    background: '#fff',
    surface: '#f8f9fa',
    error: '#D32F2F',
    border: '#ccc',
    shadow: '#000',
  },
  spacing: baseSpacing,
  radius: baseRadius,
  fontSize: baseFontSize,
  Button: baseButtons,
  textVariants: {
    title: { fontSize: 26, fontWeight: '700', color: '#222', textAlign: 'center' },
    subtitle: { fontSize: 18, fontWeight: '500', color: '#555', textAlign: 'center' },
    body: { fontSize: 16, color: '#222', textAlign: 'center' },
    note: { fontSize: 14, color: '#777', textAlign: 'center' },
    link: { fontSize: 14, color: '#1E90FF', textDecorationLine: 'underline', textAlign: 'center' },
  },
  layout: {
    viewVariants: {
      flexRowLarge: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 18, paddingVertical: 16, width: '100%', maxWidth: 700 },
      flexRowSmall: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 16, paddingVertical: 16, width: '100%', maxWidth: 400 },
      flexColumnLarge: { flexDirection: 'column', alignItems: 'center', gap: 18, paddingVertical: 16, width: '100%', maxWidth: 700 },
      flexColumnSmall: { flexDirection: 'column', alignItems: 'center', gap: 16, paddingVertical: 16, width: '100%', maxWidth: 400 },
    },
    topMenu: {
      container: { alignItems: 'flex-start', padding: 16 },
      button: { padding: 8 },
      overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
      menu: { position: 'absolute', backgroundColor: '#fff', borderRadius: 10, elevation: 5, paddingVertical: 8 },
      menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12 },
      menuItemText: { fontSize: 16, marginLeft: 10, color: '#222' },
    },
    screenContainer: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
    card: {
      small: { backgroundColor: '#fff', borderRadius: 10, alignSelf: 'center', marginVertical: 16, maxWidth: 250 },
      large: { backgroundColor: '#fff', borderRadius: 16, alignSelf: 'center', maxWidth: 500 },
            medium: { backgroundColor: '#fff', borderRadius: 16, alignSelf: 'center', maxWidth: 350 },

      shadow: { backgroundColor: '#fff', borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
    },
    buttonRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16 },
    modal: {
      overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', padding: 16 },
      content: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '90%', maxWidth: 400 },
      title: { fontSize: 20, fontWeight: '700', marginBottom: 16, textAlign: 'center', color: '#222' },
      buttonSpacing: { marginBottom: 12, width: 200 },
    },
  },
  sizes: { logoSmall: { width: 0, height: 0 }, logoLarge: { width: 0, height: 0 }, menuWidth: 0 },
  TextInput: {
    rest: { background: '#fff', border: '#ccc', text: '#000', placeholder: '#aaa', style: { borderWidth: 1, borderRadius: 10, padding: 8, fontSize: 16 } },
    focus: { background: '#fff', border: '#4A90E2', text: '#000', placeholder: '#aaa', style: { borderWidth: 1, borderRadius: 10, padding: 8, fontSize: 16, borderColor: '#4A90E2' } },
    disabled: { background: '#F5F5F5', border: '#ccc', text: '#aaa', placeholder: '#ccc', style: { borderWidth: 1, borderRadius: 10, padding: 8, fontSize: 16, color: '#aaa' } },
  },
  Image: {
    small: { width: 150, height: 150, borderRadius: 0, resizeMode: 'contain', marginHorizontal: 'auto' },
    medium: { width: 200, height: 200, borderRadius: 10, resizeMode: 'contain', marginHorizontal: 'auto' },
    large: { width: 400, height: 400, borderRadius: 0, resizeMode: 'contain', marginHorizontal: 'auto' },
    cardSmall: { width: 200, height: 150, borderRadius: 3, resizeMode: 'cover', marginHorizontal: 'auto' },
    cardLarge: { width: 350, height: 350, borderRadius: 3, resizeMode: 'cover', marginHorizontal: 'auto' },
    cardMedium: { width: 250, height: 200, borderRadius: 10, resizeMode: 'contain', marginHorizontal: 'auto' },

  },
};

// ============================================
// 🔹 Dark Theme
// ============================================

export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    text: '#fff',
    textSecondary: '#ccc',
    background: '#1c1c1c',
    surface: '#2c2c2c',
    error: '#FF6B6B',
    border: '#555',
    placeholder: '#bbb',
  },
  Button: {
    ...baseButtons,
    Tertiary: { rest: { background: 'transparent', text: '#E53E3E' }, pressed: { background: 'transparent', text: '#C53030' }, disabled: { background: 'transparent', text: '#FFBABA' } },
  },
};

// ============================================
// 🔹 Provider Component
// ============================================

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(lightTheme);
  const toggleTheme = () => setTheme((prev) => (prev === lightTheme ? darkTheme : lightTheme));
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};
