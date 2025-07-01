import { StyleSheet } from 'react-native';

export const sharedEntryStyles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#F0F8FF', // Base background for entries
  },
  updateContainer: {
    backgroundColor: '#E8F7FD', // Slightly different for updates
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  name: {
    fontStyle: 'italic',
    marginBottom: 6,
    color: '#555',
  },
  notes: {
    fontSize: 14,
    marginBottom: 12,
    color: '#444',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 12,
    gap: 12,
  },
});
