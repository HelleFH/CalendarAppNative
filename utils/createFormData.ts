import * as FileSystem from 'expo-file-system';

export const createFormData = async ({
  data,
  images,
}: {
  data: Record<string, string>;
  images: string[];
}): Promise<FormData> => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const originalImages = images.filter(uri => uri.startsWith('http') || uri.startsWith('/uploads'));
  const newImages = images.filter(uri => uri.startsWith('file://') || uri.startsWith('data:image/'));

  formData.append('originalImages', JSON.stringify(originalImages));

  for (let i = 0; i < newImages.length; i++) {
    const imageUri = newImages[i];
    let blob: Blob | undefined;
    let fileType = 'jpeg';

    if (imageUri.startsWith('data:image/')) {
      const mimeMatch = imageUri.match(/^data:(image\/[a-z]+);base64,/);
      const mimeType = mimeMatch?.[1] || 'image/jpeg';
      const base64Data = imageUri.replace(/^data:image\/[a-z]+;base64,/, '');

      const byteCharacters = atob(base64Data);
      const byteArray = new Uint8Array([...byteCharacters].map(c => c.charCodeAt(0)));
      blob = new Blob([byteArray], { type: mimeType });
      fileType = mimeType.split('/')[1];
    } else if (imageUri.startsWith('file://')) {
      const fileInfo = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const byteArray = new Uint8Array([...atob(fileInfo)].map(c => c.charCodeAt(0)));
      blob = new Blob([byteArray], { type: 'image/jpeg' });
    }

    if (blob) {
      formData.append('images', blob, `image${i}.${fileType}`);
    }
  }

  return formData;
};
