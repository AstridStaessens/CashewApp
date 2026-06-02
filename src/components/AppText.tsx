import { Text, TextStyle, StyleSheet } from 'react-native'
import { ReactNode } from 'react'

interface AppTextProps {
  children: ReactNode
  variant?: 'body' | 'title' | 'label' | 'caption'
  style?: TextStyle
}

export default function AppText({ children, variant = 'body', style }: AppTextProps) {
  return <Text style={[styles[variant], style]}>{children}</Text>
}

const styles = StyleSheet.create({
  body: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#1a1a2e',
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 22,
    color: '#1a1a2e',
  },
  label: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#1a1a2e',
  },
  caption: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#666',
  },
})
