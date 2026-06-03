import { StyleSheet, KeyboardAvoidingView, Platform, TextInput, ScrollView } from 'react-native'
import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import * as Location from 'expo-location'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../../../firebase'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AuthStackParamList } from '../../types'
import AppText from '../../components/AppText'
import AppButton from '../../components/AppButton'

const schema = Yup.object({
  name: Yup.string().min(2, 'Minimum 2 tekens').required('Verplicht'),
  email: Yup.string().email('Ongeldig e-mailadres').required('Verplicht'),
  password: Yup.string().min(6, 'Minimum 6 tekens').required('Verplicht'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Wachtwoorden komen niet overeen')
    .required('Verplicht'),
})

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>
}

export default function RegisterScreen({ navigation }: Props) {
  const [error, setError] = useState('')

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', confirmPassword: '' },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setError('')
        const { user } = await createUserWithEmailAndPassword(auth, values.email, values.password)
        await updateProfile(user, { displayName: values.name })
        await Location.requestForegroundPermissionsAsync()
      } catch {
        setError('Registratie mislukt. Probeer een ander e-mailadres.')
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <AppText variant="title" style={styles.title}>Registreren</AppText>

        <TextInput
          style={styles.input}
          placeholder="Naam"
          autoCapitalize="words"
          value={formik.values.name}
          onChangeText={formik.handleChange('name')}
          onBlur={formik.handleBlur('name')}
        />
        {formik.touched.name && formik.errors.name && (
          <AppText variant="caption" style={styles.error}>{formik.errors.name}</AppText>
        )}

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formik.values.email}
          onChangeText={formik.handleChange('email')}
          onBlur={formik.handleBlur('email')}
        />
        {formik.touched.email && formik.errors.email && (
          <AppText variant="caption" style={styles.error}>{formik.errors.email}</AppText>
        )}

        <TextInput
          style={styles.input}
          placeholder="Wachtwoord"
          secureTextEntry
          value={formik.values.password}
          onChangeText={formik.handleChange('password')}
          onBlur={formik.handleBlur('password')}
        />
        {formik.touched.password && formik.errors.password && (
          <AppText variant="caption" style={styles.error}>{formik.errors.password}</AppText>
        )}

        <TextInput
          style={styles.input}
          placeholder="Bevestig wachtwoord"
          secureTextEntry
          value={formik.values.confirmPassword}
          onChangeText={formik.handleChange('confirmPassword')}
          onBlur={formik.handleBlur('confirmPassword')}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <AppText variant="caption" style={styles.error}>{formik.errors.confirmPassword}</AppText>
        )}

        {error ? <AppText variant="caption" style={styles.error}>{error}</AppText> : null}

        <AppButton
          title="Registreren"
          onPress={() => formik.handleSubmit()}
          loading={formik.isSubmitting}
        />
        <AppButton
          title="Al een account? Login"
          onPress={() => navigation.navigate('Login')}
          variant="secondary"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 24, justifyContent: 'center', backgroundColor: '#f8f9fa', flexGrow: 1 },
  title: { marginBottom: 32, textAlign: 'center' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 4,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  error: { color: '#e63946', marginBottom: 8 },
})
