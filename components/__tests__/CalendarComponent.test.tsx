import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CalendarComponent } from '../CalendarComponent';

describe('CalendarComponent', () => {
  const selectedDate = '2025-10-16';
  const markedDates = {
    '2025-10-16': { icons: ['reminder', 'entry'] },
    '2025-10-17': { icons: ['update'] },
  };

  const mockOnDayPress = jest.fn();

  it('renders correctly', () => {
    const { getByText } = render(
      <CalendarComponent
        selectedDate={selectedDate}
        markedDates={markedDates}
        onDayPress={mockOnDayPress}
      />
    );

    // The selected date number should render
    expect(getByText('16')).toBeTruthy();
  });

  it('renders icons for marked dates', () => {
    const { getByText } = render(
      <CalendarComponent
        selectedDate={selectedDate}
        markedDates={markedDates}
        onDayPress={mockOnDayPress}
      />
    );

    expect(getByText('🔔')).toBeTruthy(); // reminder icon
    expect(getByText('🍃')).toBeTruthy(); // entry icon
  });

  it('calls onDayPress when a day is pressed', () => {
    const { getByText } = render(
      <CalendarComponent
        selectedDate={selectedDate}
        markedDates={markedDates}
        onDayPress={mockOnDayPress}
      />
    );

    fireEvent.press(getByText('16'));
    expect(mockOnDayPress).toHaveBeenCalledWith(
      expect.objectContaining({ dateString: '2025-10-16' })
    );
  });

  it('displays update icon correctly', () => {
    const { getByText } = render(
      <CalendarComponent
        selectedDate="2025-10-17"
        markedDates={markedDates}
        onDayPress={mockOnDayPress}
      />
    );

    expect(getByText('+🍃')).toBeTruthy(); // update icon
  });
});
