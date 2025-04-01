import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message'; // Import Toast

export const unstable_settings = {
  initialRouteName: 'index',
};


export default function Layout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{headerShown:false}} />
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'transparentModal',
            animation: 'fade',
            headerShown: false,
          }}
        />
      </Stack>
      
    </>
  );
}
