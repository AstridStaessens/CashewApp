import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useDispatch, useSelector } from 'react-redux'
import { signOut } from 'firebase/auth'
import { ProfileStackParamList } from '../types'
import { auth } from '../../firebase'
import { RootState, AppDispatch } from '../store'
import { setLimit } from '../store/budgetSlice'
import { setCurrency } from '../store/settingsSlice'
import { DEFAULT_CATEGORIES } from '../utils/categories'
import AppText from '../components/AppText'
import AppButton from '../components/AppButton'
import AvatarButton from '../components/AvatarButton'

type Nav = NativeStackNavigationProp<ProfileStackParamList, 'ProfileMain'>

const CURRENCIES = ['EUR', 'USD', 'GBP'] as const

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>()
  const dispatch = useDispatch<AppDispatch>()
  const limits = useSelector((state: RootState) => state.budget.limits)
  const currency = useSelector((state: RootState) => state.settings.currency)

  function handleSetLimit(categoryId: string, value: string) {
    const amount = parseFloat(value)
    if (!isNaN(amount) && amount >= 0) {
      dispatch(setLimit({ categoryId, amount }))
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View>
            <AppText variant="title">Profiel</AppText>
            <AppText variant="caption" style={styles.sub}>{auth.currentUser?.email}</AppText>
          </View>
          <AvatarButton />
        </View>

        <AppText variant="label" style={styles.section}>Valuta</AppText>
        <View style={styles.row}>
          {CURRENCIES.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.currencyBtn, currency === c && styles.currencyActive]}
              onPress={() => dispatch(setCurrency(c))}
            >
              <AppText variant="caption" style={currency === c ? styles.currencyTextActive : {}}>
                {c}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        <AppText variant="label" style={styles.section}>Budgetlimieten per maand</AppText>
        {DEFAULT_CATEGORIES.map((cat) => (
          <View key={cat.id} style={styles.limitRow}>
            <AppText variant="body" style={styles.limitLabel}>{cat.icon} {cat.name}</AppText>
            <TextInput
              style={styles.limitInput}
              keyboardType="decimal-pad"
              defaultValue={String(limits[cat.id] ?? 0)}
              onEndEditing={(e) => handleSetLimit(cat.id, e.nativeEvent.text)}
            />
          </View>
        ))}

        <AppButton
          title="Beheer categorieën"
          onPress={() => navigation.navigate('Categories')}
          variant="secondary"
        />
        <AppButton
          title="Uitloggen"
          onPress={() => signOut(auth)}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { padding: 20, paddingBottom: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sub: { marginBottom: 16 },
  section: { marginTop: 24, marginBottom: 12 },
  row: { flexDirection: 'row', gap: 8 },
  currencyBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6c63ff',
  },
  currencyActive: { backgroundColor: '#6c63ff' },
  currencyTextActive: { color: '#fff' },
  limitRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  limitLabel: { flex: 1 },
  limitInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    width: 90,
    textAlign: 'right',
    fontFamily: 'Poppins_400Regular',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
})
