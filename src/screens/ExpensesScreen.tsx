import { FlatList, View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ExpensesStackParamList, Expense } from '../types'
import ExpenseCard from '../components/ExpenseCard'
import AppText from '../components/AppText'

type Nav = NativeStackNavigationProp<ExpensesStackParamList, 'ExpensesList'>

const MOCK_EXPENSES: Expense[] = [
  {
    id: '1',
    amount: 12.5,
    category: 'eten',
    description: 'Lunch Panos',
    date: new Date('2026-06-01'),
    location: 'Gent, België',
    receiptPhotoUri: '',
    createdAt: new Date('2026-06-01'),
  },
  {
    id: '2',
    amount: 45.0,
    category: 'transport',
    description: '',
    date: new Date('2026-06-02'),
    location: '',
    receiptPhotoUri: '',
    createdAt: new Date('2026-06-02'),
  },
  {
    id: '3',
    amount: 9.99,
    category: 'entertainment',
    description: 'Netflix',
    date: new Date('2026-06-02'),
    location: '',
    receiptPhotoUri: '',
    createdAt: new Date('2026-06-02'),
  },
]

export default function ExpensesScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={MOCK_EXPENSES}
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
