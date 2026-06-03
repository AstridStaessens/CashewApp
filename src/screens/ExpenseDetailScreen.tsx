import { View, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native'
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ExpensesStackParamList, Expense } from '../types'
import { auth, db } from '../../firebase'
import { DEFAULT_CATEGORIES } from '../utils/categories'
import { formatCurrency } from '../utils/formatCurrency'
import { formatDate } from '../utils/formatDate'
import AppText from '../components/AppText'
import CategoryBadge from '../components/CategoryBadge'

type Props = NativeStackScreenProps<ExpensesStackParamList, 'ExpenseDetail'>

export default function ExpenseDetailScreen({ route }: Props) {
  const [expense, setExpense] = useState<Expense | null>(null)
  const [loading, setLoading] = useState(true)
  const { expenseId } = route.params

  useEffect(() => {
    const uid = auth.currentUser?.uid
    if (!uid) return

    getDoc(doc(db, 'users', uid, 'expenses', expenseId)).then((snap) => {
      if (snap.exists()) {
        const d = snap.data()
        setExpense({ id: snap.id, ...d, date: d.date.toDate(), createdAt: d.createdAt.toDate() } as Expense)
      }
      setLoading(false)
    })
  }, [expenseId])

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>
  if (!expense) return <View style={styles.center}><AppText>Uitgave niet gevonden.</AppText></View>

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
