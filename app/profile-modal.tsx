import { useRouter } from 'expo-router';
import {Alert, Pressable,StyleSheet,Text,TextInput,TouchableOpacity,View} from 'react-native';
import Animated, {FadeIn,SlideInDown,SlideOutDown,} from 'react-native-reanimated';
import Octicons from '@expo/vector-icons/Octicons';
import { auth, db } from '@/firebase/firebaseConfig';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

interface User{
  lastSeen: string,
  createdAt:string,
  id: string,
  profilePic: string,
  displayName:string,
  email:string,
  status: string
}

export default function Modal() {

  const router = useRouter();

  //Curret User Data
  const currentUser = auth.currentUser?.uid
  console.log("Current User is in Modal: ",currentUser);

  //State Variables
  const [profileData, setProfileData] = useState< User| null>(null)

  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userStatus, setUserStatus] = useState('')




  useEffect(()=>{
    const fetchCurrentUser = async ()=>{

      try{
        if (currentUser) {
          const queryUserSnap = await getDoc(doc(db, "users", currentUser.toString()));
          const userData = queryUserSnap.data()
          console.log("user Data is: ", userData);
          if (userData) {
            setProfileData({
              lastSeen: userData.lastSeen,
              createdAt: userData.createdAt,
              id: userData.id,
              profilePic: userData.profilePic,
              displayName: userData.displayName,
              email: userData.email,
              status: userData.status,
            } );
            setUserName(userData.displayName);
            setUserEmail(userData.email);
            setUserStatus(userData.status)
          } else {
            console.error("User data is undefined");
          }
        } 
        
        else {
          console.error("Current user is undefined");
        }
      }

      catch(error){
        console.log(error);
      }
    }

    fetchCurrentUser();

  },[])

  /* Save Button function */
  const handleSave = async ()=>{
    try{
      if (currentUser) {
        await updateDoc(doc(db, "users", currentUser), { displayName: userName, email: userEmail, status: userStatus });
        router.navigate('/screens/(tabs)/profile')
      }       
      else {
        console.error("Current user is undefined");
      }
    }
    catch(error){
      console.log(error)
    }
  }



  /* NEED TO DELETE

  const currentUserData = 
  {
    displayName:'Shane Dinod',
    profilePic:'https://ntrepidcorp.com/wp-content/uploads/2016/06/team-1.jpg',
    email:'t3wiry00@students.oamk.fi',
    status:"Hey, I'm using smart Chat"
  }
  */

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
            value={userName}
            onChangeText={setUserName}
          />

          <Text style={{color:'gray'}}>Email</Text>
          <TextInput 
            style={{borderWidth:1, borderColor:'gray', width:'100%', height:50, borderRadius:8, marginBottom:10}}
            placeholder=''
            value={userEmail}
            onChangeText={setUserEmail}
          />

          <Text style={{color:'gray'}}>Status</Text>
          <TextInput 
            style={{borderWidth:1, borderColor:'gray', width:'100%', height:50, borderRadius:8, marginBottom:10}}
            placeholder=''
            value={userStatus}
            onChangeText={setUserStatus}
          />
          
        </View>



        <View style={{flex:2, backgroundColor:'pink', flexDirection:'row', justifyContent:'center', alignItems:'center', gap:20}}>
          <TouchableOpacity
            style={{backgroundColor:'#ECF9FF', width:130, height:50, borderRadius:20, justifyContent:'center', alignItems:'center'}}          
            onPress={() => router.back()}>
            <Text style={{color:'#3AB2E8', fontWeight:'bold', fontSize:15}}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={{backgroundColor:'#46B5BD', width:130, height:50, borderRadius:30, justifyContent:'center', alignItems:'center'}}
            onPress={handleSave}
            >
            <Text style={{color:'white', fontWeight:'bold', fontSize:17}}>Save</Text>
          </TouchableOpacity>
        </View>

        
      </Animated.View>
    </Animated.View>
  );
}
