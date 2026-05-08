import { type Access } from 'payload'

export type MediaOption = {
  label: string
  value: 'image' | 'video'
}

export const MediaOptions: MediaOption[] = [
  { label: 'Images', value: 'image' },
  { label: 'Videos', value: 'video' },
]

export interface OpenverseResponse {
  result_count: number
  page_count: number
  page_size: number
  page: number
  results: OpenverseResult[]
}

export interface OpenverseResult {
  id: string
  title: string | null
  width: number
  height: number
  thumbnail: string
  url: string
  background_color?: string | null

  creator: string | null
  creator_url: string | null
  foreign_landing_url: string | null

  source: string
}

export const PexelsColours = [
  { label: 'Black', value: 'black' },
  { label: 'Blue', value: 'blue' },
  { label: 'Brown', value: 'brown' },
  { label: 'Gray', value: 'gray' },
  { label: 'Green', value: 'green' },
  { label: 'Orange', value: 'orange' },
  { label: 'Pink', value: 'pink' },
  { label: 'Red', value: 'red' },
  { label: 'Turquoise', value: 'turquoise' },
  { label: 'Violet', value: 'violet' },
  { label: 'White', value: 'white' },
  { label: 'Yellow', value: 'yellow' },
]

export type PexelsFilters = {
  orientation?: string
  size?: string
  media?: 'image' | 'video'
  color?: string
}

export const PexelsOrientation = [
  { label: 'Landscape', value: 'landscape' },
  { label: 'Portrait', value: 'portrait' },
  { label: 'Square', value: 'square' },
]

export const PexelsSize = [
  { label: 'Small (4MP)', value: 'small' },
  { label: 'Medium (12MP)', value: 'medium' },
  { label: 'Large (24MP)', value: 'large' },
]

interface PexelsVideoUser {
  id: number
  name: string
  url: string
}

interface PexelsVideoFile {
  id: number
  quality: 'hd' | 'sd'
  file_type: string
  width: number
  height: number
  fps: number
  link: string
}

interface PexelsVideoPicture {
  id: number
  picture: string
  nr: number
}

export interface PexelsVideo {
  id: number
  width: number
  height: number
  url: string
  image: string
  duration: number
  user: PexelsVideoUser
  video_files: PexelsVideoFile[]
  video_pictures: PexelsVideoPicture[]
}

export interface PexelsVideoResponse {
  page: number
  per_page: number
  total_results: number
  url: string
  videos: PexelsVideo[]
}

export const PexelsVideoSize = [
  { label: 'Large (4K)', value: 'large' },
  { label: 'Medium (Full HD)', value: 'medium' },
  { label: 'Small (HD)', value: 'small' },
]

export interface PexelsResult {
  id: string
  alt: string
  width: number
  height: number
  avg_color: string
  url: string
  src: {
    medium: string
    original: string
  }
  photographer: string
  photographer_url: string
}

