import { Theme } from "./theme";

export const lightTheme: Theme = {
  colors: {
    text: '#333',
    placeholder: '#aaa',
    background: '#fff',
    error: '#D32F2F',
    border: '#ccc',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 4, md: 10, lg: 20 },
  fontSize: { sm: 12, md: 14, lg: 16, xl: 20, xxl: 24 },
  sizes: { logoSmall: { width: 100, height: 30 }, logoLarge: { width: 200, height: 60 }, menuWidth: 160 },
  Button: {
    Primary: {
      rest: { background: '#4A90E2', text: '#fff' },
      pressed: { background: '#357ABD', text: '#fff' },
      disabled: { background: '#A0C4FF', text: '#fff' },
    },
    Secondary: {
      rest: { background: '#50E3C2', text: '#fff' },
      pressed: { background: '#3AB89E', text: '#fff' },
      disabled: { background: '#B2F0E0', text: '#fff' },
    },
  },
  TextInput: {
    rest: { background: '#fff', border: '#ccc', text: '#000', placeholder: '#aaa' },
    focus: { background: '#fff', border: '#4A90E2', text: '#000', placeholder: '#aaa' },
    disabled: { background: '#F5F5F5', border: '#ccc', text: '#aaa', placeholder: '#ccc' },
  },
};

export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    text: '#fff',
    placeholder: '#bbb',
    background: '#1c1c1c',
    error: '#FF6B6B',
    border: '#555',
  },
  Button: {
    Primary: {
      rest: { background: '#357ABD', text: '#fff' },
      pressed: { background: '#2A5A8D', text: '#fff' },
      disabled: { background: '#6B8FBF', text: '#fff' },
    },
    Secondary: {
      rest: { background: '#3AB89E', text: '#fff' },
      pressed: { background: '#2C8C78', text: '#fff' },
      disabled: { background: '#6ED8C9', text: '#fff' },
    },
  },
};
