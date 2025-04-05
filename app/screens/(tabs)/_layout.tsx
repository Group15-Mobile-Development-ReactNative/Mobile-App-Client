// Tab layout 
import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// To Apply Fonts "Madimi One" ---------- Start
import { useFonts } from 'expo-font';
import { View, ActivityIndicator } from 'react-native';
import { useState } from "react";
import ThemeContext from "@/context/ThemeContext";
// To Apply Fonts "Madimi One" ---------- End



function TabsLayOut() {

  // To Apply Fonts "Madimi One" ---------- Start
  const [fontsLoaded] = useFonts({
    'MadimiOne-Regular': require('../../../assets/fonts/MadimiOne-Regular.ttf'),
  });

  // USE CONTEXT PART
  const [theme , setTheme] = useState('light')
  console.log('Theme is: ', theme)

  

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }
  // To Apply Fonts "Madimi One" ---------- End


  

  return (
    <ThemeContext.Provider value={{theme,setTheme}}>
    <Tabs>
        <Tabs.Screen name="chats" options={{
            title:'Chats',
            tabBarIcon: ({size, color})=>(<Ionicons name="chatbox-ellipses" size={size} color={color} />),
            headerShown:false
        }} />

        <Tabs.Screen name="profile" options={{
            title:'Profile',
            tabBarIcon: ({size, color})=>(<FontAwesome name="user" size={size} color={color} />),
            headerShown:false
        }} />

        <Tabs.Screen name="more" options={{
            title:'More',
            tabBarIcon: ({size, color})=>(<Ionicons name="apps" size={size} color={color} />),
            headerShown:false
        }} />        

        <Tabs.Screen name="settings" options={{
            title:'Settings',
            tabBarIcon: ({size, color})=>(<Ionicons name="settings" size={size} color={color} />),
            headerShown:false
        }} />


        <Tabs.Screen name="profile/edit-profile" options={{
          href:null
        }} />
    </Tabs>
    </ThemeContext.Provider>
  );
}

export default TabsLayOut;