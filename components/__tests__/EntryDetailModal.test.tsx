// components/__tests__/EntryDetailModal.test.tsx
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { EntryDetailModal } from '../entry/EntryDetailModal';
import { EntryDisplay } from '../entry/EntryDisplay';
import { UpdateEntryProps } from '../../types/UpdateEntryProps';

// Mock EntryDisplay so we can inspect its props
jest.mock('../entry/EntryDisplay', () => ({
  EntryDisplay: jest.fn(() => null),
}));

const mockUpdates: UpdateEntryProps[] = [
  {
    _id: 'u1',
    date: '2025-10-16',
    notes: 'Update 1',
    images: [],           // optional, can omit
    parentObjectId: '',   // optional, can omit
    testID: 'update-1',   // optional
  },
  {
    _id: 'u2',
    date: '2025-10-17',
    notes: 'Update 2',
    images: [],
    parentObjectId: '',
    testID: 'update-2',
  },
];

beforeEach(() => {
  (global.fetch as jest.Mock) = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockUpdates),
    } as any)
  );
  (EntryDisplay as jest.Mock).mockClear();
});

const entry = {
  _id: '1',
  name: 'Test Plant',
  date: '2025-10-16',
  notes: 'Plant notes',
  images: ['https://example.com/img1.jpg'],
};

const mockOnClose = jest.fn();
const mockOnEditEntry = jest.fn();
const mockOnDeleteEntry = jest.fn();
const mockOnEditUpdate = jest.fn();
const mockOnDeleteUpdate = jest.fn();

describe('EntryDetailModal', () => {
  it('renders EntryDisplay when visible and entry is provided', async () => {
    render(
      <EntryDetailModal
        visible={true}
        entry={entry}
        onClose={mockOnClose}
        onEditEntry={mockOnEditEntry}
        onDeleteEntry={mockOnDeleteEntry}
        onEditUpdate={mockOnEditUpdate}
        onDeleteUpdate={mockOnDeleteUpdate}
      />
    );

    await waitFor(() => {
      expect(EntryDisplay).toHaveBeenCalled();
    });

    // Check props of first call
    const firstCallProps = (EntryDisplay as jest.Mock).mock.calls[0][0];
    expect(firstCallProps).toEqual(
      expect.objectContaining({
        entry,
        disableDetailModal: true,
        showUpdatesInline: false,
        onRequestCloseModal: mockOnClose,
        onEditEntry: mockOnEditEntry,
        onDeleteEntry: mockOnDeleteEntry,
        onEditUpdate: mockOnEditUpdate,
        onDeleteUpdate: mockOnDeleteUpdate,
        testID: 'entry-display',
      })
    );
  });

  it('fetches updates on mount and updates state', async () => {
    render(
      <EntryDetailModal
        visible={true}
        entry={entry}
        onClose={mockOnClose}
        onEditEntry={mockOnEditEntry}
        onDeleteEntry={mockOnDeleteEntry}
        onEditUpdate={mockOnEditUpdate}
        onDeleteUpdate={mockOnDeleteUpdate}
      />
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `http://localhost:5000/updates/${entry._id}`
      );
    });

    // Optionally, check that updates were passed down to EntryDisplay
    const firstCallProps = (EntryDisplay as jest.Mock).mock.calls[0][0];
    expect(firstCallProps.updateEntries).toEqual(mockUpdates);
  });
});
