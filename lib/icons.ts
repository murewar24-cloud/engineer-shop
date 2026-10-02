export function categoryIcon(slug?: string) {
  const icons: Record<string, string> = {
    'measuring-tools': '📏',
    'hand-tools': '🔧',
    'electronics': '🔌',
    'safety-gear': '🦺',
    'drawing-tools': '📐',
  }
  return icons[slug ?? ''] ?? '🛠️'
}
