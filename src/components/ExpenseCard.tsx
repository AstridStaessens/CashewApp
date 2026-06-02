import { View, StyleSheet, TouchableOpacity } from 'react-native'
import AppText from './AppText'
import CategoryBadge from './CategoryBadge'
import { Expense, Category } from '../types'
import { formatCurrency } from '../utils/formatCurrency'
import { formatDate } from '../utils/formatDate'
import { DEFAULT_CATEGORIES } from '../utils/categories'

interface ExpenseCardProps {
  expense: Expense
  onPress: () => void
  currency: string
}

export default function ExpenseCard({ expense, onPress, currency }: ExpenseCardProps) {
  const category: Category = DEFAULT_CATEGORIES.find((c) => c.id === expense.category) ?? DEFAULT_CATEGORIES[5]

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <CategoryBadge category={category} size="large" />
      <View style={styles.info}>
        <AppText variant="label">{expense.description || category.name}</AppText>
        <AppText variant="caption">
          {formatDate(expense.date)}{expense.location ? ` · ${expense.location}` : ''}
        </AppText>
      </View>
      <AppText variant="label" style={styles.amount}>
        -{formatCurrency(expense.amount, currency)}
      </AppText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  info: { flex: 1, marginHorizontal: 12 },
  amount: { color: '#6c63ff' },
})
