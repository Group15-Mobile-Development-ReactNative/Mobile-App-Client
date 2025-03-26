import HeaderBannerSearch from '@/components/HeaderBannerSearch';
import { View, Text, FlatList, Image } from 'react-native';

function SearchScreen() {

  const usersList = [
    {
      userid:1,
      email:'ryandilthusha@gmail.com',
      displaName:'Ryan Wick',
      createdAt: "2025-03-24",
      profilePic:'https://ntrepidcorp.com/wp-content/uploads/2016/06/team-1.jpg',
    },
    {
      userid:2,
      email:'shanedinod@gmail.com',
      displaName:'Shane Dinod',
      createdAt: "2025-03-25",
      profilePic:'https://capecoraltech.edu/wp-content/uploads/2016/01/tutor-8-3.jpg',
    },
    {
      userid:3,
      email:'madurazoyza@gmail.com',
      displaName:'Madura Zoyza',
      createdAt: "2025-03-26",
      profilePic:'https://ntrepidcorp.com/wp-content/uploads/2016/06/team-1.jpg',
    },
  ]

  return (
    <View>
      <HeaderBannerSearch />
      <Text style={{fontFamily: 'MadimiOne-Regular', color:'gray', marginTop:20, left:15, bottom:5}}>Chat with a friend</Text>

      <FlatList 
        data={usersList}
        renderItem={({item})=>(
          <View>
            <View style={{flexDirection:'row', marginVertical:5}}>
              <View style={{flex:2, backgroundColor:'yellow', justifyContent:'center', alignItems:'center'}}>
              <Image
                source={{ uri: item.profilePic}}
                style={{width:50, height:50, borderRadius:20}}
              />
              </View>
              <View style={{flex:8, backgroundColor:'pink', flexDirection:'column'}}>
                <Text style={{fontWeight:'bold', top:2}}>{item.displaName}</Text>
                <Text style={{color:'gray', fontSize:12, top:8}}>Added on {item.createdAt}</Text>
              </View>
            </View>
          </View>
        )}
      />

    </View>
  );
}

export default SearchScreen;