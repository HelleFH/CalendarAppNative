// src/components/CalendarComponent.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { ThemedText } from './ThemedText';


interface CalendarComponentProps {
  selectedDate: string;
  markedDates: {
    [date: string]: {
      icons?: string[];
    };
  };
  onDayPress: (day: { dateString: string }) => void;
}

const iconMap: { [key: string]: string } = {
  reminder: '🔔',
  entry: '🍃',
  update: '+🍃',
};

export const CalendarComponent: React.FC<CalendarComponentProps> = ({
  selectedDate,
  markedDates,
  onDayPress,
}) => {
  return (
    <Calendar
      current={selectedDate}
      onDayPress={onDayPress}
      monthFormat={'yyyy MM'}
      
dayComponent={({
  date,
  state,
}: {
  date?: {
    dateString: string;
    day: number;
    month: number;
    year: number;
    timestamp: number;
  };
  state?: string;
}) => {
  if (!date) return null; // handle undefined date
  const dateStr = date.dateString;
  const isSelected = selectedDate === dateStr;
  const icons = markedDates[dateStr]?.icons || [];

  return (
    <TouchableOpacity onPress={() => onDayPress(date)}>
      <View >
        <ThemedText

        >
          {date.day}
        </ThemedText>
        <View>
          {icons.map((iconType, index) => (
            <ThemedText
              key={index}
       
            >
              {iconMap[iconType]}
            </ThemedText>
          ))}
        </View>
      </View>
    </TouchableOpacity>

        );
      }}
    />
  );
};
