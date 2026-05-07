import { Pexels } from '../endpoints/handler/pexels.js'
import { Pixabay } from '../endpoints/handler/pixabay.js'
import { Unsplash } from '../endpoints/handler/unsplash.js'
import { type ProviderKeys } from '../types.js'

export function getProviders(providerKey?: ProviderKeys): Array<Pexels | Unsplash | Pixabay> {
  return [
    new Unsplash(() => providerKey?.unsplash),
    new Pexels(() => providerKey?.pexels),
    new Pixabay(() => providerKey?.pixabay),
  ].filter((p) => p.isConfigured)
}
