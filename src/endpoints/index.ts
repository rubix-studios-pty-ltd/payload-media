import { type Endpoint } from 'payload'

import { getMediaType } from '../utils/getMediaType.js'
import { getProviders } from '../utils/getProviders.js'
import { requireAccess } from '../utils/requireAccess.js'
import { resolveProvider } from '../utils/resolveProvider.js'

export const providers: Endpoint[] = [
  {
    path: '/providers',
    method: 'get',
    handler: async (req) => {
      const denied = await requireAccess(req)
      if (denied) return denied

      const providerKeys = req.payload?.config?.custom?.providerKeys
      const providers = getProviders(providerKeys).map((p) => ({
        name: p.name,
        key: p.key,
      }))

      return Response.json({ data: providers, error: null })
    },
  },
  {
    path: '/providers/:provider/featured',
    method: 'get',
    handler: async (req) => {
      const denied = await requireAccess(req)
      if (denied) return denied

      const provider = resolveProvider(req)

      if (!provider) {
        return Response.json(
          {
            data: null,
            error: 'Provider not supported.',
          },
          { status: 404 }
        )
      }

      if (!provider.isConfigured) {
        return Response.json(
          {
            data: null,
            error: 'Provider not configured.',
          },
          { status: 500 }
        )
      }

      const data = await provider.getFeatured({
        category: req.query.category as string | undefined,
        color: req.query.color as string | undefined,
        colors: req.query.colors as string | undefined,
        image_type: req.query.image_type as string | undefined,
        order: req.query.order as string | undefined,
        orientation: req.query.orientation as string | undefined,
        size: req.query.size as string | undefined,
        media: getMediaType(req.query.media),
      })

      return Response.json({ data, error: null })
    },
  },
  {
    path: '/providers/:provider/search',
    method: 'get',
    handler: async (req) => {
      const denied = await requireAccess(req)
      if (denied) return denied

      const provider = resolveProvider(req)

      if (!provider) {
        return Response.json(
          {
            data: null,
            error: 'Provider not supported.',
          },
          { status: 404 }
        )
      }

      if (!provider.isConfigured) {
        return Response.json(
          {
            data: null,
            error: 'Provider not configured.',
          },
          { status: 500 }
        )
      }

      const data = await provider.getSearch(
        req.query.query as string,
        Number(req.query.page ?? 1),
        {
          category: req.query.category as string | undefined,
          color: req.query.color as string | undefined,
          colors: req.query.colors as string | undefined,
          image_type: req.query.image_type as string | undefined,
          order: req.query.order as string | undefined,
          orientation: req.query.orientation as string | undefined,
          size: req.query.size as string | undefined,
          media: getMediaType(req.query.media),
        }
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

      const provider = resolveProvider(req)

      if (!provider) {
        return Response.json(
          {
            data: null,
            error: 'Provider not supported.',
          },
          { status: 404 }
        )
      }

      if (!provider.isConfigured) {
        return Response.json(
          {
            data: null,
            error: 'Provider not configured.',
          },
          { status: 500 }
        )
      }

      const data = provider.trackDownload(req.query.url as string)

      return Response.json({ data, error: null })
    },
  },
]
