import { View, StyleSheet } from 'react-native'
import AppText from './AppText'
import { formatCurrency } from '../utils/formatCurrency'

interface BudgetBarProps {
  categoryName: string
  categoryIcon: string
  spent: number
  limit: number
  currency: string
}

export default function BudgetBar({ categoryName, categoryIcon, spent, limit, currency }: BudgetBarProps) {
  const percentage = limit > 0 ? Math.min(spent / limit, 1) : 0
  const barColor = percentage >= 1 ? '#e63946' : percentage >= 0.8 ? '#f4a261' : '#2ec4b6'

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="label">{categoryIcon} {categoryName}</AppText>
        <AppText variant="caption">{formatCurrency(spent, currency)} / {formatCurrency(limit, currency)}</AppText>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage * 100}%`, backgroundColor: barColor }]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  track: { height: 10, backgroundColor: '#e9ecef', borderRadius: 5, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 5 },
})
