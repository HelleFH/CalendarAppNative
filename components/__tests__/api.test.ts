
// __tests__/api.test.ts
import axios from 'axios';
import * as api from '../../utils/api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API utility functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetchNames calls axios.get with correct URL and params', async () => {
    const userId = '123';
    mockedAxios.get.mockResolvedValue({ data: ['Plant 1', 'Plant 2'] });

    const res = await api.fetchNames(userId);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://calendarappnative.onrender.com/entries/names',
      { params: { userId } }
    );
    expect(res.data).toEqual(['Plant 1', 'Plant 2']);
  });

  it('addReminder posts correct data', async () => {
    const payload = { date: '2023-01-01', notes: 'note', parentObjectId: 'p1', userId: 'u1' };
    mockedAxios.post.mockResolvedValue({ data: { id: 'r1' } });

    const res = await api.addReminder(payload);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://calendarappnative.onrender.com/entries/reminders/create',
      payload
    );
    expect(res).toEqual({ id: 'r1' });
  });

  it('deleteReminder calls delete with correct URL', async () => {
    mockedAxios.delete.mockResolvedValue({ status: 200 });
    await api.deleteReminder('r1');

    expect(mockedAxios.delete).toHaveBeenCalledWith(
      'https://calendarappnative.onrender.com/entries/reminders/r1'
    );
  });

  it('fetchEntriesForDateCombined returns structured response', async () => {
    const resData = {
      data: { entries: [1], updates: [2], reminders: [3] },
    };
    mockedAxios.get.mockResolvedValue(resData);

    const result = await api.fetchEntriesForDateCombined('u1', '2023-01-01');

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://calendarappnative.onrender.com/entries/entries-for-date',
      { params: { userId: 'u1', date: '2023-01-01' } }
    );
    expect(result).toEqual({ originalEntries: [1], updateEntries: [2], reminders: [3] });
  });

  it('updateEntry calls axios.put with formData', async () => {
    const formData = new FormData();
    mockedAxios.put.mockResolvedValue({});

    const result = await api.updateEntry({ editingEntryId: 'e1', formData });
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'https://calendarappnative.onrender.com/entries/edit-entry/e1',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    expect(result).toBe(true);
  });

  it('deleteEntryImage returns updated images', async () => {
    mockedAxios.delete.mockResolvedValue({ data: { images: ['img1.jpg'] } });
    const result = await api.deleteEntryImage('e1', 'img.jpg');

    expect(mockedAxios.delete).toHaveBeenCalledWith(
      'https://calendarappnative.onrender.com/entries/image',
      { data: { entryId: 'e1', imageUrl: 'img.jpg' } }
    );
    expect(result).toEqual(['img1.jpg']);
  });

  it('fetchEntryById returns entry data', async () => {
    mockedAxios.get.mockResolvedValue({ data: { entry: { _id: 'e1', name: 'Plant' } } });

    const res = await api.fetchEntryById('e1');

    expect(mockedAxios.get).toHaveBeenCalledWith('https://calendarappnative.onrender.com/entries/by-parent/e1');
    expect(res).toEqual({ _id: 'e1', name: 'Plant' });
  });

  it('useNames function returns fetchNames function', async () => {
    mockedAxios.get.mockResolvedValue({ data: ['Plant 1'] });
    const hook = api.useNames('u1');
    await hook.fetchNames();
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://calendarappnative.onrender.com/entries/names',
      { params: { userId: 'u1' } }
    );
  });
});
