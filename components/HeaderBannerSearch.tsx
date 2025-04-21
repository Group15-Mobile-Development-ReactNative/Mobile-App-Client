import React, { useState, useContext } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import ThemeContext from '@/context/ThemeContext';
import LanguageContext from "@/context/LanguageContext";

interface HeaderBannerSearchProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
}

export default function HeaderBannerSearch({ searchValue, setSearchValue }: HeaderBannerSearchProps) { 

  const {theme} = useContext(ThemeContext);
  const {language} = useContext(LanguageContext)

  const router = useRouter();
  return (
    <View style={[styles.container, {backgroundColor: theme ==='light'?'white':'#121212'}]}>
      <Image
        source={require('../assets/header-images/Header-Background.png')}
        style={styles.background}
      />
      <View style={styles.backButtonContainer}>
        <TouchableOpacity 
          style={{backgroundColor:'rgba(97,160,164,255)', padding:5, borderRadius:30, width:40, height:40, justifyContent:'center', alignItems:'center'}}
          onPress={()=>router.back()}
          >
            <Ionicons name="arrow-back-outline" size={24} color="white" />
        </TouchableOpacity>     
      </View>
      <TextInput
        placeholder={language==='en'?'Search':'Haku'}
        style={{position:'absolute', width:'75%', height:40, borderWidth:1, borderColor:'white', top:25, left:80, backgroundColor:'white', borderRadius:20, padding:10}}
        value={searchValue}
        onChangeText={setSearchValue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:'white',
    width: '100%',
    height: 105,
    paddingHorizontal: 3, 
    position: 'relative', // for the reference of absolute positioning (logo and text).  ex:relative to background image logo is absolute
  },
  background: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',   
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 25,
    left: 25,
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  title: {
    position: 'absolute',
    top: 25,
    left: 70,
    fontFamily: 'MadimiOne-Regular',
    fontSize: 20,
    color: 'white',
  },
});
