import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import HeaderBanner from '@/components/HeaderBanner';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import ThemeContext from '@/context/ThemeContext';
import LanguageContext from "@/context/LanguageContext";


function SettingsScreen() {

  // Context
  const {language} = useContext(LanguageContext);
  const {theme, setTheme} = useContext(ThemeContext);

  const router = useRouter();

  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);


  const handleThemeSwitch = ()=>{
    setDarkMode(!darkMode)

    setTheme(theme==='light'?'dark':'light')
  }

  return (
    <View style={{flex: 1, backgroundColor: theme === 'light' ? '#FFFFFF' : '#121212'}}>

      {/* Header Part */}
      <HeaderBanner />

      {/* Dark Mode Row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 40, marginTop: 40 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="moon" size={25} color={theme === 'light' ? '#3A888D' : '#75E6DA'} />
          <Text style={{ marginLeft: 20, color: theme === 'light' ? '#000' : '#FFF' }}>{language==='en'?'Dark Mode':'Tumma tila'}</Text>
        </View>
        <Switch
          value={darkMode}
          onValueChange={handleThemeSwitch}
          thumbColor={darkMode ? "#3A888D" : "#f4f3f4"}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
        />
      </View>


    <TouchableOpacity
       onPress={()=>router.push('/screens/(tabs)/settings/language')}
      style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 40, marginTop: 60,}}
      >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
       <MaterialIcons name="translate" size={25} color={theme === 'light' ? '#3A888D' : '#75E6DA'} />
       <Text style={{ marginLeft: 20, color: theme === 'light' ? '#000' : '#FFF' }}>{language==='en'?'Language':'Kieli'}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 40, marginTop: 60 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="notifications" size={24} color={theme === 'light' ? '#3A888D' : '#75E6DA'} />
          <Text style={{ marginLeft: 20, color: theme === 'light' ? '#000' : '#FFF' }}>{language==='en'?'Notifications':'Ilmoitukset'}</Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          thumbColor={notificationsEnabled ? "#3A888D" : "#f4f3f4"}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
        />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 40 }}>
        <View style={{ flex: 1, height: 2, backgroundColor: theme === 'light' ? '#D3D3D3' : '#333', marginHorizontal: 40 }} />
      </View>

      <TouchableOpacity
        onPress={()=>router.push('/screens/(tabs)/settings/terms')}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>

      <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginLeft: 50, marginTop: 40 }}>
        <Ionicons name="newspaper" size={24} color={theme === 'light' ? '#3A888D' : '#75E6DA'} />
        <Text style={{ marginLeft: 20, marginTop: 5, color: theme === 'light' ? '#000' : '#FFF' }}>{language==='en'?'Terms of Service':'Palveluehdot'}</Text>
      </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={()=>router.push('/screens/(tabs)/settings/privacy')}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
      
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginLeft: 50, marginTop: 50 }}>
        <MaterialIcons name="policy" size={24} color={theme === 'light' ? '#3A888D' : '#75E6DA'} />
        <Text style={{ marginLeft: 20, marginTop: 5, color: theme === 'light' ? '#000' : '#FFF' }}>{language==='en'?'Privacy Policy':'Tietosuojakäytäntö'}</Text>
      </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={()=>router.push('/screens/(tabs)/settings/help')}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
      
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginLeft: 50, marginTop: 50 }}>
        <Feather name="help-circle" size={24} color={theme === 'light' ? '#3A888D' : '#75E6DA'} />
        <Text style={{ marginLeft: 20, marginTop: 5, color: theme === 'light' ? '#000' : '#FFF' }}>{language==='en'?'Help Center':'Ohjekeskus'}</Text>
      </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={()=>router.push('/screens/(tabs)/settings/about')}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
      
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginLeft: 50, marginTop: 50 }}>
        <Ionicons name="layers-outline" size={24} color={theme === 'light' ? '#3A888D' : '#75E6DA'} />
        <Text style={{ marginLeft: 20, marginTop: 5, color: theme === 'light' ? '#000' : '#FFF' }}>{language==='en'?'About':'Noin'}</Text>
      </View>
      </TouchableOpacity>

    </View>
  );
}

export default SettingsScreen;