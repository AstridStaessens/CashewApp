import { Category } from '../types'

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'eten',          name: 'Eten',          icon: '🍔', color: '#FF6B6B', isCustom: false },
  { id: 'transport',     name: 'Transport',     icon: '🚗', color: '#4ECDC4', isCustom: false },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#45B7D1', isCustom: false },
  { id: 'gezondheid',    name: 'Gezondheid',    icon: '💊', color: '#96CEB4', isCustom: false },
  { id: 'wonen',         name: 'Wonen',         icon: '🏠', color: '#FFEAA7', isCustom: false },
  { id: 'overig',        name: 'Overig',        icon: '📦', color: '#DDA0DD', isCustom: false },
]
