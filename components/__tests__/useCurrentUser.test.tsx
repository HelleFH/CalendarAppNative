import React from 'react';
import { render } from '@testing-library/react-native';
import { useCurrentUser } from '../CurrentUser';
import { onAuthStateChanged } from 'firebase/auth';

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
}));

const TestComponent = ({ callback }: { callback: (userId: string | null, loading: boolean) => void }) => {
  const { currentUserId, isLoading } = useCurrentUser();
  React.useEffect(() => {
    callback(currentUserId, isLoading);
  }, [currentUserId, isLoading]);
  return null;
};

describe('useCurrentUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('sets user correctly', () => {
    const mockUser = { uid: '12345' };
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, cb) => {
      cb(mockUser);
      return jest.fn();
    });

    const callback = jest.fn();
    render(<TestComponent callback={callback} />);

    expect(callback).toHaveBeenCalledWith('12345', false);
  });

  it('handles logout correctly', () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, cb) => {
      cb(null);
      return jest.fn();
    });

    const callback = jest.fn();
    render(<TestComponent callback={callback} />);

    expect(callback).toHaveBeenCalledWith(null, false);
  });
});
