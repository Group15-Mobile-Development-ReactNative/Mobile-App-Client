import HeaderBannerSearch from '@/components/HeaderBannerSearch';
import { auth, db } from '@/firebase/firebaseConfig';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';

interface User {
  userid: string;
  email: string;
  displayName: string;
  createdAt: string | undefined;
  profilePic: string | undefined;
}

function SearchScreen() {

  const currentUser = auth.currentUser?.email;
  console.log('Logged user is:',currentUser)

  const router = useRouter();
  const [usersList, setUsersList] = useState<User[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  console.log(searchValue)
  console.log(usersList)
  
  useEffect(()=>{
    const fetchData = async ()=>{
      try{

        const querySnapshot = await getDocs(collection(db,"users"))

      
        const allUsers = querySnapshot.docs
        .filter((element)=> element.data().email !== currentUser)       
        
        .map((element)=>{
          return{
            userid : element.id,
            email: element.data().email,
            displayName: element.data().displayName,
            createdAt:element.data().createdAt?.toDate().toLocaleString(),
            profilePic: element.data().profilePic
          }          
        })

        console.log("all users:", allUsers);

        const filteredUsers =allUsers.filter((element)=> 
          element.email.toLowerCase().includes(searchValue.toLowerCase())|| element.displayName.toLowerCase().includes(searchValue.toLowerCase())) 

        console.log("filtered users:", filteredUsers);

        if(searchValue.trim()==''){
          setUsersList(allUsers)
        }
        else{
          setUsersList(filteredUsers)
        }

        
        
      }
      catch(error){
        console.log("Use effect error: ",error)
      }
    }
    fetchData();
    
  },[searchValue])

  

  /*const usersList = [
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
  ]*/

  return (
    <View>
      <HeaderBannerSearch searchValue={searchValue} setSearchValue={setSearchValue} />
      <Text style={{fontFamily: 'MadimiOne-Regular', color:'gray', marginTop:20, left:15, bottom:5}}>Find a friend</Text>

      <FlatList 
        data={usersList}
        renderItem={({item})=>(
          <View>
            <View style={{flexDirection:'row', marginVertical:5}}>
              <TouchableOpacity 
                style={{flex:1, flexDirection:'row'}}
                onPress={()=>router.push(`/screens/(tabs)/chats/${item.userid}`)}
              
              >
                <View style={{flex:2, backgroundColor:'white', justifyContent:'center', alignItems:'center'}}>
                <Image
                  source={{ uri: item.profilePic}}
                  style={{width:50, height:50, borderRadius:20}}
                />
                </View>
                <View style={{flex:8, backgroundColor:'white', flexDirection:'column'}}>
                  <Text style={{fontWeight:'bold', top:2}}>{item.displayName}</Text>
                  <Text style={{color:'gray', fontSize:12, top:8}}>Added on {item.createdAt}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

    </View>
  );
}

export default SearchScreen;