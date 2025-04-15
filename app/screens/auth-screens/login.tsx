import { View, Text, TouchableOpacity, TextInput, ImageBackground, Image } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React, { useEffect, useState } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from "expo-router";
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import Toast from 'react-native-toast-message';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";


function LoginScreen() {

    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleLogin = async ()=>{
        console.log('buton clicked')
        try{
            await signInWithEmailAndPassword(auth,email,password)
            Toast.show({
                type: 'success',
                text1: 'Success 😃',
                text2: 'Login successful',
            });
            setTimeout(() => {
                router.navigate('/screens/(tabs)/chats')
            }
            , 2000)

            

        }
        catch(error:any){
            Toast.show({
                type: 'error',
                text1: 'Error 😢',
                text2: error.message,
            });
        }
        
    }

    // Google Sign In Configuration
    useEffect(() => {
        GoogleSignin.configure({
          webClientId: '896888138808-40chd7cq6cokhjg05ug7s39auqrr61kp.apps.googleusercontent.com',
        });
      }, []);

    // Google Sign In Function
    const signInWithGoogle = async () => {
        try {
            console.log("🔄 Checking Google Play Services...");
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        
            // ✅ Force account picker to show
            await GoogleSignin.signOut();

            console.log("🔐 Initiating Google Sign-In...");
            const userInfo = await GoogleSignin.signIn();
            console.log("✅ Google User Info:", userInfo);
        
            const { idToken } = await GoogleSignin.getTokens();
            console.log("🔐 Token retrieved:", idToken);
        
            const credential = GoogleAuthProvider.credential(idToken);
            await signInWithCredential(auth, credential);
        
            console.log("✅ Firebase login successful");

            // 🔽 Save user to Firestore if not exists
            const currentUser = auth.currentUser;
            if (currentUser) {
            const userRef = doc(db, 'users', currentUser.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                id: currentUser.uid,
                displayName: currentUser.displayName,
                email: currentUser.email,
                profilePic: currentUser.photoURL,
                status: "Hey I'm using smart",
                createdAt: serverTimestamp(),
                lastSeen: serverTimestamp()
                });
                console.log("🆕 User saved to Firestore");
            } else {
                console.log("👤 User already exists");
            }
            }

            //Route to chats page
            setTimeout(() => {
                router.navigate('/screens/(tabs)/chats')
            }, 1000);          
      
        } catch (error: any) {
          console.log("Sign-In failed");
          console.log("Full Error Object:", error);
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            console.log("User cancelled sign-in");
          } else if (error.code === statusCodes.IN_PROGRESS) {
            console.log("Sign-in already in progress");
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            console.log("Play services not available");
          } else {
            console.log("Unexpected error:", error);
          }
        }
      };



    // Facebook Sign In Function
    const signInWithFacebook = async () => {
        try {
            // Facebook login logic here
            // You can use a library like react-native-fbsdk-next for Facebook login
            console.log("Facebook login not implemented yet.");
        }
        catch (error) {
            console.log("Facebook login failed:", error);
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

                <View style={{ flex: 0.6, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                    <View style={{ marginTop: 50, marginLeft: 40}}>

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

                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 50, marginLeft: 0 }}>
                    
                    
                            <TouchableOpacity 
                                style= {{marginLeft: 100, marginTop: -15, right: 0, position: 'absolute', justifyContent: 'center', alignItems: 'center'}}
                                activeOpacity={0.8}
                                onPress={handleLogin}>
                                <LinearGradient colors={['#4EF0A1', '#42A1EC']}
                                    style={{ width: 60, height: 60, borderRadius: 35, justifyContent: 'center', alignItems: 'center', elevation: 4}}>
                                    <Feather name="arrow-right" size={40} color="white" />
                                </LinearGradient>
                            </TouchableOpacity>                      

                        

                        </View>
                        
                        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'black', borderRadius: 25, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'white', bottom: -60, marginLeft: 40, marginRight: 40,}}
                            onPress={() => signInWithGoogle()}>
                            <Image source={require('../../../assets/auth-images/Google.png')} 
                                style={{ width: 20, height: 20, marginRight: 10 }}/>
                            <Text style={{ fontSize: 16 }}>Continue with Google</Text>
                        </TouchableOpacity>  
                        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'black', borderRadius: 25, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'white', bottom: -70, marginLeft: 40, marginRight: 40,}}
                                    onPress={() => signInWithFacebook()}>
                                    <Image source={require('../../../assets/auth-images/Facebook.png')} 
                                        style={{ width: 20, height: 20, marginRight: 10 }}/>
                                    <Text style={{ fontSize: 16 }}>Continue with Facebook</Text>
                        </TouchableOpacity>    
                                        
                    </View>
                    
                    
                    
                </View>
                 

            </View>
        </ImageBackground>
    );
}

export default LoginScreen;
