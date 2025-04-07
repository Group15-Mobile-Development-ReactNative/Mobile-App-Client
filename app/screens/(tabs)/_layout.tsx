// Tab layout 
import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// To Apply Fonts "Madimi One" ---------- Start
import { useFonts } from 'expo-font';
import { View, ActivityIndicator } from 'react-native';
import { useContext, useState } from "react";
import ThemeContext from "@/context/ThemeContext";
import LanguageContext from "@/context/LanguageContext";
// To Apply Fonts "Madimi One" ---------- End



function TabsLayOut() {

  const {language, setLanguage} = useContext(LanguageContext);
  const {theme} = useContext(ThemeContext);

  // To Apply Fonts "Madimi One" ---------- Start
  const [fontsLoaded] = useFonts({
    'MadimiOne-Regular': require('../../../assets/fonts/MadimiOne-Regular.ttf'),
  });
  

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }
  // To Apply Fonts "Madimi One" ---------- End


  

  return (    
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme === 'light' ? '#4CAF50' : '#66BB6A',
        tabBarInactiveTintColor: theme === 'light' ? '#777' : '#bbb',
        tabBarStyle: {
          backgroundColor: theme === 'light' ? '#fff' : '#1e1e1e',
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontFamily: 'MadimiOne-Regular',
        },
      }}
    >
        <Tabs.Screen name="chats" options={{
            title:language==='en'?'Chats':'Chatit',
            tabBarIcon: ({size, color})=>(<Ionicons name="chatbox-ellipses" size={size} color={color} />),
            headerShown:false
        }} />

        <Tabs.Screen name="profile" options={{
            title:language==='en'?'Profile':'Profiili',
            tabBarIcon: ({size, color})=>(<FontAwesome name="user" size={size} color={color} />),
            headerShown:false
        }} />

        <Tabs.Screen name="more" options={{
            title:language==='en'?'More':'Lisää',
            tabBarIcon: ({size, color})=>(<Ionicons name="apps" size={size} color={color} />),
            headerShown:false
        }} />        

        <Tabs.Screen name="settings" options={{
            title:language==='en'?'Settings':'Asetukset',
            tabBarIcon: ({size, color})=>(<Ionicons name="settings" size={size} color={color} />),
            headerShown:false
        }} />


        <Tabs.Screen name="profile/edit-profile" options={{
          href:null
        }} />
    </Tabs>
  );
}

export default TabsLayOut;