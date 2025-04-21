import { View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import HeaderBanner from '@/components/HeaderBanner';
import AntDesign from '@expo/vector-icons/AntDesign';
import { auth, db } from '@/firebase/firebaseConfig';
import { useCallback, useContext, useEffect, useState } from 'react';
import { collection, getDoc, getDocs, query, where, doc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import ThemeContext from '@/context/ThemeContext';

function ChatsScreen() {    

    const {theme} = useContext(ThemeContext);
    
    const router = useRouter();

    //Current User
    const currentUserId = auth.currentUser?.uid
    console.log("Current User is: ", currentUserId);

    //State Variables
    const [chatsList, setChatList] = useState<{ 
        userB: string; 
        userBprofileImageUrl: string; 
        lastMessage: string; 
        lastMessageTime: Date; 
        unreadB: number; 
        userBid: string; 
    }[]>([])

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



    // Load Chats
    useFocusEffect(  //This hook runs every time the screen is focused (even when navigating back)
    
        useCallback(()=>{
            
            const fetchChats = async()=>{
                try{
                    // Get chats where current user is userA
                    const q1 = query(collection(db,"chats"), where("userA", "==", currentUserId))
                    const snap1 = await getDocs(q1);

                    // Get chats where current user is userB
                    const q2 = query(collection(db,"chats"), where("userB", "==", currentUserId))
                    const snap2 = await getDocs(q2);

                    // snap1 : Map chatList 1 Data -> where user is userA
                    const chatList1 = snap1.docs.map((element)=>{
                        return{
                            userB: element.data().userBdisplayName, 
                            userBprofileImageUrl:element.data().userBprofilePic,
                            lastMessage: element.data().lastMessage,
                            lastMessageTime: element.data().lastMessageTime?.toDate() || new Date(),
                            unreadB: element.data().unreadA || 0,
                            userBid:element.data().userB
                        }
                    });

                    // snap2 : Map chatList 2 Data -> where user is userB
                    const chatList2 = snap2.docs.map((element)=>{
                        return{
                            userB: element.data().userAdisplayName, 
                            userBprofileImageUrl:element.data().userAprofilePic,
                            lastMessage: element.data().lastMessage,
                            lastMessageTime: element.data().lastMessageTime?.toDate() || new Date(),
                            unreadB: element.data().unreadB || 0,
                            userBid:element.data().userA
                        }
                    });

                    // Combine both chat lists
                    const allChats = [...chatList1, ...chatList2];
                    // 🔁 Sort chats by latest message time (descending)
                    allChats.sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
                    setChatList(allChats);
                    console.log("Chats List: ", allChats);                
                }

                catch(error){
                    console.log(error)
                }
            }

            fetchChats();


        },[])
    )



    /* ****** TO RECIEVE A CALL ****** */
    useEffect(() => {
        if (!currentUserId) return;
      
        const q = query(
          collection(db, 'calls'),
          where('receiverId', '==', currentUserId),
          where('isActive', '==', true)
        );
      
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            router.push({
                pathname: '/screens/call/AudioCallScreen',
                params: {
                  channelName: data.channelName,
                  token: data.token,
                  callerId: data.callerId,
                  receiverId: data.receiverId,
                  callerName: data.callerName,
                  callerPic: data.callerPic,
                  receiverName: data.receiverName,
                  receiverPic: data.receiverPic,
                },
              });              
          });
        });
      
        return () => unsubscribe();
      }, [currentUserId]);
    

    /* ****** TO DELETE A CHAT ****** */
    const handleDeleteChat = async (otherUserId: string) => {
        Alert.alert(
            "Delete Chat",
            "Are you sure you want to delete this chat?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete", style: "destructive", onPress: async () => {
                        try {
                            const currentUserId = auth.currentUser?.uid;
                            if (!currentUserId) return;
                
                            const q = query(
                                collection(db, 'chats'),
                                where('userA', 'in', [currentUserId, otherUserId]),
                                where('userB', 'in', [currentUserId, otherUserId])
                            );
                            const snapshot = await getDocs(q);
                
                            snapshot.forEach(async (element) => {
                                await deleteDoc(doc(db, 'chats', element.id));
                            });
                
                            console.log("Chat deleted successfully");

                            // Refresh the chat list
                            const fetchChats = async()=>{
                                try{
                                    // Get chats where current user is userA
                                    const q1 = query(collection(db,"chats"), where("userA", "==", currentUserId))
                                    const snap1 = await getDocs(q1);
                
                                    // Get chats where current user is userB
                                    const q2 = query(collection(db,"chats"), where("userB", "==", currentUserId))
                                    const snap2 = await getDocs(q2);
                
                                    // snap1 : Map chatList 1 Data -> where user is userA
                                    const chatList1 = snap1.docs.map((element)=>{
                                        return{
                                            userB: element.data().userBdisplayName, 
                                            userBprofileImageUrl:element.data().userBprofilePic,
                                            lastMessage: element.data().lastMessage,
                                            lastMessageTime: element.data().lastMessageTime?.toDate() || new Date(),
                                            unreadB: element.data().unreadA || 0,
                                            userBid:element.data().userB
                                        }
                                    });
                
                                    // snap2 : Map chatList 2 Data -> where user is userB
                                    const chatList2 = snap2.docs.map((element)=>{
                                        return{
                                            userB: element.data().userAdisplayName, 
                                            userBprofileImageUrl:element.data().userAprofilePic,
                                            lastMessage: element.data().lastMessage,
                                            lastMessageTime: element.data().lastMessageTime?.toDate() || new Date(),
                                            unreadB: element.data().unreadB || 0,
                                            userBid:element.data().userA
                                        }
                                    });
                
                                    // Combine both chat lists
                                    const allChats = [...chatList1, ...chatList2];
                                    // 🔁 Sort chats by latest message time (descending)
                                    allChats.sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
                                    setChatList(allChats);
                                    console.log("Chats List: ", allChats);                
                                }
                
                                catch(error){
                                    console.log(error)
                                }
                            }
                
                            fetchChats();
                        

                        } 
                        
                        catch (error) {
                            console.log("Error deleting chat:", error);
                        }
                    }
                }
            ],
        );
      };
      

    return (
        <View style={{flex:1,flexDirection:'column' ,backgroundColor: theme ==='light'?'white':'#121212'}}>

          {/* Header Part */}
          <HeaderBanner />

          <TouchableOpacity 
            style={{position:'absolute', right:20, top:25,}}
            onPress={()=>router.push('/screens/search-screen')}
            >
            <AntDesign name="search1" size={24} color="white" />
          </TouchableOpacity>
          
          {/* Body Part */}
          {
            chatsList.length === 0 ? (
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Image
                        source={require('../../../../assets/images/no-messages.png')}
                        style={{width: 280, height: 280, opacity: 0.7}}
                    />
                </View>
            ) 
            
            : 
            
            <FlatList
                data={chatsList}
                keyExtractor={(item, index) => `${item.userBid}_${index}`}
                renderItem ={ ({item})=>(
                    <View style={{flex:1,flexDirection:'column' ,backgroundColor: theme ==='light'?'#FFFFFF':'#121212'}}>
                        <TouchableOpacity
                            style={{height:80, flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderBottomColor: theme === 'light' ? '#e0e0e0' : '#2a2a2a', borderBottomWidth:1, backgroundColor: theme === 'light' ? '#fff' : '#121212',}}
                            onPress={()=>router.push(`/screens/(tabs)/chats/${item.userBid}`)}
                            onLongPress={() => handleDeleteChat(item.userBid)}
                            >
                            <View style={{flex:1, flexDirection:'row', justifyContent:'flex-start', alignItems:'flex-start', backgroundColor: theme ==='light'?'#FFFFFF':'#121212'}}>
                                {/* Profile Image */}
                                <View style={{flex:1, flexDirection:'row', marginLeft:0, marginRight:10}}>
                                    <Image
                                        source={{ uri: item.userBprofileImageUrl }}
                                        style={{width:50, height:50, borderRadius:20}}
                                    />  
                                </View>
                                {/* User Name and Last Message */}
                                <View style={{flex:7, flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-start', backgroundColor: theme ==='light'?'#FFFFFF':'#121212', marginLeft:15}}>
                                    <Text style={{fontWeight:'bold', color: theme === 'light' ? '#1C1C1E' : '#F2F2F2'}}>{item.userB}</Text>
                                    <Text style={{fontSize:10, marginTop:10, color: theme === 'light' ? '#1C1C1E' : '#F2F2F2'}}>{item.lastMessage}</Text>
                                </View>
                                {/* Last Message Time and Unread Messages */}
                                <View style={{flex:1, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                                    <View style={{flex:1, flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-end', top:4, left:5}}>
                                        <Text style={{fontSize:11, color: theme === 'light' ? '#999' : '#ccc',}}>{item.lastMessageTime.toString().slice(16,21)}</Text>
                                    </View>
                                    
                                    <View style={item.unreadB!=0?{flex:1, flexDirection:'column', justifyContent:'center', alignItems:'center', backgroundColor:theme ==='light'?'#25D366':'#25D366', width:20, height:15, borderRadius:10, marginTop:10, marginBottom:5, bottom:2, left:5}: undefined}>
                                        <Text style={{fontSize:10, color:theme ==='light'?'white':'black'}}>{item.unreadB}</Text>
                                    </View>                                    
                                </View>                                     
                                
                            </View>
                        </TouchableOpacity>
                    </View>
                    )}
            />   
          }
                   

        </View>
    );
}

export default ChatsScreen;