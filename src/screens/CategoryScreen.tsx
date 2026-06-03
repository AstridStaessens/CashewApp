import { View, StyleSheet, FlatList, TextInput, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'
import { Category } from '../types'
import { auth, db } from '../../firebase'
import { DEFAULT_CATEGORIES } from '../utils/categories'
import AppText from '../components/AppText'
import AppButton from '../components/AppButton'
import CategoryBadge from '../components/CategoryBadge'

const EMOJI_OPTIONS = [
  '🍕', '🍺', '☕',
  '🏋️', '⚽', '🎨',
  '✈️', '🏖️', '🧳',
  '🐶', '🐱', '🐠',
  '📱', '📺', '🎵',
  '🎁', '🎂',
  '💻', '🖥️',
  '📚', '🎓',
  '👗', '👟',
]

export default function CategoryScreen() {
  const [customCategories, setCustomCategories] = useState<Category[]>([])
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('🎵')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomCategories()
  }, [])

  async function fetchCustomCategories() {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const snap = await getDocs(collection(db, 'users', uid, 'categories'))
    setCustomCategories(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Category[])
    setLoading(false)
  }

  async function addCategory() {
    if (!newName.trim()) {
      Alert.alert('Vul een naam in')
      return
    }
    const uid = auth.currentUser?.uid
    if (!uid) return

    const newCat = {
      name: newName.trim(),
      icon: newIcon,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
      isCustom: true,
    }
    await addDoc(collection(db, 'users', uid, 'categories'), newCat)
    setNewName('')
    fetchCustomCategories()
  }

  async function removeCategory(id: string) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    await deleteDoc(doc(db, 'users', uid, 'categories', id))
    fetchCustomCategories()
  }

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        contentContainerStyle={styles.content}
        data={[...DEFAULT_CATEGORIES, ...customCategories]}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <AppText variant="title" style={styles.title}>Categorieën</AppText>

            <AppText variant="label" style={styles.section}>Nieuwe categorie</AppText>
            <TextInput
              style={styles.input}
              placeholder="Naam"
              value={newName}
              onChangeText={setNewName}
            />
            <View style={styles.emojiRow}>
              {EMOJI_OPTIONS.map((emoji) => (
                <AppButton
                  key={emoji}
                  title={emoji}
                  onPress={() => setNewIcon(emoji)}
                  variant={newIcon === emoji ? 'primary' : 'secondary'}
                />
              ))}
            </View>
            <AppButton title="Toevoegen" onPress={addCategory} />

            <AppText variant="label" style={styles.section}>Alle categorieën</AppText>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.catRow}>
            <CategoryBadge category={item} size="large" />
            {item.isCustom && (
              <AppButton
                title="Verwijder"
                onPress={() => removeCategory(item.id)}
                variant="secondary"
              />
            )}
          </View>
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { marginBottom: 16 },
  section: { marginTop: 16, marginBottom: 8 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8,
  },
  emojiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 8 },
  catRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
})
