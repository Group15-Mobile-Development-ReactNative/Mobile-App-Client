import { View, Text, TouchableOpacity, Image, } from 'react-native';
import { useState, useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import LanguageContext from '@/context/LanguageContext';
import ThemeContext from '@/context/ThemeContext';


function LanguageScreen() {

  // Context
  const {language, setLanguage} = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);


  


  return (
    <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 40, backgroundColor: theme === 'light' ? '#fff' : '#121212' }}>
      
      {/* English Option */}
      <TouchableOpacity
        onPress={() => setLanguage('en')}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30, borderBottomColor: '#ccc', borderBottomWidth: 1, paddingBottom: 10 }}
        activeOpacity={0.7}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={require('../../../../assets/flag-images/UK-Flag.png')} 
            style={{ width: 40, height: 40 }}
          />
          <Text style={{ marginLeft: 15, fontSize: 16, color: theme === 'light' ? 'black' : 'white'}}>
            English
          </Text>
        </View>
        <Ionicons
          name={language === 'en' ? 'radio-button-on' : 'radio-button-off'}
          size={24}
          color="#3A88F7" // solid blue tone
        />
      </TouchableOpacity>
  
      {/* Finnish Option */}
      <TouchableOpacity
        onPress={() => setLanguage('fi')}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30, borderBottomColor: '#ccc', borderBottomWidth: 1, paddingBottom: 10 }}
        activeOpacity={0.7}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={require('../../../../assets/flag-images/FIN-Flag.png')} 
            style={{ width: 40, height: 40 }}
          />
          <Text style={{ marginLeft: 15, fontSize: 16, color: theme === 'light' ? 'black' : 'white'}}>
            Suomi
          </Text>
        </View>
        <Ionicons
          name={language === 'fi' ? 'radio-button-on' : 'radio-button-off'}
          size={24}
          color="#3A88F7"
        />
      </TouchableOpacity>
  
    </View>
  );
  
}

export default LanguageScreen;
