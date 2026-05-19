import { type PayloadRequest } from 'payload'

import { type Pexels } from '../endpoints/handler/Pexels.js'
import { type Pixabay } from '../endpoints/handler/Pixabay.js'
import { type Unsplash } from '../endpoints/handler/Unsplash.js'
import { getProvider } from './getProvider.js'

export const resolveProvider = (req: PayloadRequest): Unsplash | Pexels | Pixabay | null => {
  const providerKeys = req.payload?.config?.custom?.providerKeys
  return getProvider(req.routeParams?.provider as string | undefined, providerKeys)
}
