import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import HeaderBanner from '@/components/HeaderBanner';

function SettingsScreen() {
  const router = useRouter();


  return (
    <View>

      {/* Header Part */}
      <HeaderBanner />

      {/* Body Part */}
      <Text>Settings Screen</Text>
    </View>
  );
}

export default SettingsScreen;