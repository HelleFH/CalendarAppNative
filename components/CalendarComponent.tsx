// src/components/CalendarComponent.tsx
import React from 'react';
import { Calendar } from 'react-native-calendars';

interface CalendarComponentProps {
  selectedDate: string;
  markedDates: { [date: string]: { marked: boolean; selected: boolean; selectedColor: string } };
  onDayPress: (day: { dateString: string }) => void;
}

export const CalendarComponent: React.FC<CalendarComponentProps> = ({ selectedDate, markedDates, onDayPress }) => {
  return (
    <Calendar
      current={selectedDate}
      onDayPress={onDayPress}
      monthFormat={'yyyy MM'}
      markedDates={{
        ...markedDates,
        [selectedDate]: {
          ...(markedDates[selectedDate] || {}),
          selected: true,
          selectedColor: '#00adf5',
        }
      }}
    />
  );
};
