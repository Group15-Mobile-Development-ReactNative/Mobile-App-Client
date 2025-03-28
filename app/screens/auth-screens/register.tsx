import { View, Text, TouchableOpacity, TextInput, ImageBackground, Image, Alert, ScrollView } from "react-native"; // Import ScrollView
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React, { useEffect, useState } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";


function RegisterScreen() {

    const router = useRouter();

    const [displayName, setDisplayName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [repeatPasswordError, setRepeatPasswordError] = useState('')
    const [consoleError, setConsoleError] = useState('')


    useEffect(()=>{
        setConsoleError('')
    },[email,password])



    const handleCheckPasswordWithRepaetPassword = (text: string) => {
        setRepeatPassword(text); 
        const result = password !== text ? 'Password does not match' : 'Password matches';
        setRepeatPasswordError(result); 
    };

    const handleRegister = async () => {
        if (password !== repeatPassword) { 
            Alert.alert('Passwords do not match');
            return;
        }        

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            await setDoc(doc(db,"users",userCredential.user.uid), {
                id : userCredential.user.uid,
                displayName : displayName,
                email : userCredential.user.email,
                status :'',
                profilePic :'https://cdn.vectorstock.com/i/1000v/92/16/default-profile-picture-avatar-user-icon-vector-46389216.jpg',
                createdAt : serverTimestamp(),
                lastSeen: serverTimestamp() 

            })

            router.push('/screens/auth-screens/login')

        } catch (error: any) {
            console.error(error); 
            setConsoleError(error.toString() || 'An unknown error occurred'); 
        }
    }

    
    
    return (
        <ImageBackground 
            source={require('../../../assets/auth-images/backgR.png')} 
            style={{ flex: 1 }}>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}> {/* Wrap content in ScrollView */}
                <View style={{ flex: 1 }}>

                    <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                        
                        <TouchableOpacity 
                          style={{ flexDirection: 'row', backgroundColor: 'white', height: 55, width: 120, marginTop: 85, marginLeft: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 30 }}
                          onPress={()=>router.push('/screens/auth-screens/login')}
                          >
                            <Feather name="arrow-left" size={25} color="#1565C0" />
                            <Text style={{ fontSize: 23, color: '#1565C0', fontWeight: 500}}> Login </Text>
                        </TouchableOpacity>

                        <Text style={{ fontSize: 40, fontWeight: 'bold', marginTop: 90, marginLeft: 65 }}>Register</Text>

                        

                        
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                            <Text style={{ fontSize: 28, marginTop: 5, marginRight: 20 }}>It's easy to register!</Text>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        <View style={{marginLeft: 40, marginTop:110 }}>

                            {/* Set Display Name */}
                            <Text style={{ fontSize: 15 }}>Display Name</Text>
                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <MaterialIcons name="email" size={25} color="lightblue" />
                                    <TextInput 
                                        style={{ borderWidth: 2, height: 40, width: 250, marginLeft: 18, borderRadius: 20, backgroundColor: 'white', fontSize: 16 }} 
                                        value={displayName}
                                        onChangeText={setDisplayName}
                                    />
                                </View>

                            {/* Set Email Name */}    
                            <Text style={{ fontSize: 15, marginTop: 14}}>Email Address</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <MaterialIcons name="email" size={25} color="lightblue" />
                                <TextInput 
                                    style={{ borderWidth: 2, height: 40, width: 250, marginLeft: 18, borderRadius: 20, backgroundColor: 'white', fontSize: 16 }}
                                    value={email}
                                    onChangeText={setEmail} 
                                    />
                            </View>

                            {/* Set Password */}
                            <Text style={{ fontSize: 15, marginTop: 10 }}>Password</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <FontAwesome6 name="lock" size={25} color="lightblue" />
                                <TextInput 
                                    style={{ borderWidth: 2, height: 40, width: 250, marginLeft: 20, borderRadius: 20, backgroundColor: 'white', fontSize: 16 }} secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                    />
                            </View>

                            {/* Set Password Again */}
                            <Text style={{ fontSize: 15, marginTop: 10 }}>Repeat Password</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <FontAwesome6 name="lock" size={25} color="lightblue" />
                                <TextInput 
                                    style={{ borderWidth: 2, height: 40, width: 250, marginLeft: 20, borderRadius: 20, backgroundColor: 'white', fontSize: 16 }} 
                                    secureTextEntry 
                                    value={repeatPassword}
                                    onChangeText={handleCheckPasswordWithRepaetPassword} // Pass the text directly
                                    />
                            </View>
                            <Text style={repeatPasswordError == 'Password does not match' ? { color: 'red' } : { color: 'green' }}>{repeatPasswordError}</Text>
                            <Text style={{ color: 'red' }}>{consoleError}</Text> 

                        
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 50, marginLeft: 0 }}>
                        
                              <TouchableOpacity 
                                style= {{marginLeft: 260, marginTop: -35}}
                                onPress={handleRegister}                            
                                >
                               <LinearGradient colors={['#4EF0A1', '#42A1EC']}
                                style={{ width: 60, height: 60, borderRadius: 35, justifyContent: 'center', alignItems: 'center', elevation: 4}}>
                               <Feather name="arrow-right" size={40} color="white" />
                               </LinearGradient>
                             </TouchableOpacity>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 0 }}>
                                <View style={{ flex: 1, height: 1, backgroundColor: 'gray', marginHorizontal: 10 }} />
                                <Text style={{ fontSize: 16, color: 'gray' }}>or</Text>
                                <View style={{ flex: 1, height: 1, backgroundColor: 'gray', marginHorizontal: 10 }} />
                            </View>

                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'black', borderRadius: 25, paddingVertical: 10, paddingHorizontal: 20, marginTop: 20, marginBottom: 20, backgroundColor: 'white'}}
                               onPress={() => console.log('Google Sign In')}>
                                <Image source={require('../../../assets/auth-images/Google.png')} 
                                 style={{ width: 20, height: 20, marginRight: 10 }}/>
                                <Text style={{ fontSize: 16 }}>Continue with Google</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </ScrollView>
        </ImageBackground>
    );
}

export default RegisterScreen;
