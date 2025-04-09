import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useContext } from 'react';
import ThemeContext from '@/context/ThemeContext';

const HelpDetailScreen = () => {
  const { theme } = useContext(ThemeContext);
  const isLight = theme === 'light';
  const { question, answer } = useLocalSearchParams();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: isLight ? '#fff' : '#121212' },
      ]}
    >
      <Text style={[styles.question, { color: isLight ? '#000' : '#fff' }]}>
        {question}
      </Text>
      <Text style={[styles.answer, { color: isLight ? '#333' : '#ccc' }]}>
        {answer}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  answer: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
});

export default HelpDetailScreen;
