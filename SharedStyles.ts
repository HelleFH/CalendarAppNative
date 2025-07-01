// commonStyles.ts
import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#F0F4F8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2D3748',
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 20,
  },
  modalContent: {
  padding: 20,
  backgroundColor: '#fff',
  borderRadius: 12,
  minHeight: 200,
  justifyContent: 'flex-start',
  alignItems: 'center',
},
  cancelText: {
    color: '#718096',
    fontSize: 16,
  },
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
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F855A',
    marginBottom: 8,
  },
  dateContainer: {
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#2D3748',
  },
  date: {
    fontSize: 16,
    marginBottom: 10,
    color: '#4A5568',
  },
  notes: {
    fontSize: 16,
    marginBottom: 20,
    color: '#4A5568',
  },
  image: {
    width: 150,
    height: 150,
    marginRight: 10,
    borderRadius: 8,
  },
});
