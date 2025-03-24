import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

function IndividualChatScreen() {
  const {id} = useLocalSearchParams();

  return (
    <View>
      <Text>Get chats of userId:    {id}</Text>
    </View>
  );
}

export default IndividualChatScreen;