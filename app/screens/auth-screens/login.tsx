import { View, Text, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"

function LoginPage(){

    const router = useRouter();

    const handleRegister = ()=>{
        router.push('/screens/auth-screens/register');
    }

    const handleLogin = ()=>{
        router.push('/screens/(tabs)/chats');
    }

    return(
        <View style={{flex:1, flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            <Text style={{fontWeight:'bold', fontSize:25}}>
                This is Login Page
            </Text>

            <TouchableOpacity 
                style={{borderWidth:1, backgroundColor:'#90EE90', borderRadius:20}}
                onPress={handleRegister}>
                <Text>
                    Go to Register
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={{borderWidth:1, backgroundColor:'yellow', borderRadius:20}}
                onPress={handleLogin}>
                <Text>
                    Login
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default LoginPage;