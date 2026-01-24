import type { PixabayFilters, PixabayResult, ProviderResult } from '../../types.js'
import type { Resolver } from './Provider.js'
import { Provider } from './Provider.js'

export class Pixabay extends Provider {
  constructor(apiKey: Resolver) {
    super('pixabay', 'Pixabay', 'https://pixabay.com', apiKey)
  }

  override getFetchBaseUrl(): string {
    return 'https://pixabay.com'
  }

  override getFetchHeaders(): Record<string, string> {
    return {}
  }

  override async getFeatured(filters?: PixabayFilters): Promise<unknown> {
    if (
      filters?.image_type ||
      filters?.orientation ||
      filters?.colors ||
      filters?.category ||
      filters?.order
    ) {
      return this.getSearch('', 1, filters)
    }

    const data = await this.fetch(
      'GET',
      `/api?key=${this.getApiKey()}&per_page=${this.getFetchLimit()}`
    )

    return {
      images: this.formatResults((data as { hits: PixabayResult[] }).hits),
      totalImages: null,
      totalPages: null,
    }
  }

  override async getSearch(
    query: string,
    page: number,
    filters?: PixabayFilters
  ): Promise<unknown> {
    const params = new URLSearchParams({
      key: this.getApiKey(),
      q: query || '',
      page: String(page),
      per_page: String(this.getFetchLimit()),
    })

    if (filters?.category) params.set('category', filters.category)
    if (filters?.image_type) params.set('image_type', filters.image_type)
    if (filters?.colors) params.set('colors', filters.colors)
    if (filters?.orientation) params.set('orientation', filters.orientation)
    if (filters?.order) params.set('order', filters.order)

    const data = await this.fetch('GET', `/api?${params.toString()}`)

    const totalHits = (data as { totalHits: number }).totalHits

    return {
      images: this.formatResults((data as { hits: PixabayResult[] }).hits),
      totalImages: totalHits,
      totalPages: Math.min(Math.ceil(totalHits / this.getFetchLimit()), 100),
    }
  }

  override formatResults(data: PixabayResult[]): ProviderResult[] {
    return data.map((image) => ({
      id: image.id,
      alt: '',
      width: image.imageWidth,
      height: image.imageHeight,
      color: '#ccc',
      likes: image.likes,
      urls: {
        view: image.webformatURL,
        original: image.imageURL || image.largeImageURL,
        download: image.imageURL || image.largeImageURL,
      },
      attribution: {
        name: image.user,
        link: `https://pixabay.com/users/${image.user}-${image.user_id}/`,
      },
      avatar: image.userImageURL,
    }))
  }
}
