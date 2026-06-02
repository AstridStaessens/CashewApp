import { View, StyleSheet, FlatList, TextInput, Alert } from 'react-native'
import { useState } from 'react'
import { Category } from '../types'
import { DEFAULT_CATEGORIES } from '../utils/categories'
import AppText from '../components/AppText'
import AppButton from '../components/AppButton'
import CategoryBadge from '../components/CategoryBadge'

const EMOJI_OPTIONS = [
  // eten & drinken
  '🍕', '🍺', '☕',
  // sport & hobby's
  '🏋️', '⚽', '🎨',
  // reizen
  '✈️', '🏖️', '🧳',
  // huisdieren
  '🐶', '🐱', '🐠',
  // abonnementen
  '📱', '📺', '🎵',
  // cadeaus
  '🎁', '🎂',
  // technologie
  '💻', '🖥️',
  // opleiding
  '📚', '🎓',
  // kleding
  '👗', '👟',
]

export default function CategoryScreen() {
  const [customCategories, setCustomCategories] = useState<Category[]>([])
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('🎵')

  function addCategory() {
    if (!newName.trim()) {
      Alert.alert('Vul een naam in')
      return
    }
    const newCat: Category = {
      id: Math.random().toString(36).slice(2),
      name: newName.trim(),
      icon: newIcon,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
      isCustom: true,
    }
    setCustomCategories((prev) => [...prev, newCat])
    setNewName('')
  }

  function removeCategory(id: string) {
    setCustomCategories((prev) => prev.filter((cat) => cat.id !== id))
  }

  return (
    <FlatList
      style={styles.container}
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
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { padding: 20 },
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
