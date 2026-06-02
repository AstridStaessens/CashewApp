import { View, Text, StyleSheet } from 'react-native'
import AppText from './AppText'
import { Category } from '../types'

interface CategoryBadgeProps {
  category: Category
  size?: 'small' | 'large'
}

export default function CategoryBadge({ category, size = 'small' }: CategoryBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: category.color + '33' }, size === 'large' && styles.large]}>
      <Text style={{ fontSize: size === 'large' ? 20 : 14 }}>{category.icon}</Text>
      {size === 'large' && (
        <AppText variant="caption" style={{ color: category.color, marginLeft: 4 }}>
          {category.name}
        </AppText>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 8,
    padding: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  large: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
})
