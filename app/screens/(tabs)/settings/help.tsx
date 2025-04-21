import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useContext, useState } from 'react';
import { useNavigation } from 'expo-router';
import ThemeContext from '@/context/ThemeContext';
import LanguageContext from '@/context/LanguageContext';

const HelpScreen = () => {
  const { theme } = useContext(ThemeContext);
  const isLight = theme === 'light';
  const { language } = useContext(LanguageContext);
  const navigation = useNavigation();

  const [search, setSearch] = useState('');

  const data = [
    {
      question: 'How do I create a new account?',
      answer: 'To create a new account, open the app and tap "Sign Up". Fill in the required details and follow the steps.',
    },
    {
      question: 'I forgot my password. How do I reset it?',
      answer: 'Tap "Forgot Password?" on the login screen, enter your registered email or number, and follow the reset instructions.',
    },
    {
      question: "I'm having trouble logging into my account. How can I resolve this?",
      answer: 'Check your internet connection and make sure your credentials are correct. You can also reset your password if needed.',
    },
    {
      question: 'How do I create a new chat group?',
      answer: 'Go to the Chats tab, tap on the "New Group" icon, add members, name the group, and you’re good to go!',
    },
    {
      question: 'How do I block or report a user?',
      answer: 'Open the user’s profile, tap the three-dot menu, and select "Block" or "Report" to take action.',
    },
    {
      question: 'How does the "Seen" feature work?',
      answer: 'Once someone views your message, a "Seen" tag appears below it. This works only if both users have read receipts enabled.',
    },
    {
      question: 'How do I change my profile picture?',
      answer: 'Go to your profile, tap the image, and choose a new photo from your gallery or camera.',
    },
    {
      question: 'Can I customize notification settings for specific chats?',
      answer: 'Yes, open a chat, tap the three-dot menu, and select "Notification settings" to personalize them.',
    },
    {
      question: 'Is it possible to delete a message after it has been sent?',
      answer: 'Yes. Long press on the message and choose "Delete for Everyone" within a limited time window.',
    },
  ];

  const filteredData = data.filter((item) =>
    item.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: isLight ? '#fff' : '#121212' }]}>
      <Text style={[styles.header, { color: isLight ? '#000' : '#fff' }]}>
        {language === 'en' ? 'Help Center' : 'Ohjekeskus'}
      </Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#888"
          style={[
            styles.searchInput,
            { color: isLight ? '#000' : '#fff', backgroundColor: isLight ? '#f0f0f0' : '#1e1e1e' },
          ]}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.question}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => navigation.navigate('help-detail', {
              question: item.question,
              answer: item.answer,
            })}
          >
            <Text style={[styles.questionText, { color: isLight ? '#000' : '#fff' }]}>
              {item.question}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={isLight ? '#000' : '#fff'} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  listItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 16,
    flex: 1,
  },
});

export default HelpScreen;
