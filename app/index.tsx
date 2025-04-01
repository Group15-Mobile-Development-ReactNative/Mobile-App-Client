import { Redirect } from "expo-router"
import Toast from 'react-native-toast-message';

function App(){
    return(
        <>
            <Redirect href='/screens/auth-screens/login' />
            <Toast />            
        </>
    )
}

export default App;