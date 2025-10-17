import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CreateEntryModal } from '../entry/CreateEntryModal';
import { NotesAndImages } from '../entry/NotesAndImages';

// Mock NotesAndImages to simplify tests
jest.mock('../components/entry/NotesAndImages', () => ({
  NotesAndImages: jest.fn(() => null),
}));

describe('CreateEntryModal', () => {
  const mockOnClose = jest.fn();
  const mockSaveEntry = jest.fn();
  const mockSaveEditedEntry = jest.fn();
  const mockSetNotes = jest.fn();
  const mockSetImages = jest.fn();
  const mockSetName = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with title and NotesAndImages when visible', () => {
    const { getByText } = render(
      <CreateEntryModal
        visible={true}
        onClose={mockOnClose}
        isEditing={false}
        saveEntry={mockSaveEntry}
        saveEditedEntry={mockSaveEditedEntry}
        notes=""
        setNotes={mockSetNotes}
        images={[]}
        setImages={mockSetImages}
        name=""
        setName={mockSetName}
        selectedDate="2025-10-16"
      />
    );

    expect(getByText('Add a plant for 2025-10-16')).toBeTruthy();
    expect(NotesAndImages).toHaveBeenCalledWith(
      expect.objectContaining({
        notes: "",
        setNotes: mockSetNotes,
        images: [],
        setImages: mockSetImages,
        name: "",
        setName: mockSetName,
        saveEntry: mockSaveEntry,
        entryId: undefined,
      }),
      {}
    );
  });

  it('calls saveEntry when Save Entry button pressed and isEditing is false', () => {
    const { getByText } = render(
      <CreateEntryModal
        visible={true}
        onClose={mockOnClose}
        isEditing={false}
        saveEntry={mockSaveEntry}
        saveEditedEntry={mockSaveEditedEntry}
        notes=""
        setNotes={mockSetNotes}
        images={[]}
        setImages={mockSetImages}
        name=""
        setName={mockSetName}
        selectedDate="2025-10-16"
      />
    );

    fireEvent.press(getByText('Save Entry'));
    expect(mockSaveEntry).toHaveBeenCalled();
  });

  it('calls saveEditedEntry when Save Changes button pressed and isEditing is true', () => {
    const { getByText } = render(
      <CreateEntryModal
        visible={true}
        onClose={mockOnClose}
        isEditing={true}
        saveEntry={mockSaveEntry}
        saveEditedEntry={mockSaveEditedEntry}
        notes=""
        setNotes={mockSetNotes}
        images={[]}
        setImages={mockSetImages}
        name=""
        setName={mockSetName}
        selectedDate="2025-10-16"
      />
    );

    fireEvent.press(getByText('Save Changes'));
    expect(mockSaveEditedEntry).toHaveBeenCalled();
  });

  it('calls onClose when Cancel button pressed', () => {
    const { getByText } = render(
      <CreateEntryModal
        visible={true}
        onClose={mockOnClose}
        isEditing={false}
        saveEntry={mockSaveEntry}
        saveEditedEntry={mockSaveEditedEntry}
        notes=""
        setNotes={mockSetNotes}
        images={[]}
        setImages={mockSetImages}
        name=""
        setName={mockSetName}
        selectedDate="2025-10-16"
      />
    );

    fireEvent.press(getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('does not render content when visible is false', () => {
    const { queryByText } = render(
      <CreateEntryModal
        visible={false}
        onClose={mockOnClose}
        isEditing={false}
        saveEntry={mockSaveEntry}
        saveEditedEntry={mockSaveEditedEntry}
        notes=""
        setNotes={mockSetNotes}
        images={[]}
        setImages={mockSetImages}
        name=""
        setName={mockSetName}
        selectedDate="2025-10-16"
      />
    );

    expect(queryByText('Add a plant for 2025-10-16')).toBeNull();
    expect(queryByText('Save Entry')).toBeNull();
    expect(queryByText('Cancel')).toBeNull();
  });
});
