import { FlatList, StyleSheet, ActivityIndicator, View } from 'react-native'
import { useState, useCallback } from 'react'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ExpensesStackParamList, Expense } from '../types'
import { auth, db } from '../../firebase'
import ExpenseCard from '../components/ExpenseCard'
import AppText from '../components/AppText'

type Nav = NativeStackNavigationProp<ExpensesStackParamList, 'ExpensesList'>

export default function ExpensesScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation<Nav>()

  useFocusEffect(
    useCallback(() => {
      const uid = auth.currentUser?.uid
      if (!uid) return

      setLoading(true)
      const q = query(collection(db, 'users', uid, 'expenses'), orderBy('date', 'desc'))

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
  )

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>
  }

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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { marginBottom: 16 },
  empty: { textAlign: 'center', marginTop: 40 },
})
