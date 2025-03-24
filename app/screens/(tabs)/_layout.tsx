// Tab layout 
import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

function TabsLayOut() {
  return (
    <Tabs>
        <Tabs.Screen name="chats/index" options={{
            title:'Chats',
            tabBarIcon: ({size, color})=>(<Ionicons name="chatbox-ellipses" size={size} color={color} />)
        }} />

        <Tabs.Screen name="profile/index" options={{
                    title:'Profile',
                    tabBarIcon: ({size, color})=>(<FontAwesome name="user" size={size} color={color} />)
        }} />

        <Tabs.Screen name="more/index" options={{
            title:'More',
            tabBarIcon: ({size, color})=>(<Ionicons name="apps" size={size} color={color} />)
        }} />        

        <Tabs.Screen name="settings/index" options={{
            title:'Settings',
            tabBarIcon: ({size, color})=>(<Ionicons name="settings" size={size} color={color} />)
        }} />
    </Tabs>
  );
}

export default TabsLayOut;