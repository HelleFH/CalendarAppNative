// theme.ts
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

export type Theme = {
  colors: {
    text: string;
    placeholder: string;
    background: string;
    error: string;
    border: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
  };
  fontSize: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
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

  };
  TextInput: {
    rest: { background: string; border: string; text: string; placeholder: string };
    focus: { background: string; border: string; text: string; placeholder: string };
    disabled: { background: string; border: string; text: string; placeholder: string };
  };
};

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
  rest: { background: '#4F772D', text: '#fff' },      // main earthy green
  pressed: { background: '#3C5E23', text: '#fff' },   // darker on press
  disabled: { background: '#A3B899', text: '#fff' },  // muted desaturated green
},
Secondary: {
  rest: { background: '#31572C', text: '#fff' },      // deeper green
  pressed: { background: '#24411F', text: '#fff' },   // darker forest green
  disabled: { background: '#94A98C', text: '#fff' },  // faded olive
},
Tertiary: {
  rest: { background: '#132A13', text: '#fff' },      // very dark green
  pressed: { background: '#0D1E0D', text: '#fff' },   // nearly black-green
  disabled: { background: '#7A8B75', text: '#fff' },  // soft gray-green
},
Delete: {
  rest: { background: '#FF0000', text: '#fff' },      // bright red
  pressed: { background: '#B00000', text: '#fff' },   // darker red when pressed
  disabled: { background: '#F5A5A5', text: '#fff' },  // pale red when disabled
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
        Tertiary: {
      rest: { background: '#858585', text: '#fff' },
      pressed: { background: '#2C8C78', text: '#fff' },
      disabled: { background: '#6ED8C9', text: '#fff' },
    },
           Delete: {
      rest: { background: '#858585', text: '#fff' },
      pressed: { background: '#2C8C78', text: '#fff' },
      disabled: { background: '#6ED8C9', text: '#fff' },
    },
  },
};
