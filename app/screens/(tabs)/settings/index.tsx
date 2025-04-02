import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import HeaderBanner from '@/components/HeaderBanner';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';


function SettingsScreen() {
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  return (
    <View>

      {/* Header Part */}
      <HeaderBanner />

      {/* Dark Mode Row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 40, marginTop: 40 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="moon" size={25} color="#3A888D" />
          <Text style={{ marginLeft: 20 }}>Dark Mode</Text>
        </View>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          thumbColor={darkMode ? "#3A888D" : "#f4f3f4"}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
        />
      </View>


    <TouchableOpacity
       onPress={()=>router.push('/screens/(tabs)/settings/language')}
      style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 40, marginTop: 60,}}
      >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
       <MaterialIcons name="translate" size={25} color="#3A888D" />
       <Text style={{ marginLeft: 20 }}>Language</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 40, marginTop: 60 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="notifications" size={24} color="#3A888D" />
          <Text style={{ marginLeft: 20 }}>Notifications</Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          thumbColor={notificationsEnabled ? "#3A888D" : "#f4f3f4"}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
        />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 50 }}>
        <View style={{ flex: 1, height: 2, backgroundColor: '#d3d3d3', marginHorizontal: 40 }} />
      </View>


      <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginLeft: 50, marginTop: 50 }}>
        <Ionicons name="newspaper" size={24} color="#3A888D" />
        <Text style={{ marginLeft: 20, marginTop: 5 }}>Terms of Service</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginLeft: 50, marginTop: 50 }}>
        <MaterialIcons name="policy" size={24} color="#3A888D" />
        <Text style={{ marginLeft: 20, marginTop: 5 }}>Privacy Policy</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginLeft: 50, marginTop: 50 }}>
        <Feather name="help-circle" size={24} color="#3A888D" />
        <Text style={{ marginLeft: 20, marginTop: 5 }}>Help Center</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginLeft: 50, marginTop: 50 }}>
        <Ionicons name="layers-outline" size={24} color="#3A888D" />
        <Text style={{ marginLeft: 20, marginTop: 5 }}>About</Text>
      </View>

    </View>
  );
}

export default SettingsScreen;