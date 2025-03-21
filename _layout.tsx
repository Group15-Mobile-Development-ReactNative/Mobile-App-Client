import { Tabs } from "expo-router";
import Entypo from '@expo/vector-icons/Entypo';
import Fontisto from '@expo/vector-icons/Fontisto';

function Layout(){
    return(
        <Tabs>
            <Tabs.Screen name='HomeScreen' options={{
                tabBarIcon:({size,color})=>(<Entypo name="home" size={24} color="black" />)
            }} />
            <Tabs.Screen name='SettingsScreen' options={{
                tabBarIcon:({size,color})=>(<Fontisto name="player-settings" size={24} color="black" />)
            }} />
        </Tabs>
    )
}

export default Layout;