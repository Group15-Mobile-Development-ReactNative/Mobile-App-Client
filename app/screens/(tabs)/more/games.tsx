import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import ThemeContext from "@/context/ThemeContext";
import LanguageContext from "@/context/LanguageContext";
import { useContext } from "react";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function GamesScreen() {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);

  const [circlePosition, setCirclePosition] = useState({ x: 100, y: 100 });
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timer, setTimer] = useState(30);

  // Timer countdown logic
  useEffect(() => {
    let interval: any;
    if (gameActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setGameActive(false);
      Alert.alert(language === 'en' ? 'Time’s up!' : 'Aika loppui!', `Score: ${score}`);
    }

    return () => clearInterval(interval);
  }, [gameActive, timer]);

  const startGame = () => {
    setScore(0);
    setTimer(30);
    setGameActive(true);
    moveCircle();
  };

  const moveCircle = () => {
    const x = Math.random() * (screenWidth - 100);
    const y = Math.random() * (screenHeight - 250); // avoid overlap with header/bottom
    setCirclePosition({ x, y });
  };

  const handleTap = () => {
    if (!gameActive) return;
    setScore((prev) => prev + 1);
    moveCircle();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme === 'light' ? '#fff' : '#121212' }]}>
      <Text style={[styles.title, { color: theme === 'light' ? '#000' : '#fff' }]}>
        {language === 'en' ? 'Tap the Circle' : 'Napauta ympyrää'}
      </Text>
      <Text style={[styles.infoText, { color: theme === 'light' ? '#000' : '#fff' }]}>
        {language === 'en' ? `Score: ${score}` : `Pisteet: ${score}`} | ⏱ {timer}s
      </Text>

      {gameActive ? (
        <TouchableOpacity
          onPress={handleTap}
          style={[
            styles.circle,
            {
              top: circlePosition.y,
              left: circlePosition.x,
              backgroundColor: theme === 'light' ? '#4CAF50' : '#80e27e'
            },
          ]}
        />
      ) : (
        <TouchableOpacity
          onPress={startGame}
          style={[styles.startButton, { backgroundColor: theme === 'light' ? '#4CAF50' : '#66BB6A' }]}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
            {language === 'en' ? 'Start Game' : 'Aloita peli'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    position: 'relative',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 20,
  },
  circle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  startButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 40,
  },
});
