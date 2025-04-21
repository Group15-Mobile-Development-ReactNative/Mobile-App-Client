import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { useContext } from 'react';
import ThemeContext from '@/context/ThemeContext';

const { width } = Dimensions.get('window');
const CARD_SIZE = width / 4 - 20;

const icons = ['🍎', '🍕', '🐱', '⚽️', '🚗', '🎵'];
const generateCards = () =>
  [...icons, ...icons]
    .sort(() => 0.5 - Math.random())
    .map((icon, index) => ({ id: index, icon, flipped: false, matched: false }));

const MemoryFlipGame = () => {
  const { theme } = useContext(ThemeContext);
  const isLight = theme === 'light';

  const [cards, setCards] = useState(generateCards());
  const [selected, setSelected] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [showWin, setShowWin] = useState(false);

  const handleFlip = (index:any) => {
    const newCards = [...cards];
    const selectedCard = newCards[index];

    if (selectedCard.flipped || selectedCard.matched || selected.length === 2) return;

    selectedCard.flipped = true;
    const newSelected = [...selected, index];
    setCards(newCards);
    setSelected(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      if (newCards[first].icon === newCards[second].icon) {
        newCards[first].matched = true;
        newCards[second].matched = true;
        setMatches(prev => {
          const newMatches = prev + 1;
          if (newMatches === icons.length) {
            setTimeout(() => setShowWin(true), 500);
          }
          return newMatches;
        });
        setSelected([]);
      } else {
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards([...newCards]);
          setSelected([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setCards(generateCards());
    setMatches(0);
    setSelected([]);
    setShowWin(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: isLight ? '#fff' : '#121212' }]}>
      <Text style={[styles.title, { color: isLight ? '#000' : '#fff' }]}>Memory Flip Game</Text>
      <View style={styles.grid}>
        {cards.map((card, index) => (
          <TouchableOpacity
            key={card.id}
            style={[styles.card, { backgroundColor: isLight ? '#eee' : '#333' }]}
            onPress={() => handleFlip(index)}
            activeOpacity={0.8}
          >
            <Text style={[styles.icon, { color: isLight ? '#000' : '#fff' }]}> 
              {card.flipped || card.matched ? card.icon : '?'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={{ color: isLight ? '#000' : '#fff', marginTop: 20 }}>
        Matches: {matches} / {icons.length}
      </Text>
      <TouchableOpacity onPress={resetGame} style={styles.resetButton}>
        <Text style={styles.resetText}>Restart</Text>
      </TouchableOpacity>

      <Modal visible={showWin} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.winModal, { backgroundColor: isLight ? '#fff' : '#222' }]}>
            <Text style={[styles.winTitle, { color: isLight ? '#000' : '#fff' }]}>🎉 You Win!</Text>
            <Text style={[styles.winText, { color: isLight ? '#333' : '#ccc' }]}>Great job matching all the cards!</Text>
            <TouchableOpacity style={styles.modalButton} onPress={resetGame}>
              <Text style={styles.modalButtonText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  icon: {
    fontSize: 28,
  },
  resetButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#3A88F7',
    borderRadius: 10,
  },
  resetText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  winModal: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '80%',
  },
  winTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  winText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#3A88F7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MemoryFlipGame;
