import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CreateReminderModal } from '../reminder/CreateReminderModal';

jest.mock('../components/AppIconButton', () => ({
  AppIconButton: ({ onPress, label }: any) => (
    <button onClick={onPress}>{label}</button>
  ),
}));

jest.mock('../components/reminder/SelectEntryForReminder', () => ({
  SelectEntryForReminder: ({ onEntrySelected }: any) => (
    <button onClick={() => onEntrySelected('id1')}>Select Entry</button>
  ),
}));

describe('CreateReminderModal', () => {
  const mockOnClose = jest.fn();
  const mockSaveReminder = jest.fn();
  const mockSetNotes = jest.fn();
  const mockSetParentObjectId = jest.fn();
  const mockSetReminderDate = jest.fn();
  const mockSetName = jest.fn();
  const mockSetImages = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // mock window.alert for tests
    global.alert = jest.fn();
  });

  it('renders modal and input fields', () => {
    const { getByPlaceholderText, getByText } = render(
      <CreateReminderModal
        visible={true}
        onClose={mockOnClose}
        saveReminder={mockSaveReminder}
        notes=""
        setNotes={mockSetNotes}
        parentObjectId={null}
        setParentObjectId={mockSetParentObjectId}
        allNames={[]}
        reminderDate={undefined}
        setReminderDate={mockSetReminderDate}
        setName={mockSetName}
        setImages={mockSetImages}
      />
    );

    expect(getByPlaceholderText('Enter reminder notes')).toBeTruthy();
    expect(getByText('Save Reminder')).toBeTruthy();
  });

  it('updates notes input', () => {
    const { getByPlaceholderText } = render(
      <CreateReminderModal
        visible={true}
        onClose={mockOnClose}
        saveReminder={mockSaveReminder}
        notes=""
        setNotes={mockSetNotes}
        parentObjectId={null}
        setParentObjectId={mockSetParentObjectId}
        allNames={[]}
        reminderDate={undefined}
        setReminderDate={mockSetReminderDate}
        setName={mockSetName}
        setImages={mockSetImages}
      />
    );

    fireEvent.changeText(getByPlaceholderText('Enter reminder notes'), 'Water the plant');
    expect(mockSetNotes).toHaveBeenCalledWith('Water the plant');
  });

  it('calls saveReminder when notes and date are valid', () => {
    const testDate = new Date('2025-10-16');
    const { getByText } = render(
      <CreateReminderModal
        visible={true}
        onClose={mockOnClose}
        saveReminder={mockSaveReminder}
        notes="Test"
        setNotes={mockSetNotes}
        parentObjectId="123"
        setParentObjectId={mockSetParentObjectId}
        allNames={[]}
        reminderDate={testDate}
        setReminderDate={mockSetReminderDate}
        setName={mockSetName}
        setImages={mockSetImages}
      />
    );

    fireEvent.press(getByText('Save Reminder'));

    expect(mockSaveReminder).toHaveBeenCalledWith(testDate);
    expect(mockSetNotes).toHaveBeenCalledWith('');
    expect(mockSetParentObjectId).toHaveBeenCalledWith(null);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('alerts when notes are empty', () => {
    const testDate = new Date('2025-10-16');
    const { getByText } = render(
      <CreateReminderModal
        visible={true}
        onClose={mockOnClose}
        saveReminder={mockSaveReminder}
        notes=""
        setNotes={mockSetNotes}
        parentObjectId="123"
        setParentObjectId={mockSetParentObjectId}
        allNames={[]}
        reminderDate={testDate}
        setReminderDate={mockSetReminderDate}
        setName={mockSetName}
        setImages={mockSetImages}
      />
    );

    fireEvent.press(getByText('Save Reminder'));
    expect(global.alert).toHaveBeenCalledWith('Please enter reminder notes.');
    expect(mockSaveReminder).not.toHaveBeenCalled();
  });

  it('alerts when reminderDate is missing', () => {
    const { getByText } = render(
      <CreateReminderModal
        visible={true}
        onClose={mockOnClose}
        saveReminder={mockSaveReminder}
        notes="Test"
        setNotes={mockSetNotes}
        parentObjectId="123"
        setParentObjectId={mockSetParentObjectId}
        allNames={[]}
        reminderDate={undefined}
        setReminderDate={mockSetReminderDate}
        setName={mockSetName}
        setImages={mockSetImages}
      />
    );

    fireEvent.press(getByText('Save Reminder'));
    expect(global.alert).toHaveBeenCalledWith('Please select a reminder date.');
    expect(mockSaveReminder).not.toHaveBeenCalled();
  });

  it('calls onClose when Cancel is pressed', () => {
    const { getByText } = render(
      <CreateReminderModal
        visible={true}
        onClose={mockOnClose}
        saveReminder={mockSaveReminder}
        notes="Test"
        setNotes={mockSetNotes}
        parentObjectId="123"
        setParentObjectId={mockSetParentObjectId}
        allNames={[]}
        reminderDate={new Date()}
        setReminderDate={mockSetReminderDate}
        setName={mockSetName}
        setImages={mockSetImages}
      />
    );

    fireEvent.press(getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
