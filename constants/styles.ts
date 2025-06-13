import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBFE',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
    color: '#6750A4',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
  },
  placeholder: {
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
    color: '#49454F',
  },
  form: {
    gap: 16,
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    color: '#BA1A1A',
    fontSize: 12,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandText: {
    color: '#6750A4',
    fontWeight: 'bold',
  },
});