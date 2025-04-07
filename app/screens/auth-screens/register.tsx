import { View, Text, TouchableOpacity, TextInput, ImageBackground, Image, Alert } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React, { useState } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import Toast from 'react-native-toast-message';

function RegisterScreen() {

    const router = useRouter();

    const [displayName, setDisplayName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [repeatPasswordError, setRepeatPasswordError] = useState('')

    const handleCheckPasswordWithRepaetPassword = (text: string) => {
        setRepeatPassword(text);
        const result = password !== text ? 'Password does not match' : 'Password matches';
        setRepeatPasswordError(result);
    };

    const handleRegister = async () => {
        if (repeatPasswordError === 'Password does not match') {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        
        if (!email || !password || !displayName) {
            Toast.show({
                type: 'error',
                text1: 'Error 🚫',
                text2: 'Please fill in all fields',
            });
            return;
        }
        
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
        
            console.log('Registered user:', user.uid);
        
            // Save user info to Firestore
            await setDoc(doc(db, 'users', user.uid), {
            id: user.uid,
            email: email,
            displayName: displayName,
            profilePic: '', // default empty, user can upload later
            status: "Hey I'm using Smart Chat",
            createdAt: new Date(),
            lastSeen: new Date(),
            });
        
            // Show success message
            Toast.show({
                type: 'success',
                text1: 'Registration Successful  🎉',
                text2: 'You can now log in!',
            });
            setTimeout(() => {
                router.push('/screens/auth-screens/login');
            }
            , 2000); // Redirect after 2 seconds
        } catch (error: any) {
            console.log('Registration Error:', error.message);
            Alert.alert('Error', error.message);
        }
    };
      
    
    return (
        <ImageBackground 
            source={require('../../../assets/auth-images/backgR.png')} 
            style={{ flex: 1 }}>

            <View style={{ flex: 1 }}>

                <View style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    
                    <TouchableOpacity 
                      style={{ flexDirection: 'row', backgroundColor: 'white', height: 55, width: 120, marginTop: 85, marginLeft: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 30 }}
                      onPress={()=>router.push('/screens/auth-screens/login')}
                      >
                        <Feather name="arrow-left" size={25} color="#1565C0" />
                        <Text style={{ fontSize: 23, color: '#1565C0', fontWeight: 500}}> Login </Text>
                    </TouchableOpacity>

                    <Text style={{ fontSize: 40, fontWeight: 'bold', marginTop: 90, marginLeft: 65 }}>Register</Text>

                    
                </View>

                <View style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 28, marginTop: 5, marginRight: 20 }}>It's easy to register!</Text>
                </View>

                <View style={{ flex: 0.6, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    <View style={{marginLeft: 40, marginTop: -15 }}>
                        {/* Set Display Name */}
                        <Text style={{ fontSize: 16 }}>Display Name</Text>
                        <View style={{ flexDirection: 'row', marginTop: 6, alignItems: 'center' }}>
                        <MaterialIcons name="email" size={22} color="lightblue" />
                        <TextInput 
                            style={{ borderWidth: 1.5, height: 32, width: 260, marginLeft: 12, borderRadius: 15, backgroundColor: 'white', paddingHorizontal: 10 }} 
                            value={displayName}
                            onChangeText={setDisplayName}
                        />
                        </View>

                        {/* Email */}
                        <Text style={{ fontSize: 16, marginTop: 12 }}>Email Address</Text>
                        <View style={{ flexDirection: 'row', marginTop: 6, alignItems: 'center' }}>
                        <MaterialIcons name="email" size={22} color="lightblue" />
                        <TextInput 
                            style={{ borderWidth: 1.5, height: 32, width: 260, marginLeft: 12, borderRadius: 15, backgroundColor: 'white', paddingHorizontal: 10 }}
                            value={email}
                            onChangeText={setEmail} 
                        />
                        </View>

                        {/* Password */}
                        <Text style={{ fontSize: 16, marginTop: 12 }}>Password</Text>
                        <View style={{ flexDirection: 'row', marginTop: 6, alignItems: 'center' }}>
                        <FontAwesome6 name="lock" size={22} color="lightblue" />
                        <TextInput 
                            style={{ borderWidth: 1.5, height: 32, width: 260, marginLeft: 14, borderRadius: 15, backgroundColor: 'white', paddingHorizontal: 10 }} 
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                        </View>

                        {/* Repeat Password */}
                        <Text style={{ fontSize: 16, marginTop: 12 }}>Repeat Password</Text>
                        <View style={{ flexDirection: 'row', marginTop: 6, alignItems: 'center' }}>
                        <FontAwesome6 name="lock" size={22} color="lightblue" />
                        <TextInput 
                            style={{ borderWidth: 1.5, height: 32, width: 260, marginLeft: 14, borderRadius: 15, backgroundColor: 'white', paddingHorizontal: 10 }} 
                            secureTextEntry 
                            value={repeatPassword}
                            onChangeText={handleCheckPasswordWithRepaetPassword}
                        />
                    </View>

                    <Text style={repeatPasswordError == 'Password does not match' ? { color: 'red' } : { color: 'green' }}>{repeatPasswordError}</Text>

                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 30, marginLeft: 0 }}>
                    
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

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                         <View style={{ flex: 1, height: 1, backgroundColor: 'gray', marginHorizontal: 10 }} />
                         <Text style={{ fontSize: 16, color: 'gray' }}>or</Text>
                         <View style={{ flex: 1, height: 1, backgroundColor: 'gray', marginHorizontal: 10 }} />
                        </View>

                        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'black', borderRadius: 25, paddingVertical: 10, paddingHorizontal: 20, marginTop: 5, backgroundColor: 'white'}}
                           onPress={() => console.log('Google Sign In')}>
                            <Image source={require('../../../assets/auth-images/Google.png')} 
                             style={{ width: 20, height: 20, marginRight: 10 }}/>
                            <Text style={{ fontSize: 16 }}>Continue with Google</Text>
                        </TouchableOpacity>
                </View>
        </View>

         </View>
        </ImageBackground>
    );
}

export default RegisterScreen;
