import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({


  appContainer: {
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
    top: 75,
    padding: 16,
    textAlign: 'left',

  },
  container: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'left',
    width: '100%',
    maxWidth: 500,
    display: 'flex',
    alignSelf: 'center',
    backgroundColor: 'white',
    gap: 20,
    marginTop:20,
  },
  entryContainer: {
    display: 'flex',
    marginTop: 10,
    padding: 40,
    backgroundColor: '#F0F8FF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent:'center',
    maxWidth: 400,
    width: '100%',
    textAlign: 'left',

  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding:20,
    maxWidth: '100%',
    alignSelf:'center',
  
  },
  modalContent: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    marginTop: 20,
    alignSelf:'center',
    textDecorationLine:'underline',
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems:'center',
    flexWrap:'wrap',
    marginTop: 10,
    gap: 8,
  },


  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#4A5568',
    width: '100%',
  },
    header: {
     fontSize: 24,
     paddingVertical:20,
     fontWeight:600,

  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
    width: '100%',
    textAlign:'left',
    letterSpacing:-0.2,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F855A',
    marginBottom: 8,
  },
  name: {
    fontStyle: 'italic',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    color: '#2D3748',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 10,
  },
  notes: {
    fontSize: 16,
    color: '#4A5568',
    width: '100%',

  },

  link: {
    color: '#1E90FF',
    fontSize: 18,
    fontWeight: 600,
    marginTop: 20,
  },

  // Inputs
  input: {
    height: 40,
    borderColor: '#A0AEC0',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#F7FAFC',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#319795',
    borderRadius: 10,
    backgroundColor: '#E6FFFA',
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#2F855A',
    marginBottom: 20,
  },

  imageWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  imageLarge: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    resizeMode: 'cover',
    marginBottom: 16,
  },
  imageSmall: {
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 12,
  },
  fullWidthImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    marginRight: 10,
  },

  // Misc
  dateContainer: {
    marginBottom: 20,
  },
  icon: {
    marginRight: 4,
  },
});
