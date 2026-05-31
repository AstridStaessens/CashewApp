import { View, Text, StyleSheet } from 'react-native'

export default function ExpenseDetailScreen() {
  return (
    <View style={styles.container}>
      <Text>Expense Detail</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})