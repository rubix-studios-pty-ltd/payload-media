import { type ProviderResult } from '../../types.js'

export type Resolver = () => string | undefined

export class Provider {
  protected apiKey?: Resolver
  key: string
  name: string
  url: string

  constructor(key: string, name: string, url: string, apiKey?: Resolver) {
    this.key = key
    this.name = name
    this.url = url
    this.apiKey = apiKey
  }

  async fetch(method: string, urlPath: string, data?: object): Promise<unknown> {
    const response = await fetch(new URL(urlPath, this.getFetchBaseUrl()), {
      method,
      headers: this.getFetchHeaders(),
      ...(data && { body: JSON.stringify(data) }),
    })

    return response.json()
  }

  get isConfigured(): boolean {
    return Boolean(this.apiKey?.())
  }

  protected getApiKey(): string {
    const key = this.apiKey?.()

    if (!key) {
      throw new Error(`Provider "${this.key}" is not configured`)
    }

    return key
  }

  getFetchBaseUrl(): string {
    return ''
  }

  getFetchHeaders(): Record<string, string> {
    return {}
  }

  getFetchLimit(): number {
    return 24
  }

  getFeatured(_filters?: Record<string, unknown>): Promise<unknown> {
    return Promise.resolve({})
  }

  getSearch(_query: string, _page: number): Promise<unknown> {
    return Promise.resolve({})
  }

  trackDownload(_url: string): null {
    return null
  }

  formatResults(_data: object): ProviderResult[] {
    return []
  }
}
