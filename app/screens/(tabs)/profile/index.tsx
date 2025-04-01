import HeaderBanner from '@/components/HeaderBanner';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth, db } from '@/firebase/firebaseConfig';
import { useEffect, useState, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

interface User{
  lastSeen: string,
  createdAt:string,
  id: string,
  profilePic: string,
  displayName:string,
  email:string,
  status: string
}

function ProfileScreen() {

  const router = useRouter();

  //Curret User Data
  const currentUser = auth.currentUser?.uid
  console.log("Current User is: ",currentUser);

  //State Variables
  const [profileData, setProfileData] = useState< User| null>(null)

  useFocusEffect(

    useCallback(()=>{
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
  )

  /*NEED TO DELETE

  const currentUserData = 
  {
    displayName:'Shane Dinod',
    profilePic:'https://ntrepidcorp.com/wp-content/uploads/2016/06/team-1.jpg',
    email:'t3wiry00@students.oamk.fi',
    status:"Hey, I'm using smart Chat"
  }
  */

  const handleLogout = async ()=>{
    try{
      await signOut(auth)
      router.navigate('/screens/auth-screens/login')
    }
    catch(error){
      console.log(error)
    }
    
  }



  return (
    <View style={{flex:1}}>
      {/* Header Part */}
      <HeaderBanner />

      <View style={{flex:2}}>    

          {/* Profile Pic Part */}
          <View style={{flex:3, backgroundColor:'yellow', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>            
            
            <View style={{position:'relative', backgroundColor:'white'}}>
              <View style={{alignItems:'flex-end'}}>
                <Image
                  source={{ uri: profileData?.profilePic }}
                  style={{width:150, height:150, borderRadius:100}}
                
                />
                <TouchableOpacity style={{position:'absolute', backgroundColor:'rgb(16, 197, 16)', borderRadius:100, padding:5}}>
                  <Entypo name="pencil" size={24} color="black" />
                </TouchableOpacity>
              </View> 
            </View>
            <Text style={{fontWeight:'bold', fontSize:20}}>{profileData?.displayName}</Text>
          </View>

          {/* Text Inputs Part */}
          <View style={{flex:4, backgroundColor:'pink'}}>
            <View style={{flex:1, backgroundColor:'white', marginHorizontal:30}}>
              
              <View style={{flex:1, borderBottomColor:'gray', borderBottomWidth:2, flexDirection:'column', justifyContent:'center'}}>
                <Text style={{marginTop:10, color:'rgb(95, 94, 94)'}}>Display Name</Text>
                <View style={{flex:1, flexDirection:'row', gap:15, justifyContent:'flex-start', alignItems:'center'}}>
                  <FontAwesome5 name="user-circle" size={24} color="gray" />
                  <Text>{profileData?.displayName}</Text>
                </View>
              </View>

              <View style={{flex:1, borderBottomColor:'gray', borderBottomWidth:2}}>
                <Text style={{marginTop:10, color:'rgb(95, 94, 94)'}}>Email</Text>
                  <View style={{flex:1, flexDirection:'row', gap:15, justifyContent:'flex-start', alignItems:'center'}}>
                    <FontAwesome5 name="user-circle" size={24} color="gray" />
                    <Text>{profileData?.email}</Text>
                  </View>
                </View>
              <View style={{flex:1, borderBottomColor:'gray', borderBottomWidth:2}}>
                <Text style={{marginTop:10, color:'rgb(95, 94, 94)'}}>Status</Text>
                  <View style={{flex:1, flexDirection:'row', gap:15, justifyContent:'flex-start', alignItems:'center'}}>
                    <FontAwesome5 name="user-circle" size={24} color="gray" />
                    <Text>{profileData?.status}</Text>
                  </View>
                </View>
            </View>
            
          </View>

          {/* Buttons Part */}
          <View style={{flex:2.5, backgroundColor:'yellow', justifyContent:'center', alignItems:'center'}}>

            {/* Edit Profile Button */}
            <TouchableOpacity 
              style={{backgroundColor:'rgb(43, 148, 43)', paddingVertical:12, paddingHorizontal:90, borderRadius:10, marginBottom:15}}
              onPress={()=>router.navigate('/profile-modal')}
              >
              <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', gap:20}}>
                <SimpleLineIcons name="pencil" size={20} color="white" />
                <Text style={{fontSize:18, color:'white'}}>Edit Profile</Text>
              </View>
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity 
              style={{backgroundColor:'rgb(255, 210, 210)', paddingVertical:12, paddingHorizontal:90, borderRadius:10}}
              onPress={handleLogout}
            >
              <View 
                style={{flexDirection:'row', justifyContent:'center', alignItems:'center', gap:20}}>
                <AntDesign name="logout" size={20} color="red" />
                <Text style={{fontSize:18, color:'red'}}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>



      </View>

      
      
    </View>
  );
}

export default ProfileScreen;