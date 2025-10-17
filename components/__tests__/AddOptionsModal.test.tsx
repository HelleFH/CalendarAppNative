import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AddOptionsModal } from '../AddOptionsModal';

describe('AddOptionsModal', () => {
  const mockOnClose = jest.fn();
  const mockOnAddEntry = jest.fn();
  const mockOnAddUpdate = jest.fn();
  const mockOnAddReminder = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal and buttons when visible', () => {
    const { getByText } = render(
      <AddOptionsModal
        visible={true}
        onClose={mockOnClose}
        onAddEntry={mockOnAddEntry}
        onAddUpdate={mockOnAddUpdate}
        onAddReminder={mockOnAddReminder}
      />
    );

    // Check modal title
    expect(getByText('What would you like to add?')).toBeTruthy();

    // Check all buttons
    expect(getByText('New Plant')).toBeTruthy();
    expect(getByText('+ Plant Update')).toBeTruthy();
    expect(getByText('Reminder')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
  });

  it('does not render modal content when visible is false', () => {
    const { queryByText } = render(
      <AddOptionsModal
        visible={false}
        onClose={mockOnClose}
        onAddEntry={mockOnAddEntry}
        onAddUpdate={mockOnAddUpdate}
        onAddReminder={mockOnAddReminder}
      />
    );

    expect(queryByText('What would you like to add?')).toBeNull();
    expect(queryByText('New Plant')).toBeNull();
    expect(queryByText('+ Plant Update')).toBeNull();
    expect(queryByText('Reminder')).toBeNull();
    expect(queryByText('Cancel')).toBeNull();
  });

  it('calls onAddEntry when New Plant button is pressed', () => {
    const { getByText } = render(
      <AddOptionsModal
        visible={true}
        onClose={mockOnClose}
        onAddEntry={mockOnAddEntry}
        onAddUpdate={mockOnAddUpdate}
        onAddReminder={mockOnAddReminder}
      />
    );

    fireEvent.press(getByText('New Plant'));
    expect(mockOnAddEntry).toHaveBeenCalled();
  });

  it('calls onAddUpdate when + Plant Update button is pressed', () => {
    const { getByText } = render(
      <AddOptionsModal
        visible={true}
        onClose={mockOnClose}
        onAddEntry={mockOnAddEntry}
        onAddUpdate={mockOnAddUpdate}
        onAddReminder={mockOnAddReminder}
      />
    );

    fireEvent.press(getByText('+ Plant Update'));
    expect(mockOnAddUpdate).toHaveBeenCalled();
  });

  it('calls onAddReminder when Reminder button is pressed', () => {
    const { getByText } = render(
      <AddOptionsModal
        visible={true}
        onClose={mockOnClose}
        onAddEntry={mockOnAddEntry}
        onAddUpdate={mockOnAddUpdate}
        onAddReminder={mockOnAddReminder}
      />
    );

    fireEvent.press(getByText('Reminder'));
    expect(mockOnAddReminder).toHaveBeenCalled();
  });

  it('calls onClose when Cancel button is pressed', () => {
    const { getByText } = render(
      <AddOptionsModal
        visible={true}
        onClose={mockOnClose}
        onAddEntry={mockOnAddEntry}
        onAddUpdate={mockOnAddUpdate}
        onAddReminder={mockOnAddReminder}
      />
    );

    fireEvent.press(getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
