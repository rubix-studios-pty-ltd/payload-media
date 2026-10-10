const VERSION = '2'

type CacheItem = {
  value: unknown
  expiry?: number
}

export class CacheManager {
  private getVersionedKey(query: string): string {
    return `${VERSION}${query}`
  }

  exists(query: string): boolean {
    const key = this.getVersionedKey(query)

    return localStorage.getItem(key) !== null
  }

  get(query: string): unknown {
    const key = this.getVersionedKey(query)
    const stored = localStorage.getItem(key)

    if (!stored) return null

    try {
      const item = JSON.parse(stored) as CacheItem

      if (!item || typeof item !== 'object' || !('value' in item)) {
        localStorage.removeItem(key)
        return null
      }

      if (item.expiry && Date.now() > item.expiry) {
        localStorage.removeItem(key)
        return null
      }

      return item.value
    } catch {
      localStorage.removeItem(key)
      return null
    }
  }

  set(query: string, data: unknown, ttl?: number): void {
    const key = this.getVersionedKey(query)

    localStorage.setItem(
      key,
      JSON.stringify({
        value: data,
        expiry: ttl ? Date.now() + ttl : undefined,
      })
    )
  }
}
