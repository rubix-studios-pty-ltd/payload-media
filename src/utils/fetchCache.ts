import { CacheManager } from '../lib/cache.js'

const cache = new CacheManager()
const defaultExpiry = 24 * 60 * 60 * 1000

export const fetchCache = async (queryPath: string) => {
  const key = `image-search:${queryPath}`

  if (cache.exists(key)) {
    return cache.get(key)
  }

  const response = await fetch(queryPath)
  const json = await response.json()

  if (response.status < 400) {
    cache.set(key, json, defaultExpiry)
  }

  return json
}
