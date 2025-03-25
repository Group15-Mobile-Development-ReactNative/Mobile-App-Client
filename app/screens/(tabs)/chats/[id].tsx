import { View, Text, Image, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';

function IndividualChatScreen() {
  const {id} = useLocalSearchParams();

  const userBinfo = {
      userB:'Shane Dinod',
      userBprofileImageUrl:'https://capecoraltech.edu/wp-content/uploads/2016/01/tutor-8-3.jpg',
    }
  
    const currentUserId = 'user001'; // Me (logged-in user)
    const otherUserId = 'user002';   // Shane (the other user)
    const chatId = 'chat001';        // Shared chat ID

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
    ];


  return (
    <View style={{flex:1, flexDirection:'column'}}>

      {/* Chat Banner */}
      <View style={{flex:0.8, backgroundColor:'yellow', flexDirection:'row'}}>

        {/* Profile Pic Part */}
        <View style={{flex:2, backgroundColor:'gray'}}>
          <Image
            source={{ uri: userBinfo.userBprofileImageUrl }}
            style={{width:50, height:50, borderRadius:50, marginLeft:20, marginBottom:5}}
          />
        </View>

        {/* UserB Name Part */}
        <View style={{flex:4.5, backgroundColor:'yellow', flexDirection:'column', justifyContent:'center', marginBottom:10, marginLeft:8}}>
          <Text style={{fontSize:15, fontWeight:'bold'}}>{userBinfo.userB}</Text>
        </View>

        {/*Call Icons Part */}
        <View style={{flex:3.5, backgroundColor:'green', flexDirection:'row', justifyContent:'space-evenly', alignItems:'center'}}>
          <TouchableOpacity>
          <Ionicons name="videocam-outline" size={28} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>   
      </View>


      {/* Chat Body */}
      <View style={{flex:7, backgroundColor:'pink', flexDirection:'column'}}>
        <View>
          <FlatList 
            data={messages}
            renderItem={({item})=> {
              return (
                item.senderId==currentUserId?
                <View style={{flexDirection:'column', justifyContent:'center', alignItems:'flex-start', padding:15}}>
                  <Text>{item.text}</Text>
                  <Text>{item.sentAt}</Text>
                </View>
                :
                <View style={{backgroundColor:'blue', flexDirection:'column', justifyContent:'center', alignItems:'flex-end', padding:15}}>
                  <Text style={{color:'white'}}>{item.text}</Text>
                  <Text style={{color:'white', marginTop:5, fontSize:10}}>{item.sentAt}</Text>
                </View>
            )}}
          />
        </View>
      </View>






      {/* Bottom Text Input */}
      <View style={{flex:0.7, backgroundColor:'white', flexDirection:'row'}}>

        {/* Text Input */}
        <View style={{flex:8, backgroundColor:'white', flexDirection:'row', justifyContent:'center', alignItems:'center', paddingHorizontal:15, position:'relative'}}>
          <TextInput
            placeholder='Type a message'
            style={{borderWidth:1, borderColor:'black', width:'100%', borderRadius:10, paddingRight:60}}
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
        <View style={{flex:2, backgroundColor:'yellow', justifyContent:'center', alignItems:'center'}}>
          <TouchableOpacity style={{borderWidth:1, borderRadius:50, padding:5, backgroundColor:'rgb(16, 197, 16)'}}>
            <FontAwesome name="send" size={24} color="white" />
          </TouchableOpacity>          
        </View>
        
      </View>
    </View>
  );
}

export default IndividualChatScreen;