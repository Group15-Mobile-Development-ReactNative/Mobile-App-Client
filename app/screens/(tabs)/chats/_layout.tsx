import {Stack} from "expo-router";

function ChatsStackLayOut() { 

  return (
    <Stack>
      <Stack.Screen name="index" options={{title:'Chats', headerShown:false}} />
      <Stack.Screen name="[id]" options={{title:'Messages'}} />
    </Stack>
  );
}

export default ChatsStackLayOut;