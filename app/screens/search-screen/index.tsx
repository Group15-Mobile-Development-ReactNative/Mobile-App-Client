import HeaderBannerSearch from '@/components/HeaderBannerSearch';
import { auth, db } from '@/firebase/firebaseConfig';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import LanguageContext from "@/context/LanguageContext";
import { useContext } from "react";
import ThemeContext from '@/context/ThemeContext';

interface User {
  userid: string;
  email: string;
  displayName: string;
  createdAt: string | undefined;
  profilePic: string | undefined;
}

function SearchScreen() {

  const {language} = useContext(LanguageContext);
  const {theme} = useContext(ThemeContext);

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
            createdAt: element.data().createdAt?.toDate().toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }),
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


  return (
    <View style={{flex:1,flexDirection:'column' ,backgroundColor: theme ==='light'?'white':'#121212'}}>
      <HeaderBannerSearch searchValue={searchValue} setSearchValue={setSearchValue} />
      <Text style={{fontFamily: 'MadimiOne-Regular', color: theme === 'light' ? '#6e6e6e' : '#aaa', marginTop:20, marginBottom: 8, left:15, bottom:5}}>{language==='en'?'Search a friend':'Etsi ystävä'}</Text>

      <FlatList 
        data={usersList}
        renderItem={({item})=>(
          <View>
            <View style={{flexDirection:'row', marginVertical:5,}}>
              <TouchableOpacity 
                style={{flex:1, flexDirection:'row', paddingVertical: 5}}
                onPress={()=>router.push(`/screens/(tabs)/chats/${item.userid}`)}
              
              >
                <View style={{flex:2,backgroundColor: theme ==='light'?'#FFFFFF':'#121212', justifyContent:'center', alignItems:'center'}}>
                <Image
                  source={{ uri: item.profilePic}}
                  style={{width:50, height:50, borderRadius:25}}
                />
                </View>
                <View style={{flex:8, backgroundColor: theme ==='light'?'#FFFFFF':'#121212', flexDirection:'column',}}>
                  <Text style={{fontWeight:'bold', top:2, color: theme === 'light' ? '#1C1C1E' : '#F2F2F2'}}>{item.displayName}</Text>
                  <Text style={{color: theme === 'light' ? '#6e6e6e' : '#aaa', fontSize:12, top:8}}>{language==='en'?'Added on':'Lisätty'} {item.createdAt}</Text>
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