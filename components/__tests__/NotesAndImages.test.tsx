import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NotesAndImages } from '../entry/NotesAndImages';
import * as ImagePicker from 'expo-image-picker';
import { deleteImageHandler } from '@/utils/entryHandler';

jest.mock('expo-image-picker');
jest.mock('@/utils/entryHandler');

describe('NotesAndImages', () => {
  const mockSetNotes = jest.fn();
  const mockSetImages = jest.fn();
  const mockSetName = jest.fn();
  const mockSaveEntry = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders name and notes inputs', () => {
    const { getByPlaceholderText } = render(
      <NotesAndImages
        name=""
        setName={mockSetName}
        notes=""
        setNotes={mockSetNotes}
        images={[]}
        setImages={mockSetImages}
        saveEntry={mockSaveEntry}
      />
    );

    expect(getByPlaceholderText('Enter Plant name')).toBeTruthy();
    expect(getByPlaceholderText('Add notes')).toBeTruthy();
  });

  it('updates name and notes correctly', () => {
    const { getByPlaceholderText } = render(
      <NotesAndImages
        name=""
        setName={mockSetName}
        notes=""
        setNotes={mockSetNotes}
        images={[]}
        setImages={mockSetImages}
        saveEntry={mockSaveEntry}
      />
    );

    fireEvent.changeText(getByPlaceholderText('Enter Plant name'), 'Rose');
    fireEvent.changeText(getByPlaceholderText('Add notes'), 'Water daily');

    expect(mockSetName).toHaveBeenCalledWith('Rose');
    expect(mockSetNotes).toHaveBeenCalledWith('Water daily');
  });

  it('picks images and updates state', async () => {
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'image1.jpg' }, { uri: 'image2.jpg' }],
    });

    const { getByText } = render(
      <NotesAndImages
        name=""
        setName={mockSetName}
        notes=""
        setNotes={mockSetNotes}
        images={[]}
        setImages={mockSetImages}
        saveEntry={mockSaveEntry}
      />
    );

    fireEvent.press(getByText('Pick Images'));

    await waitFor(() => {
      expect(mockSetImages).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  it('renders images and deletes them', () => {
    const images = ['img1.jpg', 'img2.jpg'];
    const { getAllByText } = render(
      <NotesAndImages
        name=""
        setName={mockSetName}
        notes=""
        setNotes={mockSetNotes}
        images={images}
        setImages={mockSetImages}
        saveEntry={mockSaveEntry}
        entryId="entry123"
      />
    );

    const deleteButtons = getAllByText('Delete');
    expect(deleteButtons).toHaveLength(2);

    // Press delete on the first image
    fireEvent.press(deleteButtons[0]);

    expect(mockSetImages).toHaveBeenCalledWith(expect.any(Function));
    expect(deleteImageHandler).toHaveBeenCalledWith({
      entryId: 'entry123',
      imageUrl: 'img1.jpg',
      setImages: mockSetImages,
    });
  });

  it('deletes image locally if no entryId', () => {
    const images = ['img1.jpg'];
    const { getByText } = render(
      <NotesAndImages
        name=""
        setName={mockSetName}
        notes=""
        setNotes={mockSetNotes}
        images={images}
        setImages={mockSetImages}
        saveEntry={mockSaveEntry}
      />
    );

    fireEvent.press(getByText('Delete'));
    expect(mockSetImages).toHaveBeenCalledWith(expect.any(Function));
    expect(deleteImageHandler).not.toHaveBeenCalled();
  });
});
