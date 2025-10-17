import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SelectEntryForReminder } from '../reminder/SelectEntryForReminder';

describe('SelectEntryForReminder', () => {
  const allNames = [
    { _id: '1', name: 'Plant A', notes: 'Notes A', images: ['img1.jpg'] },
    { _id: '2', name: 'Plant B', notes: 'Notes B', images: [] },
  ];

  const mockSetParentObjectId = jest.fn();
  const mockSetNotes = jest.fn();
  const mockSetImages = jest.fn();
  const mockSetName = jest.fn();
  const mockOnEntrySelected = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Picker with default option', () => {
    const { getByDisplayValue } = render(
      <SelectEntryForReminder
        allNames={allNames}
        setParentObjectId={mockSetParentObjectId}
        setNotes={mockSetNotes}
        setImages={mockSetImages}
        setName={mockSetName}
        onEntrySelected={mockOnEntrySelected}
      />
    );

    expect(getByDisplayValue('Select an entry...')).toBeTruthy();
  });

  it('calls callbacks when selecting an entry', () => {
    const { getByTestId } = render(
      <SelectEntryForReminder
        allNames={allNames}
        setParentObjectId={mockSetParentObjectId}
        setNotes={mockSetNotes}
        setImages={mockSetImages}
        setName={mockSetName}
        onEntrySelected={mockOnEntrySelected}
      />
    );

    const picker = getByTestId('picker') || null;

    if (!picker) throw new Error('Picker not found');

    // Simulate selecting the first plant
    fireEvent(picker, 'valueChange', '1');

    expect(mockSetParentObjectId).toHaveBeenCalledWith('1');
    expect(mockSetNotes).toHaveBeenCalledWith('Notes A');
    expect(mockSetImages).toHaveBeenCalledWith(['img1.jpg']);
    expect(mockSetName).toHaveBeenCalledWith('Plant A');
    expect(mockOnEntrySelected).toHaveBeenCalledWith('1');
  });
});
