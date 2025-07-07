// src/styles/formStyles.ts
import { StyleSheet } from 'react-native';

export const formStyles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignSelf: 'center',

  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#999',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
  scrollContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  
});
