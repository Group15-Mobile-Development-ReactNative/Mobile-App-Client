import HeaderBanner from '@/components/HeaderBanner';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';

function ProfileScreen() {

  const router = useRouter();

  const currentUserData = 
  {
    displayName:'Shane Dinod',
    profilePic:'https://ntrepidcorp.com/wp-content/uploads/2016/06/team-1.jpg',
    email:'t3wiry00@students.oamk.fi',
    status:"Hey, I'm using smart Chat"
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
                  source={{ uri: currentUserData.profilePic }}
                  style={{width:150, height:150, borderRadius:100}}
                
                />
                <TouchableOpacity style={{position:'absolute', backgroundColor:'rgb(16, 197, 16)', borderRadius:100, padding:5}}>
                  <Entypo name="pencil" size={24} color="black" />
                </TouchableOpacity>
              </View> 
            </View>
            <Text style={{fontWeight:'bold', fontSize:20}}>{currentUserData.displayName}</Text>
          </View>

          {/* Text Inputs Part */}
          <View style={{flex:4, backgroundColor:'pink'}}>
            <View style={{flex:1, backgroundColor:'white', marginHorizontal:30}}>
              
              <View style={{flex:1, borderBottomColor:'gray', borderBottomWidth:2, flexDirection:'column', justifyContent:'center'}}>
                <Text style={{marginTop:10, color:'rgb(95, 94, 94)'}}>Display Name</Text>
                <View style={{flex:1, flexDirection:'row', gap:15, justifyContent:'flex-start', alignItems:'center'}}>
                  <FontAwesome5 name="user-circle" size={24} color="gray" />
                  <Text>{currentUserData.displayName}</Text>
                </View>
              </View>

              <View style={{flex:1, borderBottomColor:'gray', borderBottomWidth:2}}>
                <Text style={{marginTop:10, color:'rgb(95, 94, 94)'}}>Email</Text>
                  <View style={{flex:1, flexDirection:'row', gap:15, justifyContent:'flex-start', alignItems:'center'}}>
                    <FontAwesome5 name="user-circle" size={24} color="gray" />
                    <Text>{currentUserData.email}</Text>
                  </View>
                </View>
              <View style={{flex:1, borderBottomColor:'gray', borderBottomWidth:2}}>
                <Text style={{marginTop:10, color:'rgb(95, 94, 94)'}}>Status</Text>
                  <View style={{flex:1, flexDirection:'row', gap:15, justifyContent:'flex-start', alignItems:'center'}}>
                    <FontAwesome5 name="user-circle" size={24} color="gray" />
                    <Text>{currentUserData.status}</Text>
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
            <TouchableOpacity style={{backgroundColor:'rgb(255, 210, 210)', paddingVertical:12, paddingHorizontal:90, borderRadius:10}}>
              <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', gap:20}}>
                <AntDesign name="logout" size={20} color="red" />
                <Text style={{fontSize:18, color:'red'}}>Edit Profile</Text>
              </View>
            </TouchableOpacity>
          </View>



      </View>

      
      
    </View>
  );
}

export default ProfileScreen;