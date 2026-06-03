import { StyleSheet, KeyboardAvoidingView, Platform, TextInput } from 'react-native'
import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../firebase'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AuthStackParamList } from '../../types'
import AppText from '../../components/AppText'
import AppButton from '../../components/AppButton'

const schema = Yup.object({
  email: Yup.string().email('Ongeldig e-mailadres').required('Verplicht'),
  password: Yup.string().min(6, 'Minimum 6 tekens').required('Verplicht'),
})

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>
}

export default function LoginScreen({ navigation }: Props) {
  const [error, setError] = useState('')

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setError('')
        await signInWithEmailAndPassword(auth, values.email, values.password)
      } catch {
        setError('Fout e-mail of wachtwoord')
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppText variant="title" style={styles.title}>Inloggen</AppText>

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

      {error ? <AppText variant="caption" style={styles.error}>{error}</AppText> : null}

      <AppButton
        title="Inloggen"
        onPress={() => formik.handleSubmit()}
        loading={formik.isSubmitting}
      />
      <AppButton
        title="Nog geen account? Registreer"
        onPress={() => navigation.navigate('Register')}
        variant="secondary"
      />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#f8f9fa' },
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
