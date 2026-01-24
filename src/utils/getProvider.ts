import { Pexels } from '../endpoints/handler/Pexels.js'
import { Pixabay } from '../endpoints/handler/Pixabay.js'
import { Unsplash } from '../endpoints/handler/Unsplash.js'
import { type ProviderKeys } from '../types.js'

export const getProvider = (providerKey: string | undefined, providerKeys?: ProviderKeys) => {
  if (!providerKey) return null

  switch (providerKey.toLowerCase()) {
    case 'unsplash':
      return new Unsplash(() => providerKeys?.unsplash)
    case 'pexels':
      return new Pexels(() => providerKeys?.pexels)
    case 'pixabay':
      return new Pixabay(() => providerKeys?.pixabay)
    default:
      return null
  }
}
