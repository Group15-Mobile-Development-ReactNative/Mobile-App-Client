import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="screens/(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="screens/auth-screens" options={{ headerShown: false }} />
      <Stack.Screen name="screens/search-screen/index" options={{ headerShown: false }} />
      <Stack.Screen
        name="profile-modal"
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
