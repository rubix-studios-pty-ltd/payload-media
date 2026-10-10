import { type Endpoint } from 'payload'

import { getMediaType } from '../utils/getMediaType.js'
import { getProviders } from '../utils/getProviders.js'
import { requireAccess } from '../utils/requireAccess.js'
import { resolveProvider } from '../utils/resolveProvider.js'

type Request = Parameters<Endpoint['handler']>[0]

const getProvider = (req: Request) => {
  const provider = resolveProvider(req)

  if (!provider) {
    return Response.json({ data: null, error: 'Provider not supported.' }, { status: 404 })
  }

  if (!provider.isConfigured) {
    return Response.json({ data: null, error: 'Provider not configured.' }, { status: 500 })
  }

  return provider
}

const getFilters = (query: Request['query']) => ({
  category: query.category as string | undefined,
  color: query.color as string | undefined,
  colors: query.colors as string | undefined,
  image_type: query.image_type as string | undefined,
  order: query.order as string | undefined,
  orientation: query.orientation as string | undefined,
  size: query.size as string | undefined,
  media: getMediaType(query.media),
})

export const providers: Endpoint[] = [
  {
    path: '/providers',
    method: 'get',
    handler: async (req) => {
      const denied = await requireAccess(req)
      if (denied) return denied

      const providerKeys = req.payload?.config?.custom?.providerKeys
      const data = getProviders(providerKeys).map((provider) => ({
        name: provider.name,
        key: provider.key,
      }))

      return Response.json({ data, error: null })
    },
  },
  {
    path: '/providers/:provider/featured',
    method: 'get',
    handler: async (req) => {
      const denied = await requireAccess(req)
      if (denied) return denied

      const provider = getProvider(req)
      if (provider instanceof Response) return provider

      const data = await provider.getFeatured(getFilters(req.query))

      return Response.json({ data, error: null })
    },
  },
  {
    path: '/providers/:provider/search',
    method: 'get',
    handler: async (req) => {
      const denied = await requireAccess(req)
      if (denied) return denied

      const provider = getProvider(req)
      if (provider instanceof Response) return provider

      const data = await provider.getSearch(
        req.query.query as string,
        Number(req.query.page ?? 1),
        getFilters(req.query)
      )

      return Response.json({ data, error: null })
    },
  },
  {
    path: '/providers/:provider/track-download',
    method: 'get',
    handler: async (req) => {
      const denied = await requireAccess(req)
      if (denied) return denied

      const provider = getProvider(req)
      if (provider instanceof Response) return provider

      const data = provider.trackDownload(req.query.url as string)

      return Response.json({ data, error: null })
    },
  },
]
