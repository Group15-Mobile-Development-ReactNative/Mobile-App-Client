import { useRouter } from 'expo-router';
import {KeyboardAvoidingView, Platform, Pressable,StyleSheet,Text,TextInput,TouchableOpacity,View, ScrollView} from 'react-native';
import Animated, {FadeIn,SlideInDown,SlideOutDown,} from 'react-native-reanimated';
import Octicons from '@expo/vector-icons/Octicons';
import { auth, db } from '@/firebase/firebaseConfig';
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import Toast from 'react-native-toast-message';

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
        updateChatsWithNewUserName(userName);   //Trigger below function upon saving details

        Toast.show({
          type: 'success',
          text1: 'Profile data updated!',
          position: 'top',
        });

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

  /* ****** Upon change userName, update it in "chats collection" ****** */
  // When user chages his name, the name in "chats" collection also need to be change.
  // So below function triggers when user changes his name
  // I can move this to handleSave. But I did this way in oder to understand this by ease.
  /* 
    1. Get docuements which has the current user
    2. Then for each document update the new name
  */
    const updateChatsWithNewUserName  = async(userName:string)=>{
      try{
        // Update userA fields (round 1)
        const q1 = query(collection(db, "chats"), where("userA", "==", currentUser));
        const snap1 = await getDocs(q1);
        console.log(`Found ${snap1.size} chats as userA`);

        snap1.docs.forEach((element) =>{
          console.log("element A is: ",element.data())

          updateDoc(doc(db,"chats", element.id),{
            userAdisplayName: userName
          })
        })

        // Update userB fields  (round 2)
        const q2 = query(collection(db, "chats"), where("userB", "==", currentUser));
        const snap2 = await getDocs(q2);
        console.log(`Found ${snap2.size} chats as userA`);

        snap2.docs.forEach((element) =>{
          console.log("element B is: ",element.data())

          updateDoc(doc(db,"chats", element.id),{
            userBdisplayName: userName
          })
        })

      }
      catch(error){
        console.log(error)
      }

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
      }}>

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
          height: '58%',
          justifyContent: 'flex-start',
          backgroundColor: 'white',
          borderTopEndRadius: 30,
          borderTopStartRadius: 30,
          padding: 0,
        }}>   

        <ScrollView contentContainerStyle={{ top:20, justifyContent: 'center', alignItems: 'center', backgroundColor:'white' }}>

          <View style={{justifyContent: 'center', alignItems: 'center',bottom:18}}>
            <Octicons name="horizontal-rule" size={24} color="gray" />    
              
            <Text style={{ fontWeight: 'bold', fontSize:15}}>Edit Profile</Text>
          </View>
          
          
              

          <View style={{flex:8, backgroundColor:'white', justifyContent:'center', alignItems:'flex-start', width:'90%', marginBottom:50, marginTop: 30 }}>
            
            <Text style={{color:'gray'}}>Display Name</Text>
            <TextInput 
              style={{borderWidth:1, borderColor:'gray', width:'100%', height:50, borderRadius:8, marginBottom:15}}
              placeholder=''
              value={userName}
              onChangeText={setUserName}
            />

            <Text style={{color:'gray'}}>Email</Text>
            <TextInput 
              style={{borderWidth:1, borderColor:'gray', width:'100%', height:50, borderRadius:8, marginBottom:15}}
              placeholder=''
              value={userEmail}
              onChangeText={setUserEmail}
            />

            <Text style={{color:'gray'}}>Status</Text>
            <TextInput 
              style={{borderWidth:1, borderColor:'gray', width:'100%', height:50, borderRadius:8, marginBottom:0}}
              placeholder=''
              value={userStatus}
              onChangeText={setUserStatus}
            />
            
          </View>



          <View style={{flex:2, backgroundColor:'white', flexDirection:'row', justifyContent:'center', alignItems:'center', gap:20}}>
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
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
}
