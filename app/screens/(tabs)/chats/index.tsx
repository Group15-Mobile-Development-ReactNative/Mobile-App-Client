import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import HeaderBanner from '@/components/HeaderBanner';
import AntDesign from '@expo/vector-icons/AntDesign';
import { auth } from '@/firebase/firebaseConfig';

function ChatsScreen() {
    
    const router = useRouter();


    //sample chatList data
    const chatList = [ 
        {
            userB:'Ryan Wick', 
            userBprofileImageUrl:'https://ntrepidcorp.com/wp-content/uploads/2016/06/team-1.jpg',
            lastMessage: "See you later!",
            lastMessageTime: new Date("2025-03-24T09:05:00"),
            unreadB: 2,
            userBid:'user001'
        },
        {
            userB:'Shane Dinod', 
            userBprofileImageUrl:'https://capecoraltech.edu/wp-content/uploads/2016/01/tutor-8-3.jpg',
            lastMessage: "Hey Teemu!",
            lastMessageTime: new Date("2025-03-24T09:05:00"),
            unreadB: 10,
            userBid:'user002'
        },
        {
            userB:'Madura Dinod', 
            userBprofileImageUrl:'https://capecoraltech.edu/wp-content/uploads/2016/01/tutor-8-3.jpg',
            lastMessage: "Hey Teemu!",
            lastMessageTime: new Date("2025-03-24T09:05:00"),
            unreadB: 10,
            userBid:'user003'
        }
        ,
        {
            userB:'Madura Dinod', 
            userBprofileImageUrl:'https://capecoraltech.edu/wp-content/uploads/2016/01/tutor-8-3.jpg',
            lastMessage: "Hey Teemu!",
            lastMessageTime: new Date("2025-03-24T09:05:00"),
            unreadB: 10,
            userBid:'user004'
        },
        {
            userB:'Madura Dinod', 
            userBprofileImageUrl:'https://capecoraltech.edu/wp-content/uploads/2016/01/tutor-8-3.jpg',
            lastMessage: "Hey Teemu!",
            lastMessageTime: new Date("2025-03-24T09:05:00"),
            unreadB: 10,
            userBid:'user005'
        },
        {
            userB:'Madura Dinod', 
            userBprofileImageUrl:'https://capecoraltech.edu/wp-content/uploads/2016/01/tutor-8-3.jpg',
            lastMessage: "Hey Teemu!",
            lastMessageTime: new Date("2025-03-24T09:05:00"),
            unreadB: 10,
            userBid:'user006'
        },
        {
            userB:'Madura Dinod', 
            userBprofileImageUrl:'https://capecoraltech.edu/wp-content/uploads/2016/01/tutor-8-3.jpg',
            lastMessage: "Hey Teemu!",
            lastMessageTime: new Date("2025-03-24T09:05:00"),
            unreadB: 10,
            userBid:'user007'
        },
        {
            userB:'Madura Dinod', 
            userBprofileImageUrl:'https://capecoraltech.edu/wp-content/uploads/2016/01/tutor-8-3.jpg',
            lastMessage: "Hey Teemu!",
            lastMessageTime: new Date("2025-03-24T09:05:00"),
            unreadB: 10,
            userBid:'user008'
        },
        {
            userB:'Madura Dinod', 
            userBprofileImageUrl:'https://capecoraltech.edu/wp-content/uploads/2016/01/tutor-8-3.jpg',
            lastMessage: "Hey Teemu!",
            lastMessageTime: new Date("2025-03-24T09:05:00"),
            unreadB: 10,
            userBid:'user009'
        },
        {
            userB:'Madura Dinod', 
            userBprofileImageUrl:'https://capecoraltech.edu/wp-content/uploads/2016/01/tutor-8-3.jpg',
            lastMessage: "Hey Teemu!",
            lastMessageTime: new Date("2025-03-24T09:05:00"),
            unreadB: 10,
            userBid:'user010'
        }
    ]



    const userDetails = auth.currentUser?.uid;
    console.log("Logged user ID: ", userDetails)


    return (
        <View>

          {/* Header Part */}
          <HeaderBanner />

          <TouchableOpacity 
            style={{position:'absolute', right:20, top:25}}
            onPress={()=>router.push('/screens/search-screen')}
            >
            <AntDesign name="search1" size={24} color="white" />
          </TouchableOpacity>
          
          {/* Body Part */}
          <FlatList
              data={chatList}
              renderItem ={ ({item})=>(
                  <View style={{flex:1,flexDirection:'column' ,backgroundColor:'white'}}>
                      <TouchableOpacity
                          style={{height:80, paddingBottom:10, paddingTop:10, borderBottomColor:'gray', borderBottomWidth:1}}
                          onPress={()=>router.push(`/screens/(tabs)/chats/${item.userBid}`)}

                          >
                          <View style={{flex:1, flexDirection:'row', justifyContent:'flex-start', alignItems:'flex-start', backgroundColor:'white'}}>
                              <View style={{flex:1, flexDirection:'row', marginLeft:10}}>
                                  <Image
                                      source={{ uri: item.userBprofileImageUrl }}
                                      style={{width:50, height:50, borderRadius:20}}
                                  />  
                              </View>
                              <View style={{flex:7, flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-start', backgroundColor:'white', marginLeft:15}}>
                                  <Text style={{fontWeight:'bold'}}>{item.userB}</Text>
                                  <Text style={{fontSize:10, marginTop:10}}>{item.lastMessage}</Text>
                              </View>
                              <View style={{flex:1, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                                  <View style={{flex:1, flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-end'}}>
                                      <Text style={{fontSize:10}}>{item.lastMessageTime.toString().slice(16,21)}</Text>
                                  </View>
                                  
                                  <View style={{flex:1, flexDirection:'column', justifyContent:'center', alignItems:'center', backgroundColor:'green', width:15, height:15, borderRadius:5, marginTop:15}}>
                                      <Text style={{fontSize:10, color:'white'}}>{item.unreadB}</Text>
                                  </View>                                    
                              </View>                                     
                              
                          </View>
                      </TouchableOpacity>
                  </View>
              )
          }
          />            

        </View>
    );
}

export default ChatsScreen;