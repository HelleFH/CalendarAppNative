import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  // Layout Containers
  appContainer: {
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
    top: 75,
    padding: 16,
  },
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign:'center',
    width:'100%',
    maxWidth:700,
    display:'flex',
        alignSelf: 'center',


  },
  entryContainer: {
    display: 'flex',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F0F8FF',
    borderRadius: 10,
    alignItems: 'flex-start',
    maxWidth: 400,
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 50,
    alignItems: 'center',
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
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
    gap: 8,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'left',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#4A5568',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 20,
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
    marginBottom: 16,
    marginTop:16,
  },
  entryNotes: {
    marginBottom: 10,
  },
  cancelText: {
    color: '#718096',
    fontSize: 16,
  },
  link: {
    color: '#1E90FF',
    textDecorationLine: 'underline',
    fontSize: 18,
    fontWeight:500,
    marginTop:20,
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
    width: 325,
    height: 325,
    resizeMode: 'contain',
    borderRadius: 12,
  },
  imageLarge: {
    width: '100%',
    height: 300,
    borderRadius: 16,
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
    borderRadius: 8,
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
