import { Stack, useRouter  } from 'expo-router';
import Toast from 'react-native-toast-message'; // Import Toast
import ThemeContext from "@/context/ThemeContext";
import LanguageContext from "@/context/LanguageContext";
import { useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';

export default function RootLayout() {

  // USE CONTEXT PART
  const [theme , setTheme] = useState('light')
  console.log('Theme is: ', theme)

  const [language, setLanguage] = useState('en')
  console.log('Language is in root: ', language)

  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.log('User logged out — redirecting to login');
        router.replace('/screens/auth-screens/login');
      }
    });

    return () => unsubscribe(); // cleanup
  }, []);
  return (

    <ThemeContext.Provider value={{theme,setTheme}}>
      <LanguageContext.Provider value={{language,setLanguage}}>
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
          <Stack.Screen name="screens/call/AudioCallScreen" options={{headerShown:false}} />
        </Stack>
        <Toast />
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
}
