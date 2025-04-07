
import {Stack} from "expo-router";
import LanguageContext from "@/context/LanguageContext";
import ThemeContext from "@/context/ThemeContext";
import { useContext } from "react";

function ChatsStackLayOut() { 

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
      <Stack.Screen name="index" options={{title:language==='en'?'Chats':'Chatit', headerShown:false}} />
      <Stack.Screen name="[id]" options={{title:language==='en'?'Messages':'Viestit'}} />
    </Stack>
  );
}

export default ChatsStackLayOut;