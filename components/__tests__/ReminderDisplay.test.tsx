import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ReminderDisplay } from '../reminder/ReminderDisplay';

// Mock dependencies
jest.mock('../components/AppIconButton', () => ({
  AppIconButton: ({ onPress, label }: any) => (
    <button onClick={onPress}>{label}</button>
  ),
}));

jest.mock('../components/DeleteConfirmationModal', () => ({
  DeleteConfirmationModal: ({ visible, onConfirm, onCancel }: any) => (
    visible ? <button onClick={onConfirm}>Confirm Delete</button> : null
  ),
}));

jest.mock('../components/entry/EntryDetailModal', () => ({
  EntryDetailModal: ({ visible }: any) => (
    visible ? <div>Entry Detail Modal</div> : null
  ),
}));

jest.mock('@/utils/entryHandler', () => ({
  fetchAndSetParentEntry: jest.fn((reminder, setParentEntry) => {
    setParentEntry({ _id: 'parent1', name: 'Parent Plant', date: '2025-10-16', notes: 'Test Notes' });
  }),
}));

describe('ReminderDisplay', () => {
  const mockOnEditReminder = jest.fn();
  const mockOnDeleteReminder = jest.fn();

  const reminder = {
    _id: 'r1',
    date: '2025-10-16',
    notes: 'Water today',
    parentObjectId: 'parent1',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading initially and then parent name', async () => {
    const { getByText } = render(
      <ReminderDisplay
        reminder={reminder}
        onEditReminder={mockOnEditReminder}
        onDeleteReminder={mockOnDeleteReminder}
      />
    );

    // Initially "Loading..." appears until fetch sets parent
    await waitFor(() => {
      expect(getByText('Reminder for')).toBeTruthy();
      expect(getByText('Parent Plant')).toBeTruthy();
    });

    // Reminder notes
    expect(getByText(reminder.notes)).toBeTruthy();
  });

  it('calls onEditReminder when Edit button is pressed', async () => {
    const { getByText } = render(
      <ReminderDisplay
        reminder={reminder}
        onEditReminder={mockOnEditReminder}
        onDeleteReminder={mockOnDeleteReminder}
      />
    );

    fireEvent.press(getByText('Edit'));
    expect(mockOnEditReminder).toHaveBeenCalledWith(reminder);
  });

  it('opens DeleteConfirmationModal and calls onDeleteReminder', async () => {
    const { getByText } = render(
      <ReminderDisplay
        reminder={reminder}
        onEditReminder={mockOnEditReminder}
        onDeleteReminder={mockOnDeleteReminder}
      />
    );

    // Open DeleteConfirmationModal
    fireEvent.press(getByText('Delete'));
    await waitFor(() => getByText('Confirm Delete'));

    // Confirm delete
    fireEvent.press(getByText('Confirm Delete'));
    expect(mockOnDeleteReminder).toHaveBeenCalledWith(reminder._id);
  });

  it('opens EntryDetailModal when parent name is clicked', async () => {
    const { getByText, queryByText } = render(
      <ReminderDisplay
        reminder={reminder}
        onEditReminder={mockOnEditReminder}
        onDeleteReminder={mockOnDeleteReminder}
      />
    );

    expect(queryByText('Entry Detail Modal')).toBeNull();
    fireEvent.press(getByText('Parent Plant'));

    await waitFor(() => {
      expect(getByText('Entry Detail Modal')).toBeTruthy();
    });
  });
});
