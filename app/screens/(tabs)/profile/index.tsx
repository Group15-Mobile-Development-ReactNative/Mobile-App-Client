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
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import Toast from 'react-native-toast-message';
import ThemeContext from '@/context/ThemeContext';
import LanguageContext from "@/context/LanguageContext";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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

  // Context
  const {language} = useContext(LanguageContext)
  const {theme} = useContext(ThemeContext);

  const router = useRouter();

  
  

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
      // Sign out from Firebase
      await signOut(auth)

      // Sign out from Google
      await GoogleSignin.signOut();
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


  /* ****** Upon click delete account, delete the account ****** */
  const handleDeleteAccount = async () => {
  try {
    const user = auth.currentUser;

    if (!user) {
      console.log("No user is currently signed in.");
      return;
    }

    const userId = user.uid;

    

    // 1. Delete chats where the user is userA or userB
    try {
      const chatAQuery = query(collection(db, "chats"), where("userA", "==", currentUser));
      const chatASnap = await getDocs(chatAQuery);
    
      chatASnap.docs.map(async (docSnap) => {
        await deleteDoc(doc(db, "chats", docSnap.id));
      });
    
      const chatBQuery = query(collection(db, "chats"), where("userB", "==", currentUser));
      const chatBSnap = await getDocs(chatBQuery);
    
      chatBSnap.docs.map(async (docSnap) => {
        await deleteDoc(doc(db, "chats", docSnap.id));
      });
    
      console.log("All related chats deleted.");
    } catch (error) {
      console.log("Error deleting chats:", error);
    }
    

    // 2. Delete messages where user is sender
    try {
      const messageQuery = query(collection(db, "messages"), where("senderId", "==", currentUser));
      const messageSnap = await getDocs(messageQuery);
    
      messageSnap.docs.map(async (docSnap) => {
        await deleteDoc(doc(db, "messages", docSnap.id));
      });
    
      console.log("All messages sent by user deleted.");
    } catch (error) {
      console.log("Error deleting messages:", error);
    }
    

    // 3. Delete calls where user is caller or receiver
    try {
      const callCallerQuery = query(collection(db, "calls"), where("callerId", "==", currentUser));
      const callCallerSnap = await getDocs(callCallerQuery);
    
      callCallerSnap.docs.map(async (docSnap) => {
        await deleteDoc(doc(db, "calls", docSnap.id));
      });
    
      const callReceiverQuery = query(collection(db, "calls"), where("receiverId", "==", currentUser));
      const callReceiverSnap = await getDocs(callReceiverQuery);
    
      callReceiverSnap.docs.map(async (docSnap) => {
        await deleteDoc(doc(db, "calls", docSnap.id));
      });
    
      console.log("All related call records deleted.");
    } catch (error) {
      console.log("Error deleting calls:", error);
    }
    

    // 4. Delete profile pic from Firebase Storage
    const picRef = ref(storage, `profilePics/${userId}.jpg`);
    await deleteObject(picRef).catch((err) => {
      console.log("⚠️ No profile pic to delete or error occurred:", err.message);
    });

    // 5. Delete user document from Firestore
    await deleteDoc(doc(db, "users", userId));

    // 6. Delete from Firebase Auth
    await user.delete();



    // 7. Google Sign out (if used)
    await GoogleSignin.signOut().catch(() => {});

    // 8. Redirect to login
    router.push("/screens/auth-screens/login");

    Toast.show({
      type: "success",
      text1: "Account deleted successfully",
    });

  } catch (error: any) {
    console.error("❌ Failed to delete account:", error.message);

    // If user.delete() fails due to recent sign-in requirement
    if (error.code === "auth/requires-recent-login") {
      Toast.show({
        type: "error",
        text1: "Please log in again to delete your account.",
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Error deleting account",
        text2: error.message,
      });
    }
  }
};


  return (
    <View style={{flex:1}}>
      {/* Header Part */}
      <HeaderBanner />

      <View style={{flex:2, backgroundColor: theme === 'light' ? '#FFFFFF' : '#121212'}}>    

          {/* Profile Pic Part */}
          <ScrollView contentContainerStyle={{ top:20, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{flex:3, backgroundColor: theme === 'light' ? '#FFFFFF' : '#121212', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>            
              
              <View style={{position: 'relative', width: 160, height: 160, borderRadius: 80, borderWidth: 4, borderColor: theme === 'light' ? '#4CAF50' : '#66BB6A', shadowColor: theme === 'light' ? '#000' : '#00FFC2', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6, elevation: 6,backgroundColor: theme === 'light' ? '#FFF' : '#1e1e1e'}}>
                <View style={{alignItems:'flex-end'}}>
                  <Image
                    source={{ uri: profileData?.profilePic }}
                    style={{width:150, height:150, borderRadius:100}}
                  
                  />
                  {/* Edit Icon */}
                  <TouchableOpacity 
                    style={{position:'absolute', backgroundColor: theme === 'light' ? '#4CAF50' : '#66BB6A', borderRadius:100, padding:5, borderWidth: 2, borderColor: theme === 'light' ? '#fff' : '#1e1e1e'}}
                    onPress={handleUpdateProfilePic}
                    >
                    <Entypo name="pencil" size={24} color="black" />
                  </TouchableOpacity>
                </View> 
              </View>
              
              <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', gap:10}}>
                {/* Name Text */}
                <Text style={{ marginTop: 20, fontSize: 22, fontWeight: 'bold', color: theme === 'light' ? '#000' : '#FFF' }}>{profileData?.displayName}</Text>
                {/* Delete button */}
                <TouchableOpacity 
                  style={{backgroundColor: theme === 'light' ? '#FFCDD2' : '#EF5350', borderRadius:100, padding:5, borderWidth: 2, borderColor: theme === 'light' ? '#fff' : '#1e1e1e',top:10}}
                  onPress={handleDeleteAccount}
                >
                  <FontAwesome name="trash-o" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Text Inputs Part */}
          <View style={{flex:4, backgroundColor: theme === 'light' ? '#FFFFFF' : '#121212',marginTop: -5}}>
            <View style={{flex:1, backgroundColor: theme === 'light' ? '#FFFFFF' : '#121212', marginHorizontal:30}}>
              
              <View style={{flex:1, borderBottomColor: theme === 'light' ? '#E0E0E0' : '#333333', borderBottomWidth:2, flexDirection:'column', justifyContent:'center'}}>
                <Text style={{marginTop:10, color: theme === 'light' ? '#5C5C5C' : '#AAAAAA'}}>{language==='en'?'Display Name':'Näyttönimi'}</Text>
                <View style={{flex:1, flexDirection:'row', gap:15, justifyContent:'flex-start', alignItems:'center'}}>
                  <FontAwesome5 name="user-circle" size={24} color="gray" />
                  <Text style={{color: theme === 'light' ? '#1C1C1E' : '#F2F2F2'}}>{profileData?.displayName}</Text>
                </View>
              </View>

              <View style={{flex:1, borderBottomColor: theme === 'light' ? '#E0E0E0' : '#333333', borderBottomWidth:2}}>
                <Text style={{marginTop:10, color: theme === 'light' ? '#5C5C5C' : '#AAAAAA'}}>{language==='en'?'Email':'Sähköposti'}</Text>
                  <View style={{flex:1, flexDirection:'row', gap:15, justifyContent:'flex-start', alignItems:'center'}}>
                    <FontAwesome5 name="user-circle" size={24} color="gray" />
                    <Text style={{color: theme === 'light' ? '#1C1C1E' : '#F2F2F2'}}>{profileData?.email}</Text>
                  </View>
                </View>
              <View style={{flex:1, borderBottomColor: theme === 'light' ? '#E0E0E0' : '#333333', borderBottomWidth:2}}>
                <Text style={{marginTop:10, color: theme === 'light' ? '#5C5C5C' : '#AAAAAA'}}>{language==='en'?'Status':'Status'}</Text>
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
              style={{backgroundColor: theme === 'light' ? '#4CAF50' : '#66BB6A', paddingVertical:12, width:300, borderRadius:10, marginBottom:15}}
              onPress={()=>router.navigate('/profile-modal')}
              >
              <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', gap:20}}>
                <SimpleLineIcons name="pencil" size={20} color="white" />
                <Text style={{fontSize:18, color:'white'}}>{language==='en'?'Edit Profile':'Muokkaa profiilia'}</Text>
              </View>
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity 
              style={{backgroundColor: theme === 'light' ? '#FFCDD2' : '#EF5350', paddingVertical:12, width:300, borderRadius:10}}
              onPress={handleLogout}
            >
              <View 
                style={{flexDirection:'row', justifyContent:'center', alignItems:'center', gap:20}}>
                <AntDesign name="logout" size={20} color={theme === 'light' ? '#C62828' : '#FFCDD2'} />
                <Text style={{fontSize:18, color: theme === 'light' ? '#C62828' : '#FFCDD2'}}>{language==='en'?'Logout':'Kirjaudu ulos'}</Text>
              </View>
            </TouchableOpacity>
          </View>



      </View>

      
      
    </View>
  );
}

export default ProfileScreen;