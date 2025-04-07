// Drawer layout for More tab
import { Drawer } from "expo-router/drawer";
import LanguageContext from "@/context/LanguageContext";
import ThemeContext from "@/context/ThemeContext";
import { useContext } from "react";

function MoreDrawerLayOut() {

  // Context
  const { language } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);

  return (
    <Drawer
        screenOptions={{
          // Header
          headerStyle: {
            backgroundColor: theme === 'light' ? 'white' : '#1e1e1e',
          },
          headerTitleStyle: {
            color: theme === 'light' ? 'black' : 'white',
            fontWeight: 'bold',
          },
          headerTintColor: theme === 'light' ? 'black' : 'white',

          // Drawer styling
          drawerStyle: {
            backgroundColor: theme === 'light' ? 'white' : '#1e1e1e',
          },
          drawerLabelStyle: {
            color: theme === 'light' ? 'black' : 'white',
          },
          drawerActiveTintColor: theme === 'light' ? '#007AFF' : '#75E6DA',
        }}
      >
      <Drawer.Screen name="index" options={{title: language === 'en' ? 'Stats' : 'Tilastot' }} />
      <Drawer.Screen name="games" options={{title: language === 'en' ? 'Games' : 'Pelit' }} />
    </Drawer>
  );
}

export default MoreDrawerLayOut;