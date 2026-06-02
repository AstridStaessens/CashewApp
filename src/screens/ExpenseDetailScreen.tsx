import { View, StyleSheet } from 'react-native'
import AppText from '../components/AppText'

export default function ExpenseDetailScreen() {
  return (
    <View style={styles.center}>
      <AppText>Uitgave niet gevonden.</AppText>
    </View>
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
