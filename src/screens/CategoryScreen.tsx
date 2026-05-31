import { View, Text, StyleSheet } from 'react-native'

export default function CategoryScreen() {
  return (
    <View style={styles.container}>
      <Text>Categories</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})