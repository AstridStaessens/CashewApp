import { FlatList, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ExpensesStackParamList, Expense } from '../types'
import ExpenseCard from '../components/ExpenseCard'
import AppText from '../components/AppText'

type Nav = NativeStackNavigationProp<ExpensesStackParamList, 'ExpensesList'>

const expenses: Expense[] = []

export default function ExpensesScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={expenses}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <AppText variant="title" style={styles.title}>Alle uitgaven</AppText>
      }
      ListEmptyComponent={
        <AppText variant="caption" style={styles.empty}>Nog geen uitgaven.</AppText>
      }
      renderItem={({ item }) => (
        <ExpenseCard
          expense={item}
          currency="EUR"
          onPress={() => navigation.navigate('ExpenseDetail', { expenseId: item.id })}
        />
      )}
    />
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { padding: 20 },
  title: { marginBottom: 16 },
  empty: { textAlign: 'center', marginTop: 40 },
})
