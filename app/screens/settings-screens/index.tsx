import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

function SettingsScreen() {
  const router = useRouter();

  return (
    <View>
      <Text>Settings Screen</Text>
      <TouchableOpacity onPress={()=>{router.push('/screens/settings-screens/language')}}>
        <Text>Language</Text>
      </TouchableOpacity>
    </View>
  );
}

export default SettingsScreen;