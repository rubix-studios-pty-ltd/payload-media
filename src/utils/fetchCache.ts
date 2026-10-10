import { CacheManager } from '../lib/cache.js'

const cache = new CacheManager()
const CACHE_TTL = 24 * 60 * 60 * 1000

export const fetchCache = async (queryPath: string) => {
  if (queryPath.includes('undefined')) {
    throw new Error('Invalid provider')
  }

  const key = `media-search:${queryPath}`
  const cached = cache.get(key)

  if (cached !== null) {
    return cached
  }

  const response = await fetch(queryPath)

  if (!response.ok) {
    throw await response.json()
  }

  const data = await response.json()

  cache.set(key, data, CACHE_TTL)

  return data
}
