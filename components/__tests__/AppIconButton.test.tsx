import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';


describe('AppIconButton', () => {
  it('renders correctly with label and icon', () => {
    const mockPress = jest.fn();
    const { getByText, getByTestId } = render(
      <ThemedButton icon="add" label="Add Plant" onPress={mockPress} />
    );

    // Check the label
    expect(getByText('Add Plant')).toBeTruthy();

    // Check the icon via testID
    const icon = getByTestId('icon');
    expect(icon).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockPress = jest.fn();
    const { getByText } = render(
      <ThemedButton icon="add" label="Add Plant" onPress={mockPress} />
    );

    fireEvent.press(getByText('Add Plant'));
    expect(mockPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const mockPress = jest.fn();
    const { getByText } = render(
      <ThemedButton icon="add" label="Add Plant" onPress={mockPress} disabled />
    );

    fireEvent.press(getByText('Add Plant'));
    expect(mockPress).not.toHaveBeenCalled();
  });

  it('applies different variants correctly', () => {
    const mockPress = jest.fn();
    const variants = ['primary', 'secondary', 'edit', 'delete', 'close'] as const;

    variants.forEach((variant) => {
      const { getByText, unmount } = render(
        <ThemedButton icon="add" label={variant} onPress={mockPress} variant={variant} />
      );
      expect(getByText(variant)).toBeTruthy();
      unmount();
    });
  });
});
