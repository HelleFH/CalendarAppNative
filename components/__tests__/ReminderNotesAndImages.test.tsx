import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { UpdateNotesAndImages } from '../entries/updateEntry/UpdateNotesAndImages';
import { ReminderNotesAndImages } from '../entries/reminder/ReminderNotesAndImages';

describe('UpdateNotesAndImages', () => {
  const mockSetNotes = jest.fn();
  const mockSaveEntry = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByPlaceholderText } = render(
      <ReminderNotesAndImages notes="" setNotes={mockSetNotes} saveEntry={mockSaveEntry} />
    );

    expect(getByPlaceholderText('Add notes')).toBeTruthy();
  });

  it('calls setNotes when text is changed', () => {
    const { getByPlaceholderText } = render(
      <ReminderNotesAndImages notes="" setNotes={mockSetNotes} saveEntry={mockSaveEntry} />
    );

    const input = getByPlaceholderText('Add notes');

    fireEvent.changeText(input, 'New note content');

    expect(mockSetNotes).toHaveBeenCalledWith('New note content');
  });
});
