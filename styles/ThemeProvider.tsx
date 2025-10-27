// ThemeProvider.tsx
import React, { ReactNode, createContext, useContext, useState } from 'react';
import { TextStyle, ViewStyle } from 'react-native';

// ======================
// Type Definitions
// ======================

export type ButtonState = {
  background: string;
  text: string;
  border?: string;
};

export type ButtonVariant = {
  rest: ButtonState;
  pressed: ButtonState;
  disabled: ButtonState;
};
export type TextInputVariantState = {
  background: string;
  border: string;
  text: string;
  placeholder: string;
  style: ViewStyle & TextStyle;
};

export type TextInputVariant = {
  rest: TextInputVariantState;
  focus: TextInputVariantState;
  disabled: TextInputVariantState;
};
export type ImageVariant = {
  width: number;
  height: number;
  borderRadius: number;
  margin:number;
  resizeMode: 'cover' | 'contain' | 'stretch' | 'center' | 'repeat';
};

export type TextVariants = {
  title: TextStyle;
  subtitle: TextStyle;
  body: TextStyle;
  note: TextStyle;
  link: TextStyle;
};

// Card variants
export type CardVariants = {
  small: ViewStyle;
  large: ViewStyle;
  shadow: ViewStyle;
};

// Modal variants
export type ModalVariants = {
  overlay: ViewStyle;
  content: ViewStyle;
  title: TextStyle;
  buttonSpacing: ViewStyle;
};

// Layout variants
export type LayoutVariants = {
  screenContainer: ViewStyle;
  card: CardVariants;
  buttonRow: ViewStyle;
  modal: ModalVariants;
  topMenu: topMenu;
  viewVariants: {
    flexRowLarge: ViewStyle;
    flexRowSmall: ViewStyle;
    flexColumnLarge: ViewStyle;
    flexColumnSmall: ViewStyle;
  };
};

export type topMenu = {
  container: ViewStyle;
  button: ViewStyle;
  overlay: ViewStyle;
  menu: ViewStyle;
  menuItem: ViewStyle;
  menuItemText: TextStyle;
};


export type Theme = {
  colors: {
    primary: any;
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
  Button: {
    Primary: ButtonVariant;
    Secondary: ButtonVariant;
    Tertiary: ButtonVariant;
    Delete: ButtonVariant;
    Edit: ButtonVariant;
    Close: ButtonVariant;


  };
  TextInput: TextInputVariant;

  Image: {
    small: ImageVariant;
    medium: ImageVariant;
    large: ImageVariant;
    cardSmall: ImageVariant;
    cardLarge: ImageVariant;
  };
};

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

// ======================
// Theme Context
// ======================

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    console.trace('⚠️ useTheme called outside ThemeProvider!');
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};


// ======================
// Light & Dark Themes
// ======================

