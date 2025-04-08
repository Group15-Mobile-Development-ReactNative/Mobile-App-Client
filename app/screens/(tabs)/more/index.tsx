import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '@/firebase/firebaseConfig';
import ThemeContext from '@/context/ThemeContext';
import LanguageContext from '@/context/LanguageContext';

const screenWidth = Dimensions.get('window').width;

const predefinedColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

export default function StatsScreen() {
  interface ChartDataItem {
    name: string;
    population: number;
    color: string;
    legendFontColor: string;
    legendFontSize: number;
  }

  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);

  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const currentUser = auth.currentUser?.uid;
        if (!currentUser) return;

        const messagesSnapshot = await getDocs(collection(db, 'messages'));
        const messageCounts: Record<string, number> = {};

        messagesSnapshot.forEach((doc) => {
          const data = doc.data();
          if (!data.chatId || !data.senderId) return;

          if (data.senderId === currentUser) {
            if (!messageCounts[data.chatId]) {
              messageCounts[data.chatId] = 0;
            }
            messageCounts[data.chatId]++;
          }
        });

        const sortedChatIds = Object.keys(messageCounts)
          .sort((a, b) => messageCounts[b] - messageCounts[a])
          .slice(0, 5);

        const chatDocs = await getDocs(collection(db, 'chats'));
        const chartDataArray: ChartDataItem[] = [];

        let colorIndex = 0;
        chatDocs.forEach((doc) => {
          const data = doc.data();
          if (!sortedChatIds.includes(doc.id)) return;
          if (data.userA !== currentUser && data.userB !== currentUser) return;

          const name = data.userA === currentUser ? data.userBdisplayName : data.userAdisplayName;
          const color = predefinedColors[colorIndex % predefinedColors.length];
          colorIndex++;

          chartDataArray.push({
            name,
            population: messageCounts[doc.id],
            color,
            legendFontColor: theme === 'light' ? '#000' : '#fff',
            legendFontSize: 12
          });
        });

        setChartData(chartDataArray);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchChartData();
  }, [theme]);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme === 'light' ? '#FFFFFF' : '#121212' }]}>
      <Text style={[styles.title, { color: theme === 'light' ? '#000' : '#FFF' }]}> 
        {language === 'en' ? 'Top 5 Chats by Message Count' : '5 parasta keskustelua viestien mukaan'}
      </Text>

      {!loading && chartData.length > 0 ? (
        <View style={[styles.chartWrapper, { backgroundColor: theme === 'light' ? '#fff' : '#1e1e1e' }]}>
          <PieChart
            data={chartData}
            width={screenWidth - 0}
            height={250}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            chartConfig={{
              color: () => theme === 'light' ? '#000' : '#FFF',
              labelColor: () => theme === 'light' ? '#000' : '#FFF'
            }}
          />
          <View style={styles.labelList}>
            {chartData.map((item, index) => (
              <Text key={index} style={[styles.label, { color: theme === 'light' ? '#333' : '#ddd' }]}>• {item.name}: {item.population} {language === 'en' ? 'messages' : 'viestiä'}</Text>
            ))}
          </View>
        </View>
      ) : (
        <Text style={{ color: theme === 'light' ? 'black' : 'white' }}>{language === 'en' ? 'Loading...' : 'Ladataan...'}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 20,
    flexGrow: 1
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  chartWrapper: {
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 20,
    width: screenWidth - 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  labelList: {
    marginTop: 20,
    alignItems: 'flex-start',
    paddingHorizontal: 20
  },
  label: {
    fontSize: 14,
    marginBottom: 6
  }
});
