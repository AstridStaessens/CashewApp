import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { useEffect, useState } from 'react'
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore'
import { Expense } from '../types'
import { auth, db } from '../../firebase'
import { DEFAULT_CATEGORIES } from '../utils/categories'
import { formatCurrency } from '../utils/formatCurrency'
import { getStartOfMonth, getEndOfMonth } from '../utils/formatDate'
import AppText from '../components/AppText'
import BudgetBar from '../components/BudgetBar'

const LIMITS: Record<string, number> = {
  wonen: 1000,
  boodschappen: 300,
  gezondheid: 100,
  transport: 150,
  entertainment: 80,
  vaste_kosten: 200,
}

export default function DashboardScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const uid = auth.currentUser?.uid
    if (!uid) return

    const q = query(
      collection(db, 'users', uid, 'expenses'),
      where('date', '>=', Timestamp.fromDate(getStartOfMonth())),
      where('date', '<', Timestamp.fromDate(getEndOfMonth()))
    )

    getDocs(q).then((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Expense[]
      setExpenses(data)
      setLoading(false)
    })
  }, [])

  const totalThisMonth = expenses.reduce((sum, e) => sum + e.amount, 0)

  const spentByCategory = DEFAULT_CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
    acc[cat.id] = expenses
      .filter((e) => e.category === cat.id)
      .reduce((sum, e) => sum + e.amount, 0)
    return acc
  }, {})

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>
  }

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
          limit={LIMITS[cat.id] ?? 0}
          currency="EUR"
        />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
