import { CacheManager } from '../lib/cache.js'

const cache = new CacheManager()
const defaultExpiry = 24 * 60 * 60 * 1000

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

  const json = await response.json()
  cache.set(key, json, defaultExpiry)

  return json
}