export const PixabayCategories = [
  { label: 'Animals', value: 'animals' },
  { label: 'Backgrounds', value: 'backgrounds' },
  { label: 'Buildings', value: 'buildings' },
  { label: 'Business', value: 'business' },
  { label: 'Computer', value: 'computer' },
  { label: 'Education', value: 'education' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Feelings', value: 'feelings' },
  { label: 'Food', value: 'food' },
  { label: 'Health', value: 'health' },
  { label: 'Industry', value: 'industry' },
  { label: 'Music', value: 'music' },
  { label: 'Nature', value: 'nature' },
  { label: 'People', value: 'people' },
  { label: 'Places', value: 'places' },
  { label: 'Religion', value: 'religion' },
  { label: 'Science', value: 'science' },
  { label: 'Sports', value: 'sports' },
  { label: 'Transportation', value: 'transportation' },
  { label: 'Travel', value: 'travel' },
]

export const PixabayColours = [
  { label: 'Black', value: 'black' },
  { label: 'Blue', value: 'blue' },
  { label: 'Brown', value: 'brown' },
  { label: 'Grayscale', value: 'grayscale' },
  { label: 'Gray', value: 'gray' },
  { label: 'Green', value: 'green' },
  { label: 'Lilac', value: 'lilac' },
  { label: 'Orange', value: 'orange' },
  { label: 'Pink', value: 'pink' },
  { label: 'Red', value: 'red' },
  { label: 'Transparent', value: 'transparent' },
  { label: 'Turquoise', value: 'turquoise' },
  { label: 'White', value: 'white' },
  { label: 'Yellow', value: 'yellow' },
]

export type PixabayFilters = {
  image_type?: string
  orientation?: string
  category?: string
  colors?: string
  order?: string
  media?: 'image' | 'video'
}

export const PixabayImageType = [
  { label: 'Photo', value: 'photo' },
  { label: 'Illustration', value: 'illustration' },
  { label: 'Vector', value: 'vector' },
]

export const PixabayOrder = [
  { label: 'Popular', value: 'popular' },
  { label: 'Latest', value: 'latest' },
]

export const PixabayOrientation = [
  { label: 'Landscape', value: 'horizontal' },
  { label: 'Portrait', value: 'vertical' },
]

export interface PixabayResult {
  id: string
  imageWidth: number
  imageHeight: number
  webformatURL: string
  largeImageURL: string
  likes: number
  imageURL: string
  user: string
  user_id: number
  userImageURL: string
}

interface PixabayVideoFormat {
  url: string
  width: number
  height: number
  size: number
  thumbnail: string
}

interface PixabayVideoFormats {
  large: PixabayVideoFormat
  medium: PixabayVideoFormat
  small: PixabayVideoFormat
  tiny: PixabayVideoFormat
}

export interface PixabayVideo {
  id: number
  pageURL: string

  type?: string
  tags?: string
  duration?: number

  videos: PixabayVideoFormats

  views: number
  downloads: number
  likes: number
  comments: number

  user_id: number
  user: string
  userImageURL: string
}

export interface PixabayVideoResponse {
  total: number
  totalHits: number
  hits: PixabayVideo[]
}

export type ProviderConfig = {
  access?: Access
  disabled?: boolean
  openverse?: string
  pexels?: string
  pixabay?: string
  unsplash?: string
}

export type ProviderFilters =
  | { provider: 'unsplash'; options: UnsplashFilters }
  | { provider: 'pexels'; options: PexelsFilters }
  | { provider: 'pixabay'; options: PixabayFilters }

export type ProviderKeys = {
  unsplash?: string
  openverse?: string
  pexels?: string
  pixabay?: string
}

type ProviderKey = 'unsplash' | 'pexels' | 'pixabay'

export type ProviderOption = {
  label: string
  value: ProviderKey
}

export interface ProviderResult {
  id: string
  alt: string
  width: number
  height: number
  color: string
  likes?: number
  urls: {
    view: string
    original: string
    download: string
    downloadLocation?: string
  }
  avatar?: string
  attribution: {
    name: string
    link: string
  }
}

export const UnsplashColours = [
  { label: 'Black', value: 'black' },
  { label: 'Blue', value: 'blue' },
  { label: 'Grayscale', value: 'black_and_white' },
  { label: 'Green', value: 'green' },
  { label: 'Magenta', value: 'magenta' },
  { label: 'Orange', value: 'orange' },
  { label: 'Purple', value: 'purple' },
  { label: 'Red', value: 'red' },
  { label: 'Teal', value: 'teal' },
  { label: 'White', value: 'white' },
  { label: 'Yellow', value: 'yellow' },
]

export type UnsplashFilters = {
  color?: string
  orientation?: string
  media?: 'image' | 'video'
}

export const UnsplashOrientation = [
  { label: 'Landscape', value: 'landscape' },
  { label: 'Portrait', value: 'portrait' },
  { label: 'Square', value: 'squarish' },
]

export interface UnsplashResult {
  id: string
  alt_description: string
  width: number
  height: number
  color: string
  likes?: number
  urls: {
    thumb: string
    full: string
  }
  links: {
    download: string
    download_location: string
  }
  user: {
    name: string
    profile_image?: {
      small: string
      medium: string
      large: string
    }
    links: {
      html: string
    }
  }
}
