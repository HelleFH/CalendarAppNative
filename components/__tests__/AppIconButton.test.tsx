import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AppIconButton } from '../AppIconButton';
import { Ionicons } from '@expo/vector-icons';

describe('AppIconButton', () => {
  it('renders correctly with label and icon', () => {
    const mockPress = jest.fn();
    const { getByText, getByTestId } = render(
      <AppIconButton icon="add" label="Add Plant" onPress={mockPress} />
    );

    expect(getByText('Add Plant')).toBeTruthy();

    // Ionicons doesn’t provide a direct testID by default, so we check by type
    const icon = getByTestId('icon');
    expect(icon).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockPress = jest.fn();
    const { getByText } = render(
      <AppIconButton icon="add" label="Add Plant" onPress={mockPress} />
    );

    fireEvent.press(getByText('Add Plant'));
    expect(mockPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const mockPress = jest.fn();
    const { getByText } = render(
      <AppIconButton icon="add" label="Add Plant" onPress={mockPress} disabled />
    );

    fireEvent.press(getByText('Add Plant'));
    expect(mockPress).not.toHaveBeenCalled();
  });

  it('applies different variants correctly', () => {
    const mockPress = jest.fn();
    const variants = ['primary', 'secondary', 'edit', 'delete', 'close'] as const;

    variants.forEach((variant) => {
      const { getByText, unmount } = render(
        <AppIconButton icon="add" label={variant} onPress={mockPress} variant={variant} />
      );
      expect(getByText(variant)).toBeTruthy();
      unmount();
    });
  });
});
