
// __tests__/entryHandlers.test.ts
import {
  saveReminderHandler,
  deleteReminderHandler,
  fetchAndSetParentEntry,
} from '../../utils/entryHandler';
import * as api from '../../utils/api';
import { Types } from 'mongoose';

jest.mock('../utils/api');

describe('entryHandler functions', () => {
  const originalAlert = global.alert;
  beforeEach(() => {
    jest.clearAllMocks();
    global.alert = jest.fn();
  });

  afterAll(() => {
    global.alert = originalAlert;
  });

  describe('saveReminderHandler', () => {
    const fakePayload: any = {
      date: '2025-10-16',
      notes: 'Water the plant',
      currentUserId: '123',
      parentObjectId: '456',
      setMarkedDates: jest.fn(),
      setIsReminderModalVisible: jest.fn(),
      setEntryForSelectedDate: jest.fn(),
      setSelectedOriginalEntry: jest.fn(),
      setParentObjectId: jest.fn(),
      fetchNames: jest.fn(),
      handleDayPress: jest.fn(),
      selectedDate: '2025-10-16',
    };

    it('alerts and returns if required fields missing', async () => {
      await saveReminderHandler({ ...fakePayload, date: null });
      expect(global.alert).toHaveBeenCalledWith(
        'Please provide all inputs (date, notes, user, plant).'
      );
    });

    it('calls addReminder and updates state on success', async () => {
      const mockEntry = { id: 'entry1' };
      (api.addReminder as jest.Mock).mockResolvedValueOnce({ entry: mockEntry });

      await saveReminderHandler(fakePayload);

      expect(api.addReminder).toHaveBeenCalledWith({
        date: fakePayload.date,
        notes: fakePayload.notes,
        userId: fakePayload.currentUserId,
        parentObjectId: fakePayload.parentObjectId,
      });
      expect(fakePayload.setEntryForSelectedDate).toHaveBeenCalledWith(mockEntry);
      expect(fakePayload.setMarkedDates).toHaveBeenCalled();
      expect(fakePayload.setIsReminderModalVisible).toHaveBeenCalledWith(false);
      expect(fakePayload.fetchNames).toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalledWith('Reminder saved!');
    });

    it('alerts on API error', async () => {
      (api.addReminder as jest.Mock).mockRejectedValueOnce(new Error('Failed'));

      await saveReminderHandler(fakePayload);
      expect(global.alert).toHaveBeenCalledWith('Error saving reminder: Failed');
    });
  });

  describe('deleteReminderHandler', () => {
    it('alerts if reminderId missing', async () => {
      await deleteReminderHandler({ reminderId: '' });
      expect(global.alert).toHaveBeenCalledWith('Missing reminder ID for deletion.');
    });

    it('calls deleteReminder and onSuccess', async () => {
      const onSuccess = jest.fn();
      (api.deleteReminder as jest.Mock).mockResolvedValueOnce({});

      await deleteReminderHandler({ reminderId: '123', onSuccess });

      expect(api.deleteReminder).toHaveBeenCalledWith('123');
      expect(global.alert).toHaveBeenCalledWith('Reminder deleted!');
      expect(onSuccess).toHaveBeenCalled();
    });

    it('alerts on API error', async () => {
      (api.deleteReminder as jest.Mock).mockRejectedValueOnce(new Error('Failed'));

      await deleteReminderHandler({ reminderId: '123' });
      expect(global.alert).toHaveBeenCalledWith('Failed');
    });
  });

  describe('fetchAndSetParentEntry', () => {
    it('fetches entry if parentObjectId exists', async () => {
      const mockEntry = { name: 'Plant 1' };
      (api.fetchEntryById as jest.Mock).mockResolvedValueOnce(mockEntry);
      const setParentEntry = jest.fn();

      await fetchAndSetParentEntry({ parentObjectId: '123' }, setParentEntry);

      expect(api.fetchEntryById).toHaveBeenCalledWith('123');
      expect(setParentEntry).toHaveBeenCalledWith(mockEntry);
    });

    it('sets null if parentObjectId missing', async () => {
      const setParentEntry = jest.fn();
      await fetchAndSetParentEntry({}, setParentEntry);
      expect(setParentEntry).toHaveBeenCalledWith(null);
    });

    it('sets null on API error', async () => {
      (api.fetchEntryById as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      const setParentEntry = jest.fn();
      await fetchAndSetParentEntry({ parentObjectId: '123' }, setParentEntry);
      expect(setParentEntry).toHaveBeenCalledWith(null);
    });
  });
});
