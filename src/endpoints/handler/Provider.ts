import { type ProviderResult } from '../../types.js'

export type Resolver = () => string | undefined

export class Provider {
  key: string
  name: string
  url: string

  constructor(
    key: string,
    name: string,
    url: string,
    protected apiKey?: Resolver
  ) {
    this.key = key
    this.name = name
    this.url = url
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

  async fetch(method: string, urlPath: string, data?: object): Promise<unknown> {
    const baseUrl = new URL(this.getFetchBaseUrl())
    const url = new URL(urlPath, baseUrl)

    if (
      baseUrl.protocol !== 'https:' ||
      url.origin !== baseUrl.origin ||
      url.username ||
      url.password
    ) {
      throw new Error('Invalid provider URL')
    }

    const response = await fetch(url, {
      method,
      headers: this.getFetchHeaders(),
      redirect: 'error',
      signal: AbortSignal.timeout(15_000),
      ...(data && { body: JSON.stringify(data) }),
    })

    if (!response.ok) {
      throw new Error(`${this.name} request failed (${response.status})`)
    }

    return response.json()
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

  trackDownload(_url: string): Promise<null> {
    return Promise.resolve(null)
  }

  formatResults(_data: object): ProviderResult[] {
    return []
  }
}
