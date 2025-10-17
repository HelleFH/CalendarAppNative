import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { EntryDetailModal } from '../entry/EntryDetailModal';
import { EntryDisplay } from '../entry/EntryDisplay';

jest.mock('../components/entry/EntryDisplay', () => ({
  EntryDisplay: jest.fn(() => null),
}));

// Mock global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([{ _id: 'u1', date: '2025-10-16', notes: 'Update note' }]),
  })
) as jest.Mock;

describe('EntryDetailModal', () => {
  const mockOnClose = jest.fn();
  const mockOnEditUpdate = jest.fn();
  const mockOnDeleteUpdate = jest.fn();
  const mockOnEditEntry = jest.fn();
  const mockOnDeleteEntry = jest.fn();

  const entry = {
    _id: '1',
    name: 'Test Plant',
    date: '2025-10-16',
    notes: 'Plant notes',
    images: ['https://example.com/img1.jpg'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders EntryDisplay when visible and entry is provided', async () => {
    render(
      <EntryDetailModal
        visible={true}
        entry={entry}
        onClose={mockOnClose}
        onEditUpdate={mockOnEditUpdate}
        onDeleteUpdate={mockOnDeleteUpdate}
        onEditEntry={mockOnEditEntry}
        onDeleteEntry={mockOnDeleteEntry}
      />
    );

    await waitFor(() => {
      expect(EntryDisplay).toHaveBeenCalledWith(
        expect.objectContaining({
          entry,
          onEditUpdate: mockOnEditUpdate,
          onDeleteUpdate: mockOnDeleteUpdate,
          onEditEntry: mockOnEditEntry,
          onDeleteEntry: mockOnDeleteEntry,
          disableDetailModal: true,
          showUpdatesInline: false,
          onRequestCloseModal: mockOnClose,
        }),
        {}
      );
    });
  });

  it('calls onClose when close button is pressed', () => {
    const { getByRole } = render(
      <EntryDetailModal
        visible={true}
        entry={entry}
        onClose={mockOnClose}
        onEditUpdate={mockOnEditUpdate}
        onDeleteUpdate={mockOnDeleteUpdate}
        onEditEntry={mockOnEditEntry}
        onDeleteEntry={mockOnDeleteEntry}
      />
    );

    // Ionicons renders as accessibilityRole "image" by default; find TouchableOpacity containing it
    const touchable = getByRole('button');
    fireEvent.press(touchable);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('does not render anything if entry is null', () => {
    const { queryByText } = render(
      <EntryDetailModal
        visible={true}
        entry={null}
        onClose={mockOnClose}
        onEditUpdate={mockOnEditUpdate}
        onDeleteUpdate={mockOnDeleteUpdate}
        onEditEntry={mockOnEditEntry}
        onDeleteEntry={mockOnDeleteEntry}
      />
    );

    expect(queryByText('Test Plant')).toBeNull();
  });

  it('fetches updates on mount', async () => {
    render(
      <EntryDetailModal
        visible={true}
        entry={entry}
        onClose={mockOnClose}
        onEditUpdate={mockOnEditUpdate}
        onDeleteUpdate={mockOnDeleteUpdate}
        onEditEntry={mockOnEditEntry}
        onDeleteEntry={mockOnDeleteEntry}
      />
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/updates/1');
    });
  });
});
