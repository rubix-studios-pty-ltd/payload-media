import type { ProviderResult, UnsplashFilters, UnsplashResult } from '../../types.js'
import type { Resolver } from './provider.js'
import { Provider } from './provider.js'

const UTMParams = 'utm_source=rubixstudios-payload-images&utm_medium=referral'

export class Unsplash extends Provider {
  constructor(apiKey: Resolver) {
    super('unsplash', 'Unsplash', 'https://unsplash.com', apiKey)
  }

  override getFetchBaseUrl(): string {
    return 'https://api.unsplash.com'
  }

  override getFetchHeaders(): Record<string, string> {
    return { Authorization: `Client-ID ${this.getApiKey()}` }
  }

  override async getFeatured(filters?: UnsplashFilters): Promise<unknown> {
    if (filters?.color || filters?.orientation) {
      const params = new URLSearchParams({
        per_page: String(this.getFetchLimit()),
        query: 'featured',
      })

      if (filters.color) {
        params.set('color', filters.color)
      }

      if (filters.orientation) {
        params.set('orientation', filters.orientation)
      }

      const data = await this.fetch('GET', `/search/photos?${params.toString()}`)

      return {
        images: this.formatResults((data as { results: UnsplashResult[] }).results),
        countOfImages: null,
        countOfPages: null,
      }
    }

    const data = await this.fetch(
      'GET',
      `/photos/random?featured=true&count=${this.getFetchLimit()}`
    )

    return {
      images: this.formatResults(data as UnsplashResult[]),
      countOfImages: null,
      countOfPages: null,
    }
  }

  override async getSearch(
    query: string,
    page: number,
    filters?: UnsplashFilters
  ): Promise<unknown> {
    const params = new URLSearchParams({
      per_page: String(this.getFetchLimit()),
      page: String(page),
      query,
    })

    if (filters?.color) params.set('color', filters.color)
    if (filters?.orientation) params.set('orientation', filters.orientation)

    const data = await this.fetch('GET', `/search/photos?${params.toString()}`)

    return {
      images: this.formatResults((data as { results: UnsplashResult[] }).results),
      totalImages: (data as { total: number }).total,
      totalPages: Math.min((data as { total_pages: number }).total_pages, 100),
    }
  }

  override trackDownload(url: string) {
    const downloadUrl = new URL(url)
    void this.fetch('GET', `${downloadUrl.pathname}${downloadUrl.search}`)
    return null
  }

  override formatResults(data: UnsplashResult[]): ProviderResult[] {
    return data.map((image) => ({
      id: image.id,
      alt: image.alt_description || '',
      width: image.width,
      height: image.height,
      color: image.color,
      likes: image.likes,
      avatar: image.user?.profile_image?.medium ?? undefined,
      urls: {
        view: image.urls?.thumb,
        original: image.urls?.full,
        download: `${image.links?.download}?${UTMParams}`,
        downloadLocation: `${image.links.download_location}&${UTMParams}`,
      },
      attribution: {
        name: image.user?.name,
        link: `${image.user?.links?.html}?${UTMParams}`,
      },
    }))
  }
}
