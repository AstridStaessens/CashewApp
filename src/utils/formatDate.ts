export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('nl-BE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function getStartOfMonth(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

export function getEndOfMonth(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() + 1, 1)
}
