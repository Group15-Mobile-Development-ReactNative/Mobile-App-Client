import { View, Text, Image, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import { auth, db } from '@/firebase/firebaseConfig';
import { useEffect, useRef, useState } from 'react';
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';

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

  //Selected User
  const {id} = useLocalSearchParams();
  console.log("Clicked User is", id)

  //Current User
  const currentUserEmail = auth.currentUser?.email
  const currentUserId = auth.currentUser?.uid
  console.log("Current User email: ", currentUserEmail);
  console.log("Current User id: ", currentUserId);

  //State Variables
  const [userBinfo, setUserBinfo]= useState<UserB|null>(null)
  console.log('userBinfo ', userBinfo);

  const [inputMessage, setInputMessage] = useState<string>('')
  console.log(inputMessage)

  
  // To get current user data
  const [currentUserInfo, setCurrentUserInfo]= useState<any>(null)
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




  /* ****** Send Button Click ****** */

  const generateChatId = (currentUser:string|undefined, selectedUser:string|undefined):string=>{
    return [currentUser,selectedUser].sort().join('_')    
  }
  //const generatedChatId= generateChatId(currentUserId, id.toString())
  //console.log("Generated Chat Id: ", generatedChatId)

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
    }
    catch(error){
      console.log(error)
    }
  }

  /* NEED TO DELETE

  const userBinfo = {
      userB:'Shane Dinod',
      userBprofileImageUrl:'https://capecoraltech.edu/wp-content/uploads/2016/01/tutor-8-3.jpg',
    }*/
  
    /*
    const currentUserId = 'user001'; // Me (logged-in user)
    const otherUserId = 'user002';   // Shane (the other user)
    const chatId = 'chat001';        // Shared chat ID
    // */


    /* Messages Getting Part */   
    
    const [messagesList, setMessagesList] = useState<Message[]>([])
    
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

    /* NEED TO DELETE

    const messages = [
      {
        messageId: 'msg1',
        chatId: 'chat001',
        senderId: 'user001',
        text: 'Hey Shane, how are you?',
        imageUrl: null,
        fileUrl: null,
        sentAt: '09:00',
        type: 'text',
      },
      {
        messageId: 'msg2',
        chatId: 'chat001',
        senderId: 'user002',
        text: 'Hi! I’m good, thanks! What about you?',
        imageUrl: null,
        fileUrl: null,
        sentAt: '09:02',
        type: 'text',
      },
      {
        messageId: 'msg3',
        chatId: 'chat001',
        senderId: 'user001',
        text: 'Doing great! Wanna catch up later?',
        imageUrl: null,
        fileUrl: null,
        sentAt: '09:05',
        type: 'text',
      },
      {
        messageId: 'msg4',
        chatId: 'chat001',
        senderId: 'user002',
        text: 'Sure, let’s meet at 6?',
        imageUrl: null,
        fileUrl: null,
        sentAt: '09:06',
        type: 'text',
      },
    ];*/

    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
      if (messagesList.length > 0) {
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    }, [messagesList]);
    


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >

      <View style={{flex:1, flexDirection:'column'}}>

        {/* Chat Banner */}
        <View style={{backgroundColor:'white', flexDirection:'row', height: 70}}>

          {/* Profile Pic Part */}
          <View style={{flex:2, backgroundColor:'white'}}>
            <Image
              source={{ uri: userBinfo?.profilePic }}
              style={{width:50, height:50, borderRadius:50, marginLeft:20, marginBottom:5}}
            />
          </View>

          {/* UserB Name Part */}
          <View style={{flex:4.5, backgroundColor:'white', flexDirection:'column', justifyContent:'center', marginBottom:10, marginLeft:8}}>
            <Text style={{fontSize:15, fontWeight:'bold'}}>{userBinfo?.displayName}</Text>
          </View>

          {/*Call Icons Part */}
          <View style={{flex:3.5, backgroundColor:'white', flexDirection:'row', justifyContent:'space-evenly', alignItems:'center'}}>
            <TouchableOpacity>
            <Ionicons name="videocam-outline" size={28} color="black" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="call-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>   
        </View>


        {/* Chat Body */}
        <View style={{flex:7, backgroundColor:'#98FB98', flexDirection:'column'}}>
            <FlatList 
              ref={flatListRef}
              data={messagesList}
              renderItem={({item})=> {
                const isSender = item.senderId === currentUserId;

                return (
                  <View style={{ flexDirection: 'row', justifyContent: isSender ? 'flex-end' : 'flex-start', paddingHorizontal: 10, marginVertical: 5 }}>
                    <View style={{ maxWidth: '75%', backgroundColor: isSender ? '#4A90E2' : '#E5E5EA', borderRadius: 20, padding: 10, borderBottomRightRadius: isSender ? 0 : 20, borderBottomLeftRadius: isSender ? 20 : 0 }}>
                      <Text style={{ color: isSender ? 'white' : 'black', fontSize: 16 }}>{item.text}</Text>
                      <Text style={{ color: isSender ? '#D0E6FF' : '#555', fontSize: 10, marginTop: 5, textAlign: 'right' }}>{item.sentAt}</Text>
                    </View>
                  </View>
              )}}
            />
        </View>






        {/* Bottom Text Input */}
        <View style={{ flexDirection:'row', bottom:0, backgroundColor:'white', paddingVertical:10, paddingHorizontal: 10 }}>

          {/* Text Input */}
          <View style={{flex:8, backgroundColor:'white', flexDirection:'row', justifyContent:'center', alignItems:'center', paddingHorizontal:15, position:'relative'}}>
            <TextInput
              placeholder='Type a message'
              style={{borderWidth:1, borderColor:'black', width:'100%', borderRadius:10, paddingRight:60}}
              value={inputMessage}
              onChangeText={setInputMessage}
            />
            {/* Attach Icons */}
            <View style={{position:'absolute', flexDirection:'row', right:20, gap:10}}>
              <TouchableOpacity>
                <Entypo name="camera" size={20} color="gray" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Feather name="paperclip" size={20} color="gray" />
              </TouchableOpacity>        
            </View>
              
          </View>        

          

          {/* Send Button */}
          <View style={{flex:2, backgroundColor:'white', justifyContent:'center', alignItems:'center'}}>
            <TouchableOpacity 
              style={{borderWidth:1, borderRadius:50, padding:5, backgroundColor:'rgb(16, 197, 16)'}}
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