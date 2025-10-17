// __tests__/DeleteConfirmationModal.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DeleteConfirmationModal } from '../DeleteConfirmationModal';

describe('DeleteConfirmationModal', () => {
  const onCancelMock = jest.fn();
  const onConfirmMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when visible', () => {
    const { getByText } = render(
      <DeleteConfirmationModal
        visible={true}
        onCancel={onCancelMock}
        onConfirm={onConfirmMock}
      />
    );

    expect(getByText('Are you sure you want to delete?')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
    expect(getByText('Delete')).toBeTruthy();
  });

  it('calls onCancel when Cancel button is pressed', () => {
    const { getByText } = render(
      <DeleteConfirmationModal
        visible={true}
        onCancel={onCancelMock}
        onConfirm={onConfirmMock}
      />
    );

    fireEvent.press(getByText('Cancel'));
    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when Delete button is pressed', () => {
    const { getByText } = render(
      <DeleteConfirmationModal
        visible={true}
        onCancel={onCancelMock}
        onConfirm={onConfirmMock}
      />
    );

    fireEvent.press(getByText('Delete'));
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });

  it('does not render content when not visible', () => {
    const { queryByText } = render(
      <DeleteConfirmationModal
        visible={false}
        onCancel={onCancelMock}
        onConfirm={onConfirmMock}
      />
    );

    expect(queryByText('Are you sure you want to delete?')).toBeNull();
    expect(queryByText('Cancel')).toBeNull();
    expect(queryByText('Delete')).toBeNull();
  });
});
