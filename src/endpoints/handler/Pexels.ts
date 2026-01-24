import type { PexelsFilters, PexelsResult, ProviderResult } from '../../types.js'
import type { Resolver } from './Provider.js'
import { Provider } from './Provider.js'

export class Pexels extends Provider {
  constructor(apiKey: Resolver) {
    super('pexels', 'Pexels', 'https://www.pexels.com/', apiKey)
  }

  override getFetchBaseUrl(): string {
    return 'https://api.pexels.com'
  }

  override getFetchHeaders(): Record<string, string> {
    return { Authorization: `${this.getApiKey()}` }
  }

  override async getFeatured(filters?: PexelsFilters): Promise<unknown> {
    if (filters?.color || filters?.orientation || filters?.size) {
      return this.getSearch('featured', 1, filters)
    }

    const data = await this.fetch('GET', `/v1/curated?per_page=${this.getFetchLimit()}`)

    return {
      images: this.formatResults((data as { photos: PexelsResult[] }).photos),
      totalImages: null,
      totalPages: null,
    }
  }

  override async getSearch(query: string, page: number, filters?: PexelsFilters): Promise<unknown> {
    const params = new URLSearchParams({
      query: query || 'featured',
      page: String(page),
      per_page: String(this.getFetchLimit()),
    })

    if (filters?.color) params.set('color', filters.color)
    if (filters?.size) params.set('size', filters.size)
    if (filters?.orientation) params.set('orientation', filters.orientation)

    const data = await this.fetch('GET', `/v1/search?${params.toString()}`)

    const totalResults = (data as { total_results: number }).total_results

    return {
      images: this.formatResults((data as { photos: PexelsResult[] }).photos),
      totalImages: totalResults,
      totalPages: Math.min(Math.ceil(totalResults / this.getFetchLimit()), 100),
    }
  }

  override formatResults(data: PexelsResult[]): ProviderResult[] {
    return data.map((image) => ({
      id: image.id,
      alt: image.alt || '',
      width: image.width,
      height: image.height,
      color: image.avg_color,
      urls: {
        view: image.src.medium,
        original: image.src.original,
        download: image.url,
      },
      attribution: {
        name: image.photographer,
        link: image.photographer_url,
      },
    }))
  }
}
