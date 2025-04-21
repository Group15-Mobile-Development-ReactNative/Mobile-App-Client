import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useContext } from 'react';
import ThemeContext from '@/context/ThemeContext';

const AboutScreen = () => {
  const { theme } = useContext(ThemeContext);

  const isLight = theme === 'light';

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContainer,
        { backgroundColor: isLight ? '#e9f6fc' : '#121212' },
      ]}
    >
      <View style={styles.background}>

        <Image
          source={require('../../../../assets/header-images/Smart-Chat-Logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={[styles.appName, { color: isLight ? '#1a4fa1' : '#4a90e2' }]}>Smart Chat</Text>

        <Text style={[styles.version, { color: isLight ? '#555' : '#aaa' }]}>Version 2.1.0</Text>

        <Text style={[styles.link, { color: isLight ? '#000' : '#4da6ff' }]}>www.moodle.com</Text>

        <Text style={[styles.copy, { color: isLight ? '#222' : '#ccc' }]}>
          Copyright © 2025 <Text style={styles.bold}>Smart Chat</Text>
          {'\n'}All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    minHeight: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
  },
  logo: {
    width: 200,
    height: 200,
    marginTop: 80,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  version: {
    fontSize: 16,
    marginTop: 5,
  },
  link: {
    fontSize: 15,
    textDecorationLine: 'underline',
    marginTop: 190,
  },
  copy: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default AboutScreen;
