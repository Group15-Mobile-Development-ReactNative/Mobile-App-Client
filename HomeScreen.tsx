import { View, Text, StyleSheet } from "react-native";

function Home(){
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the Home Page</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#f0f0f0"
    },
    title: {
        fontSize: 24,
        fontWeight: "bold"
    }
})

export default Home;
