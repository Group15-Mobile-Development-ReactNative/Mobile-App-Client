import HeaderBanner from '@/components/HeaderBanner';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth, db, storage } from '@/firebase/firebaseConfig';
import { useEffect, useState, useCallback, useContext } from 'react';
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import Toast from 'react-native-toast-message';
import ThemeContext from '@/context/ThemeContext';


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

  const {theme} = useContext(ThemeContext);

  //Curret User Data
  const currentUser = auth.currentUser?.uid
  console.log("Current User is: ",currentUser);

  //State Variables
  const [profileData, setProfileData] = useState< User| null>(null)
  console.log("profile Data is: ", profileData)
  const [newProfilePic, setNewProfilePic] = useState('')
  const [triggeredWhenSave, setTriggeredWhenSave] = useState(false)


  /* UPON FOCUS ON THE PAGE GET CURRENT USERS'S DATA INTO STATE VARIABLE */
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


  /* UPON CLICK LOGOUT BUTTON THE USER IS SIGNNED OUT FROM THE SESSION */
  const handleLogout = async ()=>{
    try{
      await signOut(auth)
      router.navigate('/screens/auth-screens/login')
    }
    catch(error){
      console.log(error)
    }
    
  }

  /* UPON UPDATE PROFILE PIC THIS FUNCTIONN TRIGGERS */
  const handleUpdateProfilePic = async()=>{

    try{
      // Expo Go Part: https://docs.expo.dev/versions/latest/sdk/imagepicker/
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // 
        allowsEditing: true,
        aspect: [4, 4],
        quality: 0.4,
      });

      console.log("image result is ", result);

      // FireBase Part: https://firebase.google.com/docs/storage/web/upload-files
      if (!result.canceled && currentUser) {
        const imageUri = result.assets[0].uri;
        const response = await fetch(imageUri);
        const blob = await response.blob();
  
        const storageRef = ref(storage, `profilePics/${currentUser}.jpg`);
        await uploadBytes(storageRef, blob);
  
        const downloadURL = await getDownloadURL(storageRef);
        console.log("Download URL: ", downloadURL)
        setNewProfilePic(downloadURL);

        updateChatsWithNewProfilePic(downloadURL);


        // Update Firestore
        await setDoc(doc(db, 'users', currentUser), { profilePic: downloadURL }, { merge: true });

        Toast.show({
          type: 'success',
          text1: 'Profile picture updated!',
          position: 'top',
        });
  
        // Update UI
        setProfileData((prev) => prev ? { ...prev, profilePic: downloadURL } : null);      
        
      }

    }
    catch(error:any){
      console.error("Error uploading image:", error.message);
    }

  }

  

  /* ****** Upon change profilePic, update it in "chats" collection" ****** */
  // Above function is to update profile pic. Upon change below function is triggered

  // When user chages his profilePic, the profilePic in "chats" collection also need to be change.
  /* 
    1. Get docuements which has the current user
    2. Then for each document update the new name
  */
 
  const updateChatsWithNewProfilePic  = async(downloadURL:string)=>{
    try{
      console.log('Triggered')

      // Update userA fields (round 1)
      const q1 = query(collection(db, "chats"), where("userA", "==", currentUser));
      const snap1 = await getDocs(q1);
      console.log(`Found ${snap1.size} chats as userA`);

      snap1.docs.forEach((element) =>{
        console.log("element A is: ",element.data())

        updateDoc(doc(db,"chats", element.id),{
          userAprofilePic: downloadURL
        })
      })

      // Update userB fields  (round 2)
      const q2 = query(collection(db, "chats"), where("userB", "==", currentUser));
      const snap2 = await getDocs(q2);
      console.log(`Found ${snap2.size} chats as userA`);

      snap2.docs.forEach((element) =>{
        console.log("element B is: ",element.data())

        updateDoc(doc(db,"chats", element.id),{
          userBprofilePic: downloadURL
        })
      })

    }
    catch(error){
      console.log(error)
    }

  }


  return (
    <View style={{flex:1}}>
      {/* Header Part */}
      <HeaderBanner />

      <View style={{flex:2, backgroundColor: theme === 'light' ? '#FFFFFF' : '#121212'}}>    

          {/* Profile Pic Part */}
          <ScrollView contentContainerStyle={{ top:20, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{flex:3, backgroundColor: theme === 'light' ? '#FFFFFF' : '#121212', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>            
              
              <View style={{position:'relative', backgroundColor: theme === 'light' ? '#FFFFFF' : '#121212'}}>
                <View style={{alignItems:'flex-end'}}>
                  <Image
                    source={{ uri: profileData?.profilePic }}
                    style={{width:150, height:150, borderRadius:100}}
                  
                  />
                  <TouchableOpacity 
                    style={{position:'absolute', backgroundColor:'rgb(16, 197, 16)', borderRadius:100, padding:5}}
                    onPress={handleUpdateProfilePic}
                    >
                    <Entypo name="pencil" size={24} color="black" />
                  </TouchableOpacity>
                </View> 
              </View>
              <Text style={{fontWeight:'bold', fontSize:20}}>{profileData?.displayName}</Text>
            </View>
          </ScrollView>

          {/* Text Inputs Part */}
          <View style={{flex:4, backgroundColor: theme === 'light' ? '#FFFFFF' : '#121212'}}>
            <View style={{flex:1, backgroundColor: theme === 'light' ? '#FFFFFF' : '#121212', marginHorizontal:30}}>
              
              <View style={{flex:1, borderBottomColor: theme === 'light' ? '#E0E0E0' : '#333333', borderBottomWidth:2, flexDirection:'column', justifyContent:'center'}}>
                <Text style={{marginTop:10, color: theme === 'light' ? '#5C5C5C' : '#AAAAAA'}}>Display Name</Text>
                <View style={{flex:1, flexDirection:'row', gap:15, justifyContent:'flex-start', alignItems:'center'}}>
                  <FontAwesome5 name="user-circle" size={24} color="gray" />
                  <Text style={{color: theme === 'light' ? '#1C1C1E' : '#F2F2F2'}}>{profileData?.displayName}</Text>
                </View>
              </View>

              <View style={{flex:1, borderBottomColor: theme === 'light' ? '#E0E0E0' : '#333333', borderBottomWidth:2}}>
                <Text style={{marginTop:10, color: theme === 'light' ? '#5C5C5C' : '#AAAAAA'}}>Email</Text>
                  <View style={{flex:1, flexDirection:'row', gap:15, justifyContent:'flex-start', alignItems:'center'}}>
                    <FontAwesome5 name="user-circle" size={24} color="gray" />
                    <Text style={{color: theme === 'light' ? '#1C1C1E' : '#F2F2F2'}}>{profileData?.email}</Text>
                  </View>
                </View>
              <View style={{flex:1, borderBottomColor: theme === 'light' ? '#E0E0E0' : '#333333', borderBottomWidth:2}}>
                <Text style={{marginTop:10, color: theme === 'light' ? '#5C5C5C' : '#AAAAAA'}}>Status</Text>
                  <View style={{flex:1, flexDirection:'row', gap:15, justifyContent:'flex-start', alignItems:'center'}}>
                    <FontAwesome5 name="user-circle" size={24} color="gray" />
                    <Text style={{color: theme === 'light' ? '#1C1C1E' : '#F2F2F2'}}>{profileData?.status}</Text>
                  </View>
                </View>
            </View>
            
          </View>

          {/* Buttons Part */}
          <View style={{flex:2.5, backgroundColor: theme === 'light' ? '#FFFFFF' : '#121212' , justifyContent:'center', alignItems:'center'}}>

            {/* Edit Profile Button */}
            <TouchableOpacity 
              style={{backgroundColor:'rgb(43, 148, 43)', paddingVertical:12, width:300, borderRadius:10, marginBottom:15}}
              onPress={()=>router.navigate('/profile-modal')}
              >
              <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', gap:20}}>
                <SimpleLineIcons name="pencil" size={20} color="white" />
                <Text style={{fontSize:18, color:'white'}}>Edit Profile</Text>
              </View>
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity 
              style={{backgroundColor:'rgb(255, 210, 210)', paddingVertical:12, width:300, borderRadius:10}}
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