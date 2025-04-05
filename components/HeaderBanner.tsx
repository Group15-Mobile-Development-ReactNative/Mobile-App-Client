import ThemeContext from '@/context/ThemeContext';
import React, { useContext } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

export default function HeaderBanner() {
  const {theme} = useContext(ThemeContext);
  //onsole.log('benner:', theme);

  return (
    <View style={[styles.container, {backgroundColor: theme ==='light'?'white':'#121212'}]}>
      <Image
        source={require('../assets/header-images/Header-Background.png')}
        style={styles.background}
      />
      <Image
        source={require('../assets/header-images/Smart-Chat-Logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Smart Chat</Text>
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
  logo: {
    position: 'absolute',
    top: 10,
    left: 10,
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
