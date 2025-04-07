// Stack layout for Settings tab
import { Stack } from "expo-router";
import LanguageContext from "@/context/LanguageContext";
import ThemeContext from "@/context/ThemeContext";
import { useContext } from "react";

function SettingsStackLayOut() {

  // Context
  const { language } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme === 'light' ? 'white' : '#1e1e1e',
        },
        headerTitleStyle: {
          color: theme === 'light' ? 'black' : 'white',
          fontWeight: 'bold',
        },
        headerTintColor: theme === 'light' ? 'black' : 'white',
      }}
    >
        <Stack.Screen name="index" options={{title:language==='en'?'Settings':'Asetukset', headerShown:false}} />
        <Stack.Screen name="language" options={{title:language==='en'?'Language Change':'Kielen vaihto'}} />
    </Stack>
  );
}

export default SettingsStackLayOut;