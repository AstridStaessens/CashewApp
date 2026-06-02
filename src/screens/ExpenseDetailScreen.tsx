import { View, StyleSheet, Image, ScrollView } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ExpensesStackParamList, Expense } from '../types'
import { DEFAULT_CATEGORIES } from '../utils/categories'
import { formatCurrency } from '../utils/formatCurrency'
import { formatDate } from '../utils/formatDate'
import AppText from '../components/AppText'
import CategoryBadge from '../components/CategoryBadge'

type Props = NativeStackScreenProps<ExpensesStackParamList, 'ExpenseDetail'>

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

export default function ExpenseDetailScreen({ route }: Props) {
  const { expenseId } = route.params
  const expense = MOCK_EXPENSES.find((e) => e.id === expenseId)

  if (!expense) {
    return (
      <View style={styles.center}>
        <AppText>Uitgave niet gevonden.</AppText>
      </View>
    )
  }

  const category = DEFAULT_CATEGORIES.find((c) => c.id === expense.category) ?? DEFAULT_CATEGORIES[5]

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <CategoryBadge category={category} size="large" />
      <AppText variant="title" style={styles.amount}>
        -{formatCurrency(expense.amount, 'EUR')}
      </AppText>
      {expense.description ? (
        <AppText variant="body">{expense.description}</AppText>
      ) : null}
      <AppText variant="caption" style={styles.meta}>{formatDate(expense.date)}</AppText>
      {expense.location ? (
        <AppText variant="caption" style={styles.meta}>📍 {expense.location}</AppText>
      ) : null}
      {expense.receiptPhotoUri ? (
        <Image source={{ uri: expense.receiptPhotoUri }} style={styles.photo} />
      ) : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { padding: 24, alignItems: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  amount: { fontSize: 40, marginVertical: 16, color: '#6c63ff' },
  meta: { marginTop: 4, color: '#666' },
  photo: { width: '100%', height: 220, borderRadius: 12, marginTop: 20 },
})
