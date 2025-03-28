import { View, Text, TouchableOpacity, TextInput, ImageBackground } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React, { useEffect, useState } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";


function LoginScreen() {

    const router = useRouter();

    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorResult, setErrorResult] = useState('')

    useEffect(()=>{
        setErrorResult('')
    }, [email, password])

    const handleLogin = async ()=>{
        console.log('buton clicked')
        try{
            await signInWithEmailAndPassword(auth,email,password)
            router.navigate('/screens/(tabs)/chats')

        }
        catch(error:any){
            setErrorResult(error.toString())
        }
        
    }

    
    return (
        <ImageBackground 
            source={require('../../../assets/auth-images/backgL.png')} 
            style={{ flex: 1 }}>

            <View style={{ flex: 1 }}>

                <View style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 35, fontWeight: 'bold', marginTop: 90, marginLeft: 40 }}>Login</Text>

                    <TouchableOpacity 
                        style={{ backgroundColor: 'white', height: 55, width: 120, marginTop: 85, marginLeft: 120, justifyContent: 'center', alignItems: 'center', borderRadius: 30 }}
                        onPress={()=>router.push('/screens/auth-screens/register')}
                    >
                        <Text style={{ fontSize: 23, color: '#1565C0', fontWeight: 500}}>Register</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: 25, marginTop: 10, marginLeft: 40 }}>Enter your email &{'\n'}password</Text>
                </View>

                <View style={{ flex: 0.6, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    <View style={{ marginTop: 50, marginLeft: 40 }}>

                        {/* Emial Input */}
                        <Text style={{ fontSize: 20 }}>Email Address</Text>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <MaterialIcons name="email" size={30} color="lightblue" />
                            <TextInput 
                                style={{ borderWidth: 2, height: 40, width: 250, marginLeft: 18, borderRadius: 20, backgroundColor: 'white' }} 
                                value={email}
                                onChangeText={setEmail} 
                                />
                        </View>

                        {/* Password Input */}
                        <Text style={{ fontSize: 20, marginTop: 10 }}>Password</Text>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <FontAwesome6 name="lock" size={30} color="lightblue" />
                            <TextInput 
                                style={{ borderWidth: 2, height: 40, width: 250, marginLeft: 20, borderRadius: 20, backgroundColor: 'white' }} secureTextEntry
                                value={password}
                                onChangeText={setPassword} 
                                />
                        </View>

                        <Text style={{color:'red'}}>{errorResult}</Text>

                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 50, marginLeft: 0 }}>
                    <TouchableOpacity
                        onPress={() => setRememberMe(!rememberMe)}
                        style={{ height: 24, width: 24, borderWidth: 2, borderColor: 'gray', alignItems: 'center', justifyContent: 'center', borderRadius: 4}}>
                        {rememberMe && <MaterialIcons name="check" size={20} color="blue" />}
                    </TouchableOpacity>
                    <Text style={{ marginLeft: 10, marginTop: 3, fontSize: 17 }}>Remember Me</Text>
                    
                    <TouchableOpacity 
                    style= {{marginLeft: 100, marginTop: -15}}
                    onPress={handleLogin}>
                      <LinearGradient colors={['#4EF0A1', '#42A1EC']}
                        style={{ width: 60, height: 60, borderRadius: 35, justifyContent: 'center', alignItems: 'center', elevation: 4}}>
                        <Feather name="arrow-right" size={40} color="white" />
                      </LinearGradient>
                    </TouchableOpacity>
                </View>
                    </View>
                </View>

            </View>
        </ImageBackground>
    );
}

export default LoginScreen;
