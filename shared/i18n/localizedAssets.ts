import type { Lang } from './types'

/**
 * Images contenant du texte : langue de l'image d'origine + variantes disponibles.
 * Une variante `nom.<lang>.webp` doit exister dans `public/` pour être listée ici
 * (liste explicite → aucun 404 si la variante n'est pas encore produite).
 */
interface LocalizedAsset {
  baseLang: Lang
  variants: Lang[]
}

export const LOCALIZED_ASSETS: Record<string, LocalizedAsset> = {
  // Texte FR peint dans l'image
  '/backgrounds/home-bottom-left.webp': { baseLang: 'fr', variants: ['en'] }, // EN restaurée de ae1d937
  '/backgrounds/home-bottom-left-local.webp': { baseLang: 'fr', variants: [] },
  '/backgrounds/poll-br.webp': { baseLang: 'fr', variants: ['en'] }, // EN restaurée de 564439b
  // Texte EN peint dans l'image
  '/backgrounds/intro-ter-br.webp': { baseLang: 'en', variants: [] },
  '/backgrounds/blackmarket-middle.webp': { baseLang: 'en', variants: [] },
}

/** Chemin de l'image dans la langue demandée, ou l'image d'origine si pas de variante */
export function localizedAssetPath(path: string, lang: Lang): string {
  const asset = LOCALIZED_ASSETS[path]
  if (!asset || asset.baseLang === lang || !asset.variants.includes(lang)) return path
  return path.replace(/(\.[a-z0-9]+)$/i, `.${lang}$1`)
}
