import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { EntryDisplay } from '../entry/EntryDisplay';
import { fetchUpdateEntriesByParent, fetchRemindersByParent } from '@/utils/api';
import { Text } from 'react-native';

jest.mock('@/utils/api', () => ({
  fetchUpdateEntriesByParent: jest.fn(),
  fetchRemindersByParent: jest.fn(),
}));

jest.mock('../updateEntry/UpdateEntryDisplay', () => ({
  UpdateEntryDisplay: ({ entry }: any) => <Text>{entry.notes}</Text>,
}));

jest.mock('../reminder/ReminderDisplay', () => ({
  ReminderDisplay: ({ reminder }: any) => <Text>{reminder.notes}</Text>,
}));

jest.mock('../DeleteConfirmationModal', () => ({
  DeleteConfirmationModal: ({ visible }: any) => visible ? <Text>Delete Modal</Text> : null,
}));

jest.mock('../EntryDetailModal', () => ({
  EntryDetailModal: ({ visible }: any) => visible ? <Text>Entry Detail Modal</Text> : null,
}));

jest.mock('../AppIconButton', () => ({
  AppIconButton: ({ onPress, label }: any) => <Text onPress={onPress}>{label}</Text>,
}));

describe('EntryDisplay', () => {
  const mockOnEditEntry = jest.fn();
  const mockOnDeleteEntry = jest.fn();
  const mockOnEditUpdate = jest.fn();
  const mockOnDeleteUpdate = jest.fn();

  const entry = {
    _id: '1',
    name: 'Test Plant',
    date: '2025-10-16',
    notes: 'Plant notes',
    images: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (fetchUpdateEntriesByParent as jest.Mock).mockResolvedValue([]);
    (fetchRemindersByParent as jest.Mock).mockResolvedValue([]);
  });

  it('renders entry name, date, and notes', async () => {
    const { getByText } = render(
      <EntryDisplay
        entry={entry}
        onEditEntry={mockOnEditEntry}
        onDeleteEntry={mockOnDeleteEntry}
        onEditUpdate={mockOnEditUpdate}
        onDeleteUpdate={mockOnDeleteUpdate}
      />
    );

    expect(getByText('Test Plant (2025-10-16)')).toBeTruthy();
    expect(getByText('Plant notes')).toBeTruthy();
  });

  it('calls onEditEntry when Edit button pressed', async () => {
    const { getByText } = render(
      <EntryDisplay
        entry={entry}
        onEditEntry={mockOnEditEntry}
        onDeleteEntry={mockOnDeleteEntry}
        onEditUpdate={mockOnEditUpdate}
        onDeleteUpdate={mockOnDeleteUpdate}
      />
    );

    fireEvent.press(getByText('Edit'));
    expect(mockOnEditEntry).toHaveBeenCalledWith(entry);
  });

  it('calls onDeleteEntry when Delete button pressed', async () => {
    const { getByText } = render(
      <EntryDisplay
        entry={entry}
        onEditEntry={mockOnEditEntry}
        onDeleteEntry={mockOnDeleteEntry}
        onEditUpdate={mockOnEditUpdate}
        onDeleteUpdate={mockOnDeleteUpdate}
      />
    );

    fireEvent.press(getByText('Delete'));
    expect(mockOnDeleteEntry).toHaveBeenCalledWith(entry._id);
  });

  it('opens EntryDetailModal when entry is pressed', async () => {
    const { getByText } = render(
      <EntryDisplay
        entry={entry}
        onEditEntry={mockOnEditEntry}
        onDeleteEntry={mockOnDeleteEntry}
        onEditUpdate={mockOnEditUpdate}
        onDeleteUpdate={mockOnDeleteUpdate}
      />
    );

    fireEvent.press(getByText('Test Plant (2025-10-16)'));
    await waitFor(() => {
      expect(getByText('Entry Detail Modal')).toBeTruthy();
    });
  });

  it('navigates through images when multiple images are present', async () => {
    const { getByLabelText, getByTestId } = render(
      <EntryDisplay
        entry={entry}
        onEditEntry={mockOnEditEntry}
        onDeleteEntry={mockOnDeleteEntry}
        onEditUpdate={mockOnEditUpdate}
        onDeleteUpdate={mockOnDeleteUpdate}
      />
    );

    // You can add tests for next/prev image if you give TouchableOpacity accessibilityLabel or testID
  });

  it('fetches updates and reminders on mount', async () => {
    render(
      <EntryDisplay
        entry={entry}
        onEditEntry={mockOnEditEntry}
        onDeleteEntry={mockOnDeleteEntry}
        onEditUpdate={mockOnEditUpdate}
        onDeleteUpdate={mockOnDeleteUpdate}
      />
    );

    await waitFor(() => {
      expect(fetchUpdateEntriesByParent).toHaveBeenCalledWith(entry._id);
      expect(fetchRemindersByParent).toHaveBeenCalledWith(entry._id);
    });
  });
});
