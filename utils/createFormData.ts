import * as FileSystem from 'expo-file-system';

export const createFormData = async ({
  data,
  images,
}: {
  data: Record<string, string>;
  images: string[];
}): Promise<FormData> => {
  console.log('createFormData called with data:', data);
  console.log('Images received:', images);

  const formData = new FormData();

  // Append standard data fields
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
    console.log(`Appended data field: ${key} = ${value}`);
  });

  // Separate already uploaded images from new images
  const originalImages = images.filter(uri => uri.startsWith('http') || uri.startsWith('/uploads'));
const newImages = images.filter(
  uri => uri.startsWith('file://') || uri.startsWith('data:image/') || uri.startsWith('blob:')
);
  console.log('Original images (already uploaded):', originalImages);
  console.log('New images (to upload):', newImages);

  // Keep track of already uploaded images
  formData.append('originalImages', JSON.stringify(originalImages));
  console.log('Appended originalImages to FormData');

  // Append new images
for (let i = 0; i < newImages.length; i++) {
  const imageUri = newImages[i];
  let blob: Blob | undefined;
  let fileType = 'jpeg';

  if (imageUri.startsWith('data:image/')) {
    // existing base64 handling...
  } else if (imageUri.startsWith('file://')) {
    // existing FileSystem handling...
  } else if (imageUri.startsWith('blob:')) {
    const response = await fetch(imageUri);
    blob = await response.blob();
    fileType = blob.type.split('/')[1] || 'jpeg';
  }

  if (blob) {
    formData.append('images', blob, `image${i}.${fileType}`);
    console.log('Appended blob image', imageUri);
  }
}

  console.log('FormData creation complete');
  return formData;
};
