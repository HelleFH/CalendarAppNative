// __tests__/createFormData.test.ts
import { createFormData } from '../../utils/createFormData';
import * as FileSystem from 'expo-file-system';

global.atob = (b64) => Buffer.from(b64, 'base64').toString('binary');

jest.mock('expo-file-system');

describe('createFormData', () => {
  const mockReadAsStringAsync = FileSystem.readAsStringAsync as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles new file:// images using FileSystem', async () => {
    const data = { name: 'Plant' };
    const images = ['file://image1.jpg'];

    mockReadAsStringAsync.mockResolvedValueOnce('aGVsbG8='); // base64 for "hello"

    const formData = await createFormData({ data, images });
    const entries = Array.from((formData as any)._parts) as [string, any, any?][];

    // ✅ Replace EncodingType.Base64 with just 'base64'
    expect(mockReadAsStringAsync).toHaveBeenCalledWith('file://image1.jpg', {
      encoding: 'base64',
    });

    const appendedImage = entries.find((entry) => entry[0] === 'images');
    expect(appendedImage).toBeDefined();

    const filename = (appendedImage as [string, any, string])[2];
    expect(filename).toBe('image0.jpeg');
  });
});
