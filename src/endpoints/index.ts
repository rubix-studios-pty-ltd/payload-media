import { type Endpoint } from 'payload'

import { getMediaType } from '../utils/getMediaType.js'
import { getProviders } from '../utils/getProviders.js'
import { requireAccess } from '../utils/requireAccess.js'
import { resolveProvider } from '../utils/resolveProvider.js'
import { InvalidError } from './handler/Unsplash.js'

type Request = Parameters<Endpoint['handler']>[0]
type Configured = NonNullable<ReturnType<typeof resolveProvider>>

class InvalidRequestError extends Error {}

const getProvider = (req: Request) => {
  const provider = typeof req.routeParams?.provider === 'string' ? resolveProvider(req) : null

  if (!provider) {
    return Response.json({ data: null, error: 'Provider not supported.' }, { status: 404 })
  }

  if (!provider.isConfigured) {
    return Response.json({ data: null, error: 'Provider not configured.' }, { status: 500 })
  }

  return provider
}

const getText = (value: unknown, maxLength: number): string | undefined => {
  if (value === undefined) return undefined

  if (typeof value !== 'string' || value.length > maxLength) {
    throw new InvalidRequestError('Invalid request parameter.')
  }

  return value
}

const getPage = (value: unknown): number => {
  if (value === undefined) return 1

  if (typeof value !== 'number' && (typeof value !== 'string' || !/^[1-9]\d{0,2}$/.test(value))) {
    throw new InvalidRequestError('Invalid page.')
  }

  const page = Number(value)

  if (!Number.isInteger(page) || page < 1 || page > 100) {
    throw new InvalidRequestError('Invalid page.')
  }

  return page
}

const getFilters = (query: Request['query']) => {
  const media = getMediaType(query.media)

  if (query.media !== undefined && media === undefined) {
    throw new InvalidRequestError('Invalid media type.')
  }

  return {
    category: getText(query.category, 64),
    color: getText(query.color, 64),
    colors: getText(query.colors, 128),
    image_type: getText(query.image_type, 64),
    order: getText(query.order, 64),
    orientation: getText(query.orientation, 64),
    size: getText(query.size, 64),
    media,
  }
}

const withProvider = (
  operation: (provider: Configured, req: Request) => Promise<unknown>
): Endpoint['handler'] => {
  return async (req) => {
    const denied = await requireAccess(req)
    if (denied) return denied

    const provider = getProvider(req)
    if (provider instanceof Response) return provider

    try {
      const data = await operation(provider, req)

      return Response.json({ data, error: null })
    } catch (error) {
      if (error instanceof InvalidRequestError || error instanceof InvalidError) {
        return Response.json({ data: null, error: error.message }, { status: 400 })
      }

      if (error instanceof Error && error.name === 'TimeoutError') {
        return Response.json({ data: null, error: 'Provider request timed out.' }, { status: 504 })
      }

      return Response.json({ data: null, error: 'Provider request failed.' }, { status: 502 })
    }
  }
}

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
    handler: withProvider(async (provider, req) => provider.getFeatured(getFilters(req.query))),
  },
  {
    path: '/providers/:provider/search',
    method: 'get',
    handler: withProvider(async (provider, req) => {
      const query = getText(req.query.query, 200) ?? ''
      const page = getPage(req.query.page)
      const filters = getFilters(req.query)

      return provider.getSearch(query, page, filters)
    }),
  },
  {
    path: '/providers/:provider/track-download',
    method: 'get',
    handler: withProvider(async (provider, req) => {
      if (provider.key !== 'unsplash') return null

      const url = getText(req.query.url, 4096)
      if (!url) throw new InvalidRequestError('Invalid download URL.')

      return provider.trackDownload(url)
    }),
  },
]
