const VERSION = '2'

export class CacheManager {
  private getVersionedKey(query: string) {
    return `${VERSION}${query}`
  }

  exists(query: string) {
    const key = this.getVersionedKey(query)
    return localStorage.getItem(key) !== null
  }

  get(query: string) {
    const key = this.getVersionedKey(query)
    const itemStr = localStorage.getItem(key)

    if (!itemStr) return null

    let item: { value: unknown; expiry?: number }
    try {
      item = JSON.parse(itemStr)
    } catch {
      localStorage.removeItem(key)
      return null
    }

    if (item.expiry && Date.now() > item.expiry) {
      localStorage.removeItem(key)
      return null
    }

    return item.value
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
