import { View, Text, ScrollView } from 'react-native';
import { useContext } from 'react';
import ThemeContext from '@/context/ThemeContext';
import LanguageContext from '@/context/LanguageContext';

function PrivacyScreen() {
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
        {language === 'en' ? 'Privacy Policy' : 'Tietosuojakäytäntö'}
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
          ? `At SmartChat, your privacy is our priority. We are committed to protecting the personal information you share with us. When you use SmartChat, we may collect basic information such as your phone number, profile name, device information, and contacts (with your permission), to provide core functionalities like messaging, syncing contacts, and improving user experience.

SmartChat uses industry-standard encryption to ensure that your messages and calls remain private and secure. We do not read or listen to your conversations, as all communications are end-to-end encrypted. We do not sell, trade, or rent your personal data to third parties. However, we may share limited data with trusted service providers to support app performance, always under strict confidentiality agreements.

We also collect anonymous analytics data to better understand app usage and improve our features. You are in control of your information — you can manage your permissions, delete your account, or request data removal at any time from within the app.

Our privacy policy may be updated occasionally to reflect changes in technology or legal requirements. When we make significant changes, we will notify you in-app or through other appropriate channels. By continuing to use SmartChat, you agree to the latest version of this policy.`
          : `SmartChat-sovelluksessa yksityisyytesi on meille ensisijainen. Sitoudumme suojaamaan henkilökohtaiset tietosi. Saatamme kerätä tietoja, kuten puhelinnumerosi, profiilinimesi, laitetietoja ja yhteystietoja (luvalla), jotta voimme tarjota keskeisiä toimintoja kuten viestintä ja yhteystietojen synkronointi.

Kaikki viestit ja puhelut ovat päästä päähän -salattuja. Emme lue tai kuuntele yksityisiä keskustelujasi. Emme myy tai jaa tietojasi kolmansille osapuolille ilman pakottavaa syytä. Joitakin teknisiä tietoja saatetaan jakaa luotettujen palveluntarjoajien kanssa suorituskyvyn parantamiseksi.

Keräämme myös nimettömiä analytiikkatietoja sovelluksen käytön ymmärtämiseksi ja sen kehittämiseksi. Käyttäjänä voit hallita oikeuksiasi, pyytää tietojen poistamista tai poistaa tilisi milloin tahansa sovelluksesta.

Tietosuojakäytäntöämme voidaan päivittää ajoittain. Jatkamalla sovelluksen käyttöä hyväksyt uusimman version.`}
      </Text>
    </ScrollView>
  );
}

export default PrivacyScreen;
