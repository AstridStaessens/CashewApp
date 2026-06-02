import { View, StyleSheet, ScrollView, TextInput, Image, TouchableOpacity, Alert } from 'react-native'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import { useState } from 'react'
import AppText from '../components/AppText'
import AppButton from '../components/AppButton'
import CategoryBadge from '../components/CategoryBadge'
import { DEFAULT_CATEGORIES } from '../utils/categories'

const schema = Yup.object({
  amount: Yup.number()
    .typeError('Vul een bedrag in')
    .positive('Bedrag moet positief zijn')
    .max(99999)
    .required('Verplicht'),
  category: Yup.string().required('Kies een categorie'),
  description: Yup.string().max(100, 'Maximum 100 tekens'),
})

export default function AddExpenseScreen() {
  const [photoUri, setPhotoUri] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [locationLoading, setLocationLoading] = useState(false)

  const formik = useFormik({
    initialValues: { amount: '', category: '', description: '' },
    validationSchema: schema,
    onSubmit: (values, { resetForm }) => {
      Alert.alert(
        'Uitgave opgeslagen!',
        `€ ${values.amount} - ${values.category}`,
        [{ text: 'OK', onPress: () => {
          resetForm()
          setPhotoUri('')
          setLocation('')
        }}]
      )
    },
  })

  async function pickPhoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('We hebben toegang tot je galerij nodig.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.7,
    })
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri)
    }
  }

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('We hebben toegang tot je camera nodig.')
      return
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.7,
    })
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri)
    }
  }

  async function getLocation() {
    setLocationLoading(true)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('We hebben toegang tot je locatie nodig.')
        return
      }
      const coords = await Location.getCurrentPositionAsync({})
      const [place] = await Location.reverseGeocodeAsync(coords.coords)
      if (place) {
        setLocation(`${place.city ?? ''}, ${place.country ?? ''}`.trim().replace(/^,\s*/, ''))
      }
    } catch {
      Alert.alert('Locatie ophalen mislukt.')
    } finally {
      setLocationLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <AppText variant="title" style={styles.title}>Uitgave toevoegen</AppText>

      <AppText variant="label">Bedrag (€)</AppText>
      <TextInput
        style={styles.input}
        placeholder="0.00"
        keyboardType="decimal-pad"
        value={formik.values.amount}
        onChangeText={formik.handleChange('amount')}
        onBlur={formik.handleBlur('amount')}
      />
      {formik.touched.amount && formik.errors.amount && (
        <AppText variant="caption" style={styles.error}>{formik.errors.amount}</AppText>
      )}

      <AppText variant="label" style={styles.label}>Categorie</AppText>
      <View style={styles.categories}>
        {DEFAULT_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => formik.setFieldValue('category', cat.id)}
            style={[styles.categoryItem, formik.values.category === cat.id && { borderColor: cat.color, borderWidth: 2, borderRadius: 10 }]}
          >
            <CategoryBadge category={cat} size="large" />
          </TouchableOpacity>
        ))}
      </View>
      {formik.touched.category && formik.errors.category && (
        <AppText variant="caption" style={styles.error}>{formik.errors.category}</AppText>
      )}

      <AppText variant="label" style={styles.label}>Omschrijving (optioneel)</AppText>
      <TextInput
        style={styles.input}
        placeholder="Bv. Lunch Panos"
        value={formik.values.description}
        onChangeText={formik.handleChange('description')}
        onBlur={formik.handleBlur('description')}
      />

      <AppText variant="label" style={styles.label}>Locatie</AppText>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.locationInput]}
          placeholder="Locatie"
          value={location}
          onChangeText={setLocation}
        />
        <AppButton
          title={locationLoading ? '...' : '📍'}
          onPress={getLocation}
          disabled={locationLoading}
        />
      </View>

      <AppText variant="label" style={styles.label}>Bonnetje (optioneel)</AppText>
      <View style={styles.row}>
        <AppButton title="📷 Camera" onPress={takePhoto} variant="secondary" />
        <AppButton title="🖼 Galerij" onPress={pickPhoto} variant="secondary" />
      </View>
      {photoUri ? <Image source={{ uri: photoUri }} style={styles.photo} /> : null}

      <AppButton title="Opslaan" onPress={() => formik.handleSubmit()} loading={formik.isSubmitting} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { padding: 20 },
  title: { marginBottom: 20 },
  label: { marginTop: 12, marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  error: { color: '#e63946', marginTop: 2 },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryItem: { padding: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  locationInput: { flex: 1 },
  photo: { width: '100%', height: 200, borderRadius: 12, marginTop: 10 },
})
