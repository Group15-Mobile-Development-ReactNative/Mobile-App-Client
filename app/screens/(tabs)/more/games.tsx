import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import ThemeContext from '@/context/ThemeContext';
import LanguageContext from '@/context/LanguageContext';
import { useContext } from "react";

function Games() {
  const router = useRouter();

  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  
  return(
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme === 'light' ? '#FFFFFF' : '#121212' }}>
      <ScrollView >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme === 'light' ? '#FFFFFF' : '#121212', width:350}}>

          <TouchableOpacity 
            style={{flex:1, width:300, height:170, backgroundColor: theme === 'light' ? '#FFFFFF' : '#121212', marginTop:30}}
            onPress={() => router.push('/screens/games-pages/TapTheCircleGame')}>
            <Image 
              source={require('@/assets/games-images/tap-the-circle.png')}
              style={{width:'100%', height:'100%', borderRadius:20}}
              resizeMode='cover'
            />
            <View style={{top:-30, backgroundColor:'gray', opacity:0.5, height:30, borderBottomEndRadius:20, borderBottomStartRadius:20}}>
              <Text style={{left:10, top:4, color:'yellow', fontWeight:'bold'}}>Tap the Circle</Text>
            </View>            
          </TouchableOpacity>

          <TouchableOpacity 
            style={{flex:1, width:300, height:170, backgroundColor: theme === 'light' ? '#FFFFFF' : '#121212', marginTop:30}}
            onPress={() => router.push('/screens/games-pages/MemoryFlipGame')}>
            <Image 
              source={require('@/assets/games-images/memory-flip.png')}
              style={{width:'100%', height:'100%', borderRadius:20}}
              resizeMode='cover'
            />
            <View style={{top:-30, backgroundColor:'gray', opacity:0.5, height:30, borderBottomEndRadius:20, borderBottomStartRadius:20}}>
              <Text style={{left:10, top:4, color:'yellow', fontWeight:'bold'}}>Memory Flip Game</Text>
            </View>            
          </TouchableOpacity>

        </View>        
      </ScrollView>
    </View>
  )
}

export default Games;
