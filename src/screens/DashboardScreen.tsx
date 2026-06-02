import { View, StyleSheet, ScrollView } from 'react-native'
import { Expense } from '../types'
import { DEFAULT_CATEGORIES } from '../utils/categories'
import { formatCurrency } from '../utils/formatCurrency'
import AppText from '../components/AppText'
import BudgetBar from '../components/BudgetBar'

const expenses: Expense[] = []
const limits: Record<string, number> = {}

export default function DashboardScreen() {
  const totalThisMonth = expenses.reduce((sum, e) => sum + e.amount, 0)

  const spentByCategory = DEFAULT_CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
    acc[cat.id] = expenses
      .filter((e) => e.category === cat.id)
      .reduce((sum, e) => sum + e.amount, 0)
    return acc
  }, {})

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <AppText variant="title">Dashboard</AppText>
      <AppText variant="caption">Deze maand</AppText>

      <View style={styles.totalCard}>
        <AppText variant="caption" style={styles.totalLabel}>Totaal uitgegeven</AppText>
        <AppText variant="title" style={styles.totalAmount}>
          {formatCurrency(totalThisMonth, 'EUR')}
        </AppText>
      </View>

      <AppText variant="label" style={styles.sectionTitle}>Budget per categorie</AppText>
      {DEFAULT_CATEGORIES.map((cat) => (
        <BudgetBar
          key={cat.id}
          categoryName={cat.name}
          categoryIcon={cat.icon}
          spent={spentByCategory[cat.id] ?? 0}
          limit={limits[cat.id] ?? 0}
          currency="EUR"
        />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { padding: 20 },
  totalCard: {
    backgroundColor: '#6c63ff',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
  },
  totalLabel: { color: '#fff' },
  totalAmount: { color: '#fff', fontSize: 32 },
  sectionTitle: { marginBottom: 12, marginTop: 8 },
})
