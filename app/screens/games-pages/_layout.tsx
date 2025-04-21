import { Stack } from "expo-router";

function GamesLayOut(){
    return(
        <Stack>
            <Stack.Screen name="TapTheCircleGame" options={{title:'Tap The Circle Game'}} />
            <Stack.Screen name="MemoryFlipGame" options={{title:'Memory Flip Game'}} />
        </Stack>
    )
}

export default GamesLayOut;