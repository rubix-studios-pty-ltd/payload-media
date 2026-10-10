import { type PayloadRequest } from 'payload'

import { getProvider } from './getProvider.js'

export const resolveProvider = (req: PayloadRequest) => {
  const providerKeys = req.payload?.config?.custom?.providerKeys

  return getProvider(req.routeParams?.provider as string | undefined, providerKeys)
}
