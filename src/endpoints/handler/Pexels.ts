import { type PexelsFilters, type PexelsResult, type ProviderResult } from '../../types.js'
import { Provider, type Resolver } from './provider.js'

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
    if (filters?.media === 'video') {
      const data = await this.fetch('GET', `/videos/popular?per_page=${this.getFetchLimit()}`)

      return {
        images: this.formatVideoResults((data as { videos: any[] }).videos),
        totalImages: null,
        totalPages: null,
      }
    }

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
    if (filters?.media === 'video') {
      const params = new URLSearchParams({
        query: query || 'featured',
        page: String(page),
        per_page: String(this.getFetchLimit()),
      })

      if (filters?.size) params.set('size', filters.size)
      if (filters?.orientation) params.set('orientation', filters.orientation)

      const data = await this.fetch('GET', `/videos/search?${params.toString()}`)

      const totalResults = (data as { total_results: number }).total_results

      return {
        images: this.formatVideoResults((data as { videos: any[] }).videos),
        totalImages: totalResults,
        totalPages: Math.min(Math.ceil(totalResults / this.getFetchLimit()), 100),
      }
    }

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

  formatVideoResults(data: any[]): ProviderResult[] {
    return data.map((video) => {
      const file =
        video.video_files?.find((f: any) => f.quality === 'hd' && f.file_type === 'video/mp4') ??
        video.video_files?.find((f: any) => f.file_type === 'video/mp4') ??
        {}

      return {
        id: video.id,
        alt: video.url || '',
        width: video.width ?? file.width ?? 0,
        height: video.height ?? file.height ?? 0,
        color: video.avg_color || '#000',
        urls: {
          view: video.image || '',
          original: file.link || video.url || '',
          download: file.link || video.url || '',
        },
        attribution: {
          name: video.user?.name || '',
          link: video.user?.url || '',
        },
      }
    })
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
