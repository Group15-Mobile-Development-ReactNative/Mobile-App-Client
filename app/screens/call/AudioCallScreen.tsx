import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  createAgoraRtcEngine,
  IRtcEngine,
  ChannelProfileType,
  ClientRoleType,
} from 'react-native-agora';
import { AGORA_APP_ID } from '@/constants/agoraConfig';
import { auth, db } from '@/firebase/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function AudioCallScreen() {
  const { channelName, token, callerId, receiverId } = useLocalSearchParams();
  const router = useRouter();

  const [caller, setCaller] = useState<{ name: string; pic: string }>({ name: '', pic: '' });
  const [receiver, setReceiver] = useState<{ name: string; pic: string }>({ name: '', pic: '' });
  const [joined, setJoined] = useState(false);
  const [remoteUserId, setRemoteUserId] = useState<number | null>(null);
  const [engine, setEngine] = useState<IRtcEngine | null>(null);
  const [callAccepted, setCallAccepted] = useState(false);

  const currentUid = auth.currentUser?.uid;
  const isCaller = callerId === currentUid;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const callerSnap = await getDoc(doc(db, 'users', callerId as string));
        const receiverSnap = await getDoc(doc(db, 'users', receiverId as string));

        if (callerSnap.exists()) {
          const data = callerSnap.data();
          setCaller({ name: data.displayName, pic: data.profilePic });
        }

        if (receiverSnap.exists()) {
          const data = receiverSnap.data();
          setReceiver({ name: data.displayName, pic: data.profilePic });
        }
      } catch (err) {
        console.error('Error fetching user data from Firestore:', err);
      }
    };

    fetchUserData();
  }, [callerId, receiverId]);

  const initAgora = async () => {
    try {
      if (Platform.OS === 'android') {
        const permissions = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);
        console.log('[Permission] Audio & Bluetooth:', permissions);
      }

      const rtcEngine = createAgoraRtcEngine();
      rtcEngine.initialize({
        appId: AGORA_APP_ID,
        channelProfile: ChannelProfileType.ChannelProfileCommunication,
      });

      rtcEngine.registerEventHandler({
        onJoinChannelSuccess: (connection, elapsed) => {
          console.log('[Agora] Joined channel:', connection);
          setJoined(true);
        },
        onUserJoined: (connection, uid, elapsed) => {
          console.log('[Agora] Remote user joined:', uid);
          setRemoteUserId(uid);
        },
        onUserOffline: (connection, uid, reason) => {
          console.log('[Agora] Remote user left:', uid, reason);
          setRemoteUserId(null);
          Alert.alert('Call Ended', 'The other user left the call.');
          router.back();
        },
        onError: (err) => {
          console.error('[Agora Error]', err);
        },
      });

      rtcEngine.enableAudio();
      rtcEngine.setClientRole(ClientRoleType.ClientRoleBroadcaster);

      rtcEngine.joinChannel(token as string, channelName as string, 0, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });

      setEngine(rtcEngine);
    } catch (error) {
      console.error('[Agora] Error:', error);
      Alert.alert('Call Failed', 'Could not join the call.');
      router.back();
    }
  };

  useEffect(() => {
    if (isCaller) {
      initAgora();
    }

    return () => {
      engine?.leaveChannel();
      engine?.release();
    };
  }, []);

  const handleEndCall = async () => {
    engine?.leaveChannel();
    engine?.release();

    try {
      const callDocRef = doc(db, 'calls', receiverId as string);
      await updateDoc(callDocRef, { isActive: false });
    } catch (err) {
      console.error('[Firestore] Failed to update call status:', err);
    }

    router.back();
  };

  const handleAnswer = () => {
    setCallAccepted(true);
    initAgora();
  };

  const handleReject = async () => {
    try {
      const callDocRef = doc(db, 'calls', receiverId as string);
      await updateDoc(callDocRef, { isActive: false });
    } catch (err) {
      console.error('[Firestore] Failed to update call status:', err);
    }
    router.back();
  };

  const imageToShow = isCaller ? receiver.pic : caller.pic;
  const nameToShow = isCaller ? receiver.name : caller.name;
  const title = isCaller ? `Calling ${nameToShow}` : `Incoming call from ${nameToShow}`;

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        {imageToShow ? (
          <Image source={{ uri: imageToShow }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={{ color: '#fff', fontSize: 20 }}>No Image</Text>
          </View>
        )}
        <Text style={styles.callerName}>{title}</Text>
        <Text style={styles.callStatus}>{joined ? 'Connected' : 'Ringing...'}</Text>
      </View>

      <View style={styles.buttonSection}>
        {!isCaller && !callAccepted ? (
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <TouchableOpacity style={styles.answerButton} onPress={handleAnswer}>
              <Text style={styles.endCallText}>Answer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.endCallButton} onPress={handleReject}>
              <Text style={styles.endCallText}>Reject</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
            <Text style={styles.endCallText}>End Call</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b141a',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 80,
  },
  topSection: {
    alignItems: 'center',
  },
  callerName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  callStatus: {
    color: '#ccc',
    fontSize: 16,
  },
  buttonSection: {
    marginBottom: 50,
  },
  endCallButton: {
    backgroundColor: 'red',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  answerButton: {
    backgroundColor: 'green',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  endCallText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#ccc',
  },
  avatarFallback: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
});
