// __tests__/useNames.test.ts
import axios from 'axios';
import { fetchNamesForUser } from './fetchNames'; 

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchNamesForUser', () => {
  const fakeUserId = '123';
  const fakeData = [
    { _id: '1', name: 'Plant 1' },
    { _id: '2', name: 'Plant 2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches names for a valid userId', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: fakeData });

    const result = await fetchNamesForUser(fakeUserId);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://calendarappnative.onrender.com/entries/names',
      { params: { userId: fakeUserId } }
    );
    expect(result).toEqual(fakeData);
  });

  it('returns empty array if userId is null', async () => {
    const result = await fetchNamesForUser(null);
    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('handles axios errors gracefully', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const result = await fetchNamesForUser(fakeUserId);

    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching names:', expect.any(Error));
    consoleSpy.mockRestore();
  });
});
