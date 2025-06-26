import { useState } from 'react';
import { useCurrentUser } from '@/components/CurrentUser';
import { useNames } from '@/components/UseNames';
import { createFormData } from '@/utils/createFormData';
import { addEntry, addUpdateEntry } from '@/utils/api';
import axios from 'axios';

export const useEntryActions = () => {
  const [entryForSelectedDate, setEntryForSelectedDate] = useState<any>(null);
  const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({});
  const [selectedOriginalEntry, setSelectedOriginalEntry] = useState<any>(null);
  const [parentObjectId, setParentObjectId] = useState<string | null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

  const { currentUserId } = useCurrentUser();
  const { fetchNames } = useNames(currentUserId);

  const saveEntry = async ({
    selectedDate,
    notes,
    images,
    name,
  }: {
    selectedDate: string;
    notes: string;
    images: string[];
    name: string;
  }) => {
    if (!selectedDate || !notes || images.length === 0 || !currentUserId || !name) {
      alert('Please provide all inputs (date, notes, images, name, and login).');
      return;
    }

    const formData = await createFormData({
      data: {
        date: selectedDate,
        notes,
        userId: currentUserId,
        name,
        createdAt: new Date().toISOString(),
      },
      images,
    });

    try {
      const response = await addEntry(formData);
      alert('Entry saved!');
      setEntryForSelectedDate(response.data.entry);
      setMarkedDates(prev => ({
        ...prev,
        [selectedDate]: { marked: true, dotColor: '#4CAF50' },
      }));
      setIsCreateModalVisible(false);
      setSelectedOriginalEntry(null);
      setParentObjectId(null);
      fetchNames();
    } catch (error: any) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : error instanceof Error
        ? error.message
        : 'Unknown error';

      if (message === 'Name already exists. Please choose a different one.') {
        alert('That name is already used. Please choose a unique name.');
      } else {
        alert(`Error saving entry: ${message}`);
      }
    }
  };

  const handleUpdate = async ({
    selectedDate,
    notes,
    images,
  }: {
    selectedDate: string;
    notes: string;
    images: string[];
  }) => {
    if (!parentObjectId) {
      alert('No entry selected for updating.');
      return;
    }

    if (!selectedDate || !notes || images.length === 0 || !currentUserId) {
      alert('Please provide all inputs (date, notes, images, and login).');
      return;
    }

    const formData = await createFormData({
      data: {
        date: selectedDate,
        notes,
        userId: currentUserId,
        parentObjectId,
        updatedAt: new Date().toISOString(),
      },
      images,
    });

    try {
      const response = await addUpdateEntry(formData);
      alert('Update Entry Saved!');
      setEntryForSelectedDate(response.data.entry);
      setMarkedDates(prev => ({
        ...prev,
        [selectedDate]: { marked: true, dotColor: '#4CAF50' },
      }));
      setIsUpdateModalVisible(false);
      setSelectedOriginalEntry(null);
      setParentObjectId(null);
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save update entry.');
    }
  };

  return {
    saveEntry,
    handleUpdate,
    entryForSelectedDate,
    markedDates,
    selectedOriginalEntry,
    setSelectedOriginalEntry,
    parentObjectId,
    setParentObjectId,
    isCreateModalVisible,
    setIsCreateModalVisible,
    isUpdateModalVisible,
    setIsUpdateModalVisible,
  };
};
