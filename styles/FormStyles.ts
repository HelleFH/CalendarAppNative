// src/styles/formStyles.ts
import { StyleSheet } from 'react-native';

export const formStyles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: -20,
    width: '100%',
    maxWidth: 800,
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 20,
    paddingBottom: 0,

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
  title: {
    fontSize: 22,
    padding:20,
    fontWeight:500,
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
