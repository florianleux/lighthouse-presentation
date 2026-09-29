// Met une image en cache sans l'afficher, en basse priorité : elle ne doit pas
// passer devant ce que l'écran affiche déjà. Résout aussi en cas d'échec : une
// image décorative manquante ne bloque rien.
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image()
    img.setAttribute('fetchpriority', 'low')
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = src
  })
}
