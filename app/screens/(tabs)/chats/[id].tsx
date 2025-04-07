import { View, Text, Image, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import { auth, db, storage } from '@/firebase/firebaseConfig';
import { useEffect, useRef, useState } from 'react';
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import LanguageContext from "@/context/LanguageContext";
import { useContext } from "react";

import { AGORA_APP_ID, AGORA_TEMP_TOKEN, CHANNEL_NAME  } from '@/constants/agoraConfig';
import ThemeContext from '@/context/ThemeContext';

interface UserB{
  userid: string;
  email: string;
  displayName: string;
  profilePic: string | undefined;
}

interface Message {
  messageId: string;
  chatId: string;
  senderId: string;
  text: string;
  imageUrl: string | null;
  fileUrl: string | null;
  sentAt: string;
}

function IndividualChatScreen() {  

  // Context
  const {language} = useContext(LanguageContext)
  const { theme } = useContext(ThemeContext);

  

  //OTHER USERS ID CATCH
  const {id} = useLocalSearchParams();
  console.log("Clicked User is", id)

  //CURRENT USER ID FROM FIREBASE AUTH
  const currentUserEmail = auth.currentUser?.email
  const currentUserId = auth.currentUser?.uid
  console.log("Current User email: ", currentUserEmail);
  console.log("Current User id: ", currentUserId);



  /* **** STATE VARIABLES **** */

  // To get other user data (Gets by below useEffect)
  const [userBinfo, setUserBinfo]= useState<UserB|null>(null)
  console.log('userBinfo: ', userBinfo);

  // To get current user data (Gets by below useEffect)
  const [currentUserInfo, setCurrentUserInfo]= useState<any>(null)
  console.log('currentUserInfo: ', currentUserInfo);

  // To save current send message
  const [inputMessage, setInputMessage] = useState<string>('')
  console.log("Just now inputted message: ",inputMessage)

  // to detect FlatList Scrolling
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  
  // To delete message
  const [deletingId, setDeletingId] = useState<string|null>(null)
  console.log("Deleting ID: ", deletingId)





  /* **** TO SCROLLED INTO BOTTOM OF THE SCREEN **** */

  const flatListRef = useRef<FlatList>(null);





  /* **** LOAD CURRENT USER ALL DATA FROM FIREBASE **** */
  
  useEffect(()=>{
    
    const fetchCurrentUser = async()=>{
      try{
        if (currentUserId) {
          const querySnapshot = await getDoc(doc(db, "users", currentUserId));
          const data = querySnapshot.data();
          console.log("Current user details: ", data)
          setCurrentUserInfo(data)
        } else {
          console.log("Current user ID is undefined");
        }
      }

      catch(error){
        console.log(error)
      }
    }

    fetchCurrentUser();
  },[])



  /* **** LOAD OTHER USER ALL DATA FROM FIREBASE **** */

  useEffect(()=>{    
    const fetchUserB = async ()=>{
      try{
        const userDoc = await getDoc(doc(db,"users",id as string))

        if(userDoc.exists()){
          const useBData :UserB = 
          {
            userid: userDoc.id,
            email: userDoc.data().email,
            displayName: userDoc.data().displayName,
            profilePic: userDoc.data().profilePic
          }
          setUserBinfo(useBData);
        }

        else{
          console.log("User B not found")
        }
        
      }
      catch(error){
        console.log(error)
      }
    }

    fetchUserB();
  },[])





  /* ****** SEND BUTTON CLICK - POST MESSAGE ****** */

  const generateChatId = (currentUser:string|undefined, selectedUser:string|undefined):string=>{
    return [currentUser,selectedUser].sort().join('_')    
  }

  const handleMessageSend = async ()=>{   

    try{

      /*Check chat Id Part
        1. Generate a chat ID
        2. Check in chats collection
      */
      const generatedChatId= generateChatId(currentUserId, userBinfo?.userid.toString())
      console.log("Generated Chat Id: ", generatedChatId)

      /*If no chat Id? 
        1.Create chat doc in chats collection
      */
      const existingChatDoc = await getDoc(doc(db, "chats", generatedChatId))

      //Create a New Chat Pair
      if (!existingChatDoc.exists()){
        await setDoc(doc(db,"chats",generatedChatId),{
          userA:currentUserId,
          userAdisplayName:currentUserInfo?.displayName,
          userAprofilePic:currentUserInfo?.profilePic,
          userB:userBinfo?.userid,
          userBdisplayName:userBinfo?.displayName,
          userBprofilePic:userBinfo?.profilePic,
          lastMessage:inputMessage,
          lastMessageTime: serverTimestamp(),
          unreadA:0,
          unreadB: 1,
          createdAt: serverTimestamp()
        })
      }      

      /*If there is chat id 
        1. Update existing Chat 
      */
      else{
        const existingData = existingChatDoc.data();

        await updateDoc(doc(db,"chats",generatedChatId.toString()),{
          lastMessage: inputMessage,
          lastMessageTime: serverTimestamp(),
          unreadA: existingData?.userA === currentUserId 
            ? 0 
            : (existingData?.unreadA || 0) + 1,
          unreadB: existingData?.userB === currentUserId 
            ? 0 
            : (existingData?.unreadB || 0) + 1,
        })

      }   
      

      //Send Message
      await addDoc(collection(db,"messages"),{
        chatId: generatedChatId,
        senderId: currentUserId,
        text: inputMessage,
        imageUrl: null,
        fileUrl: null,
        sentAt: serverTimestamp()
      });

      setInputMessage('')

      // After sennding message scroll down to the bottom of the chat
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
    catch(error){
      console.log(error)
    }
  }




  

    /* ****** GETS ALL MESSAGES OF CURRENT USER AND OTHER USER - GET MESSAGES ****** */

    const [messagesList, setMessagesList] = useState<Message[]>([])
    //console.log("messages list is: ", messagesList)
    
    useEffect(()=>{

      const fetchMessages = async()=>{

        const generatedChatId= generateChatId(currentUserId, userBinfo?.userid.toString())

        try{
          const q = await query(collection(db,"messages"), where("chatId", "==", generatedChatId), orderBy("sentAt","asc"))
          const messagesSnap = await getDocs(q);

          const messages = messagesSnap.docs.map((element)=>{
            return{
              messageId: element.id,
              chatId: element.data().chatId,
              senderId: element.data().senderId,
              text: element.data().text,
              imageUrl: element.data().imageUrl || null,
              fileUrl: element.data().fileUrl || null,
              sentAt:  element.data().sentAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || ''
            }
          })

          console.log("Messages List: ",messages)
          setMessagesList(messages);


        }
        catch(error){
          console.log(error)
        }
      }

      fetchMessages()

    },[currentUserId, userBinfo, inputMessage])


    

    
    
    /* ****** TO UPLOAD A FILE(IMAGE) ****** */

    const handleUploadFile = async ()=>{
      try{
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing:true,
          aspect:[4,4],
          quality:0.4,
        })
        console.log("image result is ", result);


        if (!result.canceled && currentUserId){
          const imageUri = result.assets && result.assets[0].uri;
          const response = await fetch(imageUri);
          const blob = await response.blob();

          const filename = `${Date.now()}_${currentUserId}.jpg`
          const storageRef = ref(storage, `chatImages/${filename}`)
          await uploadBytes(storageRef, blob)

          
          // Add message with image URL
          const downloadURL = await getDownloadURL(storageRef)
          const generatedChatId = generateChatId(currentUserId, userBinfo?.userid);

          await addDoc(collection(db,"messages"), {
            chatId: generatedChatId,
            senderId: currentUserId,
            text: '',
            imageUrl: downloadURL,
            fileUrl: null,
            sentAt: serverTimestamp(),
          })

          // Update the last message info in chats collection
          const existingChatDoc = await getDoc(doc(db, "chats", generatedChatId));
          const existingData = existingChatDoc.data();

          await updateDoc(doc(db,"chats",generatedChatId),{
            lastMessage: "📷 Image",
            lastMessageTime: serverTimestamp(),
            unreadA: existingData?.userA === currentUserId 
              ? 0 
              : (existingData?.unreadA || 0) + 1,
            unreadB: existingData?.userB === currentUserId 
              ? 0 
              : (existingData?.unreadB || 0) + 1,
          })
          
          // Update the Messages List State (to update the UI)
          setMessagesList((prev)=>[
            ...prev,
            {
              messageId: Date.now().toString(),  //This is something temporally add to the state. Message ID is automatilly generated when we add Image to firebase.
              chatId: generatedChatId,
              senderId: currentUserId,
              text: '',
              imageUrl: downloadURL,
              fileUrl: null,
              sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          ])

          // After sennding message scroll down to the bottom of the chat
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);

        } 

      }
      catch(error){
        console.log(error);
      }
    }



    /* ****** TO OPEN CAMERA AND UPLOAD IMAGE ****** */
    const handleOpenCamera = async()=>{
      try{
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if(permissionResult.granted === false){
          alert("Camera access is required to take photos")
          return;
        }

        const result = await ImagePicker.launchCameraAsync({
          allowsEditing:true,
          aspect:[4,4],
          quality:0.4
        })        
        console.log("camera image result is ", result);

        if(!result.canceled && currentUserId){
          const imageUri = result.assets[0].uri
          const response = await fetch(imageUri)
          const blob = await response.blob();

          const filename = `${Date.now()}_${currentUserId}.jpg`;
          const storageRef = ref(storage, `chatImages/${filename}`);
          await uploadBytes(storageRef, blob);

          

          // add the image to the "messages" collection
          const downloadURL = await getDownloadURL(storageRef);
          const generatedChatId = generateChatId(currentUserId, userBinfo?.userid);

          await addDoc(collection(db, "messages"), {
            chatId: generatedChatId,
            senderId: currentUserId,
            text:'',
            imageUrl: downloadURL,
            fileUrl:null,
            sentAt: serverTimestamp(),
          })

          // Update the last message info in chats collection
          const existingChatDoc = await getDoc(doc(db, "chats", generatedChatId));
          const existingData = existingChatDoc.data();

          await updateDoc(doc(db,"chats",generatedChatId),{
            lastMessage: "📷 Image",
            lastMessageTime: serverTimestamp(),
            unreadA: existingData?.userA === currentUserId 
              ? 0 
              : (existingData?.unreadA || 0) + 1,
            unreadB: existingData?.userB === currentUserId 
              ? 0 
              : (existingData?.unreadB || 0) + 1,
          })

          // Update the Messages List State (to update the UI)
          setMessagesList((prev)=>[
            ...prev,
            {
              messageId: Date.now().toString(),  //This is something temporally add to the state. Message ID is automatilly generated when we add Image to firebase.
              chatId: generatedChatId,
              senderId: currentUserId,
              text: '',
              imageUrl: downloadURL,
              fileUrl: null,
              sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          ])

          // After sennding message scroll down to the bottom of the chat
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);

        }

      }

      catch(error){
        console.log(error)
      }
    }



    /* ****** TO MAKE A CALL ****** */
    const handleAudioCall = async () => {
      const receiverId = userBinfo?.userid
      const receiverName = userBinfo?.displayName 
      const receiverPic = userBinfo?.profilePic

      const callerName = currentUserInfo.displayName
      const callerPic = currentUserInfo.profilePic 
    
      router.push({
        pathname: '/screens/call/AudioCallScreen',
        params: {
          channelName: CHANNEL_NAME.trim(),
          token: AGORA_TEMP_TOKEN,
          callerId: currentUserId,
          callerName: callerName,
          callerPic:callerPic,
          receiverId: receiverId,
          receiverName:receiverName,
          receiverPic:receiverPic
        },
      });
    
      if (receiverId) {
        await setDoc(doc(db, 'calls', receiverId), {
          callerId: currentUserId,
          receiverId: receiverId,
          channelName: CHANNEL_NAME.trim(),
          token: AGORA_TEMP_TOKEN,
          isActive: true,
          createdAt: serverTimestamp(),
          callerName: callerName,
          callerPic: callerPic,
          receiverName: receiverName,
          receiverPic: receiverPic,
        });
        
    };
    };  


    /* ****** TO DELETE A MESAGE ****** */
    const handleDeleteMessage = async (messageId: string) => {
      try {
        await updateDoc(doc(db, "messages", messageId), {
          text: "[This message was deleted]",
          imageUrl: null,
          fileUrl: null,
        });

        //relaod the page to see the changes
        const generatedChatId = generateChatId(currentUserId, userBinfo?.userid);
        const q = await query(collection(db,"messages"), where("chatId", "==", generatedChatId), orderBy("sentAt","asc"))
        const messagesSnap = await getDocs(q);
        const messages = messagesSnap.docs.map((element)=>{
          return{
            messageId: element.id,
            chatId: element.data().chatId,
            senderId: element.data().senderId,
            text: element.data().text,
            imageUrl: element.data().imageUrl || null,
            fileUrl: element.data().fileUrl || null,
            sentAt:  element.data().sentAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || ''
          }
        })
        setMessagesList(messages);
        console.log("Messages List after delete: ",messages)
        setDeletingId(null); // Reset deletingId after deletion
      } 
      
      catch (error) {
        console.error("Error deleting message: ", error);
      }
    };



    
    



  return (
    <KeyboardAvoidingView
      style={{ flex: 1, }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >

      <View style={{flex:1, flexDirection:'column',}}>

        {/* Chat Banner */}
        <View style={{backgroundColor: theme === 'light' ? 'white' : '#1e1e1e', flexDirection:'row', height: 70,}}>

          {/* Profile Pic Part */}
          <View style={{flex:2, backgroundColor: theme === 'light' ? 'white' : '#1e1e1e', top:5}}>
            <Image
              source={{ uri: userBinfo?.profilePic }}
              style={{width:50, height:50, borderRadius:50, marginLeft:20, marginBottom:5}}
            />
          </View>

          {/* UserB Name Part */}
          <View style={{flex:4.5, backgroundColor: theme === 'light' ? 'white' : '#1e1e1e', flexDirection:'column', justifyContent:'center', marginBottom:10, marginLeft:8}}>
            <Text style={{fontSize:15, fontWeight:'bold', color: theme === 'light' ? 'black' : 'white'}}>{userBinfo?.displayName}</Text>
          </View>

          {/*Call Icons Part */}
          <View style={{flex:3.5, backgroundColor: theme === 'light' ? 'white' : '#1e1e1e', flexDirection:'row', justifyContent:'space-evenly', alignItems:'center'}}>
            <TouchableOpacity>
            <Ionicons name="videocam-outline" size={28} color={theme === 'light' ? 'black' : 'white'} />
            </TouchableOpacity>
            <TouchableOpacity
             onPress={handleAudioCall}>
              <Ionicons name="call-outline" size={24} color={theme === 'light' ? 'black' : 'white'} />
            </TouchableOpacity>
          </View>   
        </View>


        {/* Chat Body */}
        <View style={{flex:7, backgroundColor:'#98FB98', flexDirection:'column'}}>
            
            <FlatList 
              ref={flatListRef}
              data={messagesList}
              //To scroll down to the bottom of the chat after sending a message / image (Added this into related functions: "handleUploadFile" and "handleMessageSend" functions)
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              onLayout={() => {
                flatListRef.current?.scrollToEnd({ animated: false });
              }}

              //To update the state to detect when user scrolling
              onScrollBeginDrag={() => setShowScrollToBottom(true)}
              onScrollEndDrag={() => {
                // Optional delay to hide button after scroll ends
                setTimeout(() => setShowScrollToBottom(false), 3000);
              }}
              scrollEventThrottle={16}

              style={{ backgroundColor: theme === 'light' ? '#f4f4f4' : '#1a1a1a' }}
              
              renderItem={({item})=> {
                const isSender = item.senderId === currentUserId;

                return (
                  <View style={{ flexDirection: 'row', justifyContent: isSender ? 'flex-end' : 'flex-start', paddingHorizontal: 10, marginVertical: 5 }}>
                    {/* If User is longPressed && if that is current user's message - Show Message  with Delete Button */}
                    {deletingId === item.messageId ? (
                      <View style={{ maxWidth: '75%', backgroundColor: isSender ? (theme === 'light' ? '#4A90E2' : '#2f80ed') : (theme === 'light' ? '#E5E5EA' : '#2b2b2b'), borderRadius: 20, padding: 10, borderBottomRightRadius: isSender ? 0 : 20, borderBottomLeftRadius: isSender ? 20 : 0 }}>
                        {/* Show Message within a View Component */}
                        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: isSender ? 'flex-end' : 'flex-start' }}>
                          {/* Text Message */}
                          <Text style={{ color: isSender ? 'white' : theme === 'light' ? 'black' : '#f0f0f0', fontSize: 16 }}>{item.text}</Text>
                          {/* Time */}
                          <Text style={{ color: isSender ? (theme === 'light' ? '#D0E6FF' : '#aacfff') : (theme === 'light' ? '#555' : '#aaa'), fontSize: 10, marginTop: 5, textAlign: 'right' }}>{item.sentAt}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5, gap: 10  }}>
                          {/* Cancel Message Button */}
                          <TouchableOpacity
                            style={{ marginTop: 5, backgroundColor: 'gray', padding: 5, borderRadius: 10}}
                            onPress={() => {
                              setDeletingId(null)
                            }}
                          >
                            <Text style={{ color: 'white', fontSize: 14 }}>{language==='en'?'Cancel':'Peruuta'}</Text>
                          </TouchableOpacity>

                          {/* Delete Message Button */}
                          <TouchableOpacity 
                            style={{ marginTop: 5, backgroundColor: 'red', padding: 5, borderRadius: 10 }}
                            onPress={() => {
                              // Handle delete message logic here
                              handleDeleteMessage(item.messageId)
                              setDeletingId(null)
                            }}
                          >
                            <Text style={{ color: 'white', fontSize: 14 }}>{language==='en'?'Delete':'Poista'}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) 
                    :
                    // If User is not editing - Show Message
                    (<TouchableOpacity 
                      style={{ maxWidth: '75%', backgroundColor: isSender ? (theme === 'light' ? '#4A90E2' : '#2f80ed') : (theme === 'light' ? '#E5E5EA' : '#2b2b2b'), borderRadius: 20, padding: 10, borderBottomRightRadius: isSender ? 0 : 20, borderBottomLeftRadius: isSender ? 20 : 0 }}
                      onLongPress={()=>{
                        if (isSender) {
                          console.log("Long Pressed (User's) Message ID: ", item.messageId);
                          setDeletingId(item.messageId);
                        }
                      } }
                      >
                      {/* Text Message */}
                      {item.text? 
                      (<Text style={{ color: isSender ? 'white' : theme === 'light' ? 'black' : '#f0f0f0', fontSize: 16 }}>{item.text}</Text>) : null}

                      {/* Image Message */}
                      {item.imageUrl ? 
                      (<Image 
                          source={{ uri: item.imageUrl }}
                          style={{ width: 180, height: 180, borderRadius: 10, marginTop: item.text ? 10 : 0 }}
                          resizeMode="cover"
                        />
                      ) : null}

                      {/* Time */}
                      <Text style={{ color: isSender ? (theme === 'light' ? '#D0E6FF' : '#aacfff') : (theme === 'light' ? '#555' : '#aaa'), fontSize: 10, marginTop: 5, textAlign: 'right' }}>{item.sentAt}</Text>
                    </TouchableOpacity>)
                    }
                  </View>
              )}}
            />
        </View>

        {/* Floating Scroll-to-Bottom Button - if "showScrollToBottom" ==true (triggers when FlatList in being scrolled) */}
        {
          showScrollToBottom && (
            <TouchableOpacity
              onPress={() => flatListRef.current?.scrollToEnd({ animated: true })}
              style={{position: 'absolute', bottom: 80, right: 20, backgroundColor: '#AAFF00', opacity:0.7, borderRadius: 25, padding: 12, elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4,
              }}>
              <AntDesign name="arrowdown" size={24} color="white" />
            </TouchableOpacity>
          )
        }     





        {/* Bottom Text Input */}
        <View style={{ flexDirection:'row', bottom:0, backgroundColor: theme === 'light' ? 'white' : '#1e1e1e', paddingVertical:10, paddingHorizontal: 10 }}>

          {/* Text Input */}
          <View style={{flex:8, backgroundColor: theme === 'light' ? 'white' : '#1e1e1e', flexDirection:'row', justifyContent:'center', alignItems:'center', paddingHorizontal:10, position:'relative'}}>
            <TextInput
              placeholder={language==='en'?'  Type a message':'  Kirjoita viesti'}
              placeholderTextColor={theme === 'light' ? 'gray' : '#aaa'}
              multiline={true}
              style={{borderWidth:1, borderColor: theme === 'light' ? '#ccc' : '#444', width:'100%',backgroundColor: theme === 'light' ? 'white' : '#2a2a2a',color: theme === 'light' ? 'black' : 'white', borderRadius:10, paddingRight:60, height:40}}
              value={inputMessage}
              onChangeText={setInputMessage}
            />
            {/* Attach Icons */}
            <View style={{position:'absolute', flexDirection:'row', right:20, gap:10}}>
              <TouchableOpacity
                onPress={handleOpenCamera}>
                <Entypo name="camera" size={20} color="gray" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleUploadFile}>
                <Feather name="paperclip" size={20} color="gray" />
              </TouchableOpacity>        
            </View>
              
          </View>        

          

          {/* Send Button */}
          <View style={{flex:2, backgroundColor: theme === 'light' ? 'white' : '#1e1e1e', justifyContent:'center', alignItems:'center'}}>
            <TouchableOpacity 
              style={{borderWidth:1, borderRadius:50, padding:5, backgroundColor: theme === 'light' ? '#AAFF00' : '#3a3a3a', borderColor: theme === 'light' ? '#AAFF00' : '#3a3a3a', justifyContent:'center', alignItems:'center'}}
              disabled={!inputMessage.trim()}
              onPress={handleMessageSend}            
              >
              <FontAwesome name="send" size={24} color="white" />
            </TouchableOpacity>          
          </View>
          
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default IndividualChatScreen;