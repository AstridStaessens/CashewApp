import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import AppText from './AppText'

interface AppButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  loading?: boolean
}

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}: AppButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, styles[variant], (disabled || loading) && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <AppText variant="label" style={variant === 'primary' ? styles.primaryText : styles.secondaryText}>
          {title}
        </AppText>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 6,
  },
  primary: {
    backgroundColor: '#6c63ff',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#6c63ff',
  },
  disabled: {
    opacity: 0.5,
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#6c63ff',
  },
})
