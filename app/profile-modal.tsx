import { useRouter } from 'expo-router';
import {Pressable,StyleSheet,Text,TextInput,TouchableOpacity,View} from 'react-native';
import Animated, {FadeIn,SlideInDown,SlideOutDown,} from 'react-native-reanimated';
import Octicons from '@expo/vector-icons/Octicons';

export default function Modal() {
  const router = useRouter();

  const currentUserData = 
  {
    displayName:'Shane Dinod',
    profilePic:'https://ntrepidcorp.com/wp-content/uploads/2016/06/team-1.jpg',
    email:'t3wiry00@students.oamk.fi',
    status:"Hey, I'm using smart Chat"
  }

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeIn} 
      style={{
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#00000040',
      }}
    >
      {/* Dismiss when pressing outside */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => router.back()} // 
      />

      <Animated.View
        entering={SlideInDown}
        exiting={SlideOutDown} // slide down when dismissed
        style={{
          width: '100%',
          height: '60%',
          alignItems: 'center',
          justifyContent: 'flex-start',
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 20,
        }}
      >
        <View style={{position:'absolute'}}>
          <Octicons name="horizontal-rule" size={24} color="gray" />          
        </View>
        
        <Text style={{ fontWeight: 'bold', fontSize:15}}>Edit Profile</Text>
        

        <View style={{flex:8, backgroundColor:'yellow', justifyContent:'center', alignItems:'flex-start', width:'90%' }}>
          
          <Text style={{color:'gray'}}>Display Name</Text>
          <TextInput 
            style={{borderWidth:1, borderColor:'gray', width:'100%', height:50, borderRadius:8, marginBottom:10}}
            placeholder=''
            value={currentUserData.displayName}
          />

          <Text style={{color:'gray'}}>Email</Text>
          <TextInput 
            style={{borderWidth:1, borderColor:'gray', width:'100%', height:50, borderRadius:8, marginBottom:10}}
            placeholder=''
            value={currentUserData.email}
          />

          <Text style={{color:'gray'}}>Status</Text>
          <TextInput 
            style={{borderWidth:1, borderColor:'gray', width:'100%', height:50, borderRadius:8, marginBottom:10}}
            placeholder=''
            value={currentUserData.status}
          />
          
        </View>



        <View style={{flex:2, backgroundColor:'pink', flexDirection:'row', justifyContent:'center', alignItems:'center', gap:20}}>
          <TouchableOpacity
            style={{backgroundColor:'#ECF9FF', width:130, height:50, borderRadius:20, justifyContent:'center', alignItems:'center'}}          
            onPress={() => router.back()}>
            <Text style={{color:'#3AB2E8', fontWeight:'bold', fontSize:15}}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={{backgroundColor:'#46B5BD', width:130, height:50, borderRadius:30, justifyContent:'center', alignItems:'center'}}>
            <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>Save</Text>
          </TouchableOpacity>
        </View>

        
      </Animated.View>
    </Animated.View>
  );
}
