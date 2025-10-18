import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import IndexScreen from '../Welcome';
import { useNavigation } from '@react-navigation/native';

jest.mock('@react-navigation/native');

describe('IndexScreen', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
    jest.clearAllMocks();
  });

  it('renders title, subtitle and benefits', () => {
    const { getByText } = render(<IndexScreen />);
    
    expect(getByText('The Plant Calendar 🌱')).toBeTruthy();
    expect(getByText(/Plant Calendar helps you care for your plants/i)).toBeTruthy();
    expect(getByText(/✔️ Smart reminders/)).toBeTruthy();
    expect(getByText(/✔️ Growth tracking & notes/)).toBeTruthy();
  });

  it('renders Login and Get Started buttons', () => {
    const { getByText } = render(<IndexScreen />);
    
    expect(getByText('Login')).toBeTruthy();
    expect(getByText('Get Started')).toBeTruthy();
  });

  it('navigates to LoginScreen when Login button pressed', () => {
    const { getByText } = render(<IndexScreen />);
    
    fireEvent.press(getByText('Login'));
    expect(mockNavigate).toHaveBeenCalledWith('LoginScreen');
  });

  it('navigates to LoginScreen when Get Started button pressed', () => {
    const { getByText } = render(<IndexScreen />);
    
    fireEvent.press(getByText('Get Started'));
    expect(mockNavigate).toHaveBeenCalledWith('LoginScreen');
  });
});
