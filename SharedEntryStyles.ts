// In SharedEntryStyles.ts

import { StyleSheet } from 'react-native';

export const sharedEntryStyles = StyleSheet.create({
  entryContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F0F8FF',
    borderRadius: 10,
    alignItems:'flex-start',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    display:'flex'
  
  },
  name: {
    fontStyle: 'italic',
    marginBottom: 5,
  },

    picker: {
    height: 50,
    marginBottom: 20,
  },
  notes: {
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 300,
    marginRight: 10,
    borderRadius: 8,
  },
  link: {
    color: '#1E90FF',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  icon: {
    marginRight: 4,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap:'wrap',
    marginTop: 10,
    gap:8,
  },
});
