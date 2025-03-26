import { useRouter } from 'expo-router';
import {Pressable,StyleSheet,Text,TouchableOpacity,} from 'react-native';
import Animated, {FadeIn,SlideInDown,SlideOutDown,} from 'react-native-reanimated';

export default function Modal() {
  const router = useRouter();

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeIn} 
      style={{
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#00000040',
      }}
    >
      {/* Dismiss when pressing outside */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => router.back()} // 
      />

      <Animated.View
        entering={SlideInDown}
        exiting={SlideOutDown} // slide down when dismissed
        style={{
          width: '90%',
          height: '60%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          borderRadius: 15,
          padding: 20,
        }}
      >
        <Text style={{ fontWeight: 'bold' }}>Edit Profile Modal</Text>

        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text>← Close</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}