export const lightTheme: Theme = {
  Button: {
    Primary: {
      rest: { background: '#0E4732', text: '#FFFFFF' },
      pressed: { background: '#0C3E2C', text: '#FFFFFF' },
      disabled: { background: '#0E4732', text: '#FFFFFF' },
    },
    Secondary: {
      rest: { background: '#2E7D32', text: '#FFFFFF' },
      pressed: { background: '#276B2C', text: '#FFFFFF' },
      disabled: { background: '#2E7D32', text: '#FFFFFF' },
    },
    Edit: {
      rest: { background: '#1976D2', text: '#FFFFFF' },
      pressed: { background: '#1565C0', text: '#FFFFFF' },
      disabled: { background: '#1976D2', text: '#FFFFFF' },
    },
    Tertiary: {
      rest: { background: 'transparent', text: 'Black' },
      pressed: { background: 'transparent', text: 'Black' },
      disabled: { background: 'transparent', text: 'Black' },
    },
    Delete: {
      rest: { background: '#D32F2F', text: '#FFFFFF' },
      pressed: { background: '#B71C1C', text: '#FFFFFF' },
      disabled: { background: '#D32F2F', text: '#FFFFFF' },
    },
    Close: {
      rest: { background: 'transparent', text: '#E53E3E' },
      pressed: { background: 'transparent', text: '#C53030' },
      disabled: { background: 'transparent', text: '#FFBABA' },
    },
  },

  colors: {
    text: '#333',
    textSecondary: '#555',
    placeholder: '#aaa',
    background: '#fff',
    surface: '#f8f9fa',
    error: '#D32F2F',
    border: '#ccc',
    shadow: '#000',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 4, md: 10, lg: 20 },
  fontSize: { sm: 12, md: 14, lg: 16, xl: 20, xxl: 24 },
  textVariants: {
    title: { fontSize: 26, fontWeight: '700', color: '#222', textAlign: 'center' },
    subtitle: { fontSize: 18, fontWeight: '500', color: '#555', textAlign: 'center' },
    body: { fontSize: 16, color: '#222', textAlign: 'center' },
    note: { fontSize: 14, color: '#777', textAlign: 'center' },
    link: { fontSize: 14, color: '#777', textAlign: 'center', textDecorationLine: 'underline', },
  },
  layout: {
    viewVariants: {
      flexRowLarge: { display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: 700, marginHorizontal: 'auto', gap:18, paddingVertical:16, },
      flexRowSmall: { display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: 400, marginHorizontal: 'auto',gap:16, paddingVertical:16, },
      flexColumnLarge: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: 700, marginHorizontal: 'auto',gap:18, paddingVertical:16, },
      flexColumnSmall: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: 400, marginHorizontal: 'auto' ,gap:16, paddingVertical:16,},
    },
    topMenu: {
      container: {
        alignItems: 'flex-start',
        padding: 16,
      },

      button: {
        padding: 8,
      },
      overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
      },
      menu: {
        position: 'absolute',
        paddingVertical: 8, // theme.spacing.xs
        borderRadius: 10, // theme.radius.md
        backgroundColor: '#fff', // theme.colors.background
        elevation: 5,
        shadowColor: '#000', // theme.colors.shadow
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
      },
      menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
      },
      menuItemText: {
        fontSize: 16,
        marginLeft: 10,
        color: '#222', // theme.colors.text
      },
    },
    screenContainer: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },

    card: {
      small: {
        backgroundColor: '#fff',
        borderRadius: 10,
        alignSelf: 'center',
        width: '100%',
        maxWidth: 300,
        marginVertical: 16,


      },
      large: {
        backgroundColor: '#fff',
        borderRadius: 16,
        alignSelf: 'center',
        width: '95%',
        maxWidth: 500,


      },

      shadow: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        alignSelf: 'center',
        width: '90%',

      },
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 16,
      width: '100%',
      padding: 16,
    },


    modal: {
      overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
      },
      content: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: '100%',
        maxWidth: 350,
        alignItems: 'center',
      },
      title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 16,
        textAlign: 'center',
        color: '#222',
      },
      buttonSpacing: {
        marginBottom: 12,
        width: 200,
      },
    },
  },
  sizes: {
    logoSmall: {
      width: 0,
      height: 0
    },
    logoLarge: {
      width: 0,
      height: 0
    },
    menuWidth: 0
  },

  TextInput: {
    rest: {
      background: '#fff',
      border: '#ccc',
      text: '#000',
      placeholder: '#aaa',
      style: {
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 8,
        fontSize: 16,
        color: '#000',
        backgroundColor: '#fff',
      },
    },
    focus: {
      background: '#fff',
      border: '#4A90E2',
      text: '#000',
      placeholder: '#aaa',
      style: {
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 8,
        fontSize: 16,
        color: '#000',
        backgroundColor: '#fff',
        borderColor: '#4A90E2',
      },
    },
    disabled: {
      background: '#F5F5F5',
      border: '#ccc',
      text: '#aaa',
      placeholder: '#ccc',
      style: {
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 8,
        fontSize: 16,
        color: '#aaa',
        backgroundColor: '#F5F5F5',
        borderColor: '#ccc',
      },
    },
  },



  Image: {
    small: {
      width: 200,
      height: 100,
      borderRadius: 0,
      resizeMode: 'contain',
      margin:16,
    },
    medium: {
      width: 300,
      height: 200,
      resizeMode: 'contain',
      borderRadius: 10,
      margin:18,
    },
    large: {
      width: 400,
      height: 300,
      borderRadius: 0,
      resizeMode: 'cover',
      margin:22,

    },
    cardSmall: {
      width: 120,
      height: 80,
      borderRadius: 8,
      resizeMode: 'cover',
      margin:16,
    },
    cardLarge: {
      width: 300,
      height: 200,
      borderRadius: 12,
      resizeMode: 'cover',
            margin:0,

    },
  },


};



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
    shadow: '#000',
    placeholder: '#bbb',
  },
  Button: {
    Primary: {
      rest: { background: '#0E4732', text: '#FFFFFF' },
      pressed: { background: '#0C3E2C', text: '#FFFFFF' },
      disabled: { background: '#0E4732', text: '#FFFFFF' },
    },
    Secondary: {
      rest: { background: '#2E7D32', text: '#FFFFFF' },
      pressed: { background: '#276B2C', text: '#FFFFFF' },
      disabled: { background: '#2E7D32', text: '#FFFFFF' },
    },
    Edit: {
      rest: { background: '#1976D2', text: '#FFFFFF' },
      pressed: { background: '#1565C0', text: '#FFFFFF' },
      disabled: { background: '#1976D2', text: '#FFFFFF' },
    },
    Delete: {
      rest: { background: '#D32F2F', text: '#FFFFFF' },
      pressed: { background: '#B71C1C', text: '#FFFFFF' },
      disabled: { background: '#D32F2F', text: '#FFFFFF' },
    },
    Close: {
      rest: { background: 'transparent', text: '#E53E3E' },
      pressed: { background: 'transparent', text: '#C53030' },
      disabled: { background: 'transparent', text: '#FFBABA' },
    },
    Tertiary: {
      rest: { background: 'transparent', text: '#E53E3E' },
      pressed: { background: 'transparent', text: '#C53030' },
      disabled: { background: 'transparent', text: '#FFBABA' },
    },
      
  },
  TextInput: {
    rest: {
      background: '#fff',
      border: '#ccc',
      text: '#000',
      placeholder: '#aaa',
      style: {
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 8,
        fontSize: 16,
        color: '#000',
        backgroundColor: '#fff',
      },
    },

    focus: {
      background: '#fff',
      border: '#4A90E2',
      text: '#000',
      placeholder: '#aaa',
      style: {
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 8,
        fontSize: 16,
        color: '#000',
        backgroundColor: '#fff',
      },
    },
    disabled: {
      background: '#F5F5F5',
      border: '#ccc',
      text: '#aaa',
      placeholder: '#ccc',
      style: {
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 8,
        fontSize: 16,
        color: '#aaa',
        backgroundColor: '#F5F5F5',
      },
    },
  },

};

// ======================
// Provider Component
// ======================

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(lightTheme);

  const toggleTheme = () => {
    setTheme((prev) => (prev === lightTheme ? darkTheme : lightTheme));
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};
