// src/components/CalendarComponent.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';

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
      <View style={{ alignItems: 'center', padding: 10 }}>
        <Text
          style={{
            fontWeight: isSelected ? 'bold' : 'normal',
            color: isSelected ? '#00adf5' : '#000',
          }}
        >
          {date.day}
        </Text>
        <View style={{ flexDirection: 'row', gap: 2 }}>
          {icons.map((iconType, index) => (
            <Text
              key={index}
              style={{
                fontSize: iconType === 'update' ? 10 : 12,
                marginRight: 2,
                position:'absolute'
              }}
            >
              {iconMap[iconType]}
            </Text>
          ))}
        </View>
      </View>
    </TouchableOpacity>

        );
      }}
    />
  );
};