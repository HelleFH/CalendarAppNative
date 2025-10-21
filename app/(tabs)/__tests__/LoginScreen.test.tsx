import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '@/app/(tabs)/LoginScreen';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

jest.mock('firebase/auth');
jest.mock('@react-navigation/native');

describe('LoginScreen', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
    jest.clearAllMocks();
  });

  it('renders inputs and buttons', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Register')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
  });

  it('calls Firebase register on Register button press', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({ user: { uid: '123' } });
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), '123456');
    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(), // auth
        'test@example.com',
        '123456'
      );
      expect(mockNavigate).toHaveBeenCalledWith('Calendar');
    });
  });

  it('shows error if register fails', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValueOnce({ message: 'Register error' });
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), '123456');
    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(getByText('Register error')).toBeTruthy();
    });
  });

  it('calls Firebase login on Login button press', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({ user: { uid: '123' } });
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), '123456');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(), 
        'test@example.com',
        '123456'
      );
      expect(mockNavigate).toHaveBeenCalledWith('Calendar');
    });
  });

  it('shows error if login fails', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce({ message: 'Login error' });
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), '123456');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(getByText('Login error')).toBeTruthy();
    });
  });
});
