// __tests__/createFormData.test.ts
import { createFormData } from '../../utils/createFormData';
import * as FileSystem from 'expo-file-system';

global.atob = (b64: string) => Buffer.from(b64, 'base64').toString('binary');

jest.mock('expo-file-system');

describe('createFormData', () => {
  const mockReadAsStringAsync = FileSystem.readAsStringAsync as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('appends plain data to FormData', async () => {
    const data = { name: 'Plant 1', notes: 'Some notes' };
    const images: string[] = [];

    const formData = await createFormData({ data, images });
    const entries = Array.from((formData as any)._parts);

    expect(entries).toEqual(
      expect.arrayContaining([
        ['name', 'Plant 1'],
        ['notes', 'Some notes'],
        ['originalImages', '[]'],
      ])
    );
  });

  it('handles original image URLs correctly', async () => {
    const data = { name: 'Plant' };
    const images = ['http://example.com/image1.jpg', '/uploads/image2.jpg'];

    const formData = await createFormData({ data, images });
    const entries = Array.from((formData as any)._parts) as [string, any, any?][];

    expect(entries).toEqual(
      expect.arrayContaining([
        ['originalImages', JSON.stringify(images)],
      ])
    );
  });

  it('handles new file:// images using FileSystem', async () => {
    const data = { name: 'Plant' };
    const images = ['file://image1.jpg'];
    mockReadAsStringAsync.mockResolvedValueOnce('aGVsbG8='); // base64 for "hello"

    const formData = await createFormData({ data, images });
    const entries = Array.from((formData as any)._parts) as [string, any, any?][];

    expect(mockReadAsStringAsync).toHaveBeenCalledWith('file://image1.jpg', {
      encoding: FileSystem.EncodingType.Base64,
    });

    const appendedImage = entries.find((entry) => entry[0] === 'images');
    expect(appendedImage).toBeDefined();

    // Tell TypeScript this is a tuple to safely access index 2
    const filename = (appendedImage as [string, any, string])[2];
    expect(filename).toBe('image0.jpeg');
  });

  it('handles base64 data:image URIs', async () => {
    const data = { name: 'Plant' };
    const base64Image =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA';
    const images = [base64Image];

    const formData = await createFormData({ data, images });
    const entries = Array.from((formData as any)._parts) as [string, any, any?][];

    const appendedImage = entries.find((entry) => entry[0] === 'images');
    expect(appendedImage).toBeDefined();

    const imageFilename = (appendedImage as [string, any, string])[2];
    expect(imageFilename).toBe('image0.png');
  });
});
