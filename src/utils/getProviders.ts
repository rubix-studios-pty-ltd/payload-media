import { Pexels } from '../endpoints/handler/Pexels.js'
import { Pixabay } from '../endpoints/handler/Pixabay.js'
import { Unsplash } from '../endpoints/handler/Unsplash.js'
import { type ProviderKeys } from '../types.js'

export const getProviders = (providerKeys?: ProviderKeys) => {
  return [
    new Unsplash(() => providerKeys?.unsplash),
    new Pexels(() => providerKeys?.pexels),
    new Pixabay(() => providerKeys?.pixabay),
  ].filter((provider) => provider.isConfigured)
}
