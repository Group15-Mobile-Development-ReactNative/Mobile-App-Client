// Stack layout for Settings tab
import { Stack } from "expo-router";

function SettingsStackLayOut() {
  return (
    <Stack>
        <Stack.Screen name="index" options={{title:'Settings'}} />
        <Stack.Screen name="language" options={{title:'Language Change'}} />
    </Stack>
  );
}

export default SettingsStackLayOut;