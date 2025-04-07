import { View, Text, ScrollView } from 'react-native';
import { useContext } from 'react';
import ThemeContext from '@/context/ThemeContext';
import LanguageContext from '@/context/LanguageContext';

function TermsScreen() {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        padding: 20,
        backgroundColor: theme === 'light' ? '#fff' : '#121212',
      }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: 'bold',
          color: theme === 'light' ? '#000' : '#fff',
          marginBottom: 16,
          textAlign: 'center',
        }}
      >
        {language === 'en' ? 'Terms of Service' : 'Käyttöehdot'}
      </Text>

      <Text
        style={{
          fontSize: 16,
          lineHeight: 24,
          color: theme === 'light' ? '#333' : '#ccc',
          textAlign: 'justify',
        }}
      >
        {language === 'en'
          ? `By using SmartChat, you agree to our Terms of Service. SmartChat is a secure messaging platform designed to help users connect, chat, and share easily. You are responsible for any activity under your account and agree not to use the app for unlawful, harmful, or abusive purposes.

We do not allow spam, harassment, or content that infringes on the rights of others. SmartChat reserves the right to suspend or delete accounts that violate these terms. Your continued use of the app means you accept these terms and any future updates.`
          : `Käyttämällä SmartChat-sovellusta hyväksyt käyttöehtomme. Sovellus tarjoaa turvallisen tavan viestiä ja jakaa sisältöä helposti. Olet itse vastuussa tilisi käytöstä ja sitoudut olemaan käyttämättä sovellusta lainvastaisesti, haitallisesti tai loukkaavasti.

Emme salli roskapostia, häirintää tai sisältöä, joka loukkaa muiden oikeuksia. Meillä on oikeus sulkea tai poistaa tilejä, jotka rikkovat näitä ehtoja. Sovelluksen jatkuva käyttö merkitsee näiden ehtojen hyväksymistä, myös mahdollisten tulevien muutosten osalta.`}
      </Text>
    </ScrollView>
  );
}

export default TermsScreen;
