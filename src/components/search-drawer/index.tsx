'use client'

import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { ListSearchFilter, Pagination, Select, toast } from '@payloadcms/ui'

import {
  type MediaOption,
  MediaOptions,
  type ProviderFilters,
  type ProviderOption,
  type ProviderResult,
} from '../../types.js'
import { fetchCache } from '../../utils/fetchCache.js'
import { PexelsFilters } from './filters/pexels.js'
import { PixabayFilters } from './filters/pixabay.js'
import { UnsplashFilters } from './filters/unsplash.js'
import { ImageCard } from './media/image.js'
import { VideoCard } from './media/video.js'
import './style.css'

const baseClass = 'search-media'

export type Props = {
  serverURL: string
  api: string
  onSelect: (value: string) => void
}

export const SearchDrawer = (props: Props) => {
  const { serverURL, api, onSelect } = props

  const [provider, setProvider] = useState<ProviderOption | null>(null)
  const [options, setOptions] = useState<ProviderOption[]>([])

  const [media, setMedia] = useState<ProviderResult[] | null>(null)
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [filters, setFilters] = useState<ProviderFilters | null>(null)

  const [currentPage, setCurrentPage] = useState<number | null>(null)
  const [totalPages, setTotalPages] = useState<number | null>(null)

  const [loading, setLoading] = useState(true)
  const [value, setValue] = useState('')

  const mediaOptions = MediaOptions.filter((option) =>
    filters?.provider === 'unsplash' ? option.value === 'image' : true
  )

  const error = useCallback(() => {
    toast.error('Something went wrong.')
  }, [])

  const resetMedia = useCallback(() => {
    setMedia(null)
    setTotalPages(null)
    setCurrentPage(1)
  }, [])

  const getOptions = useCallback(async () => {
    try {
      const response = await fetch(`${serverURL}${api}/providers`)
      const json = await response.json()

      if (json.error) {
        setLoading(false)
        return toast.error(json.error)
      }

      const providers = json.data.map((provider: { name: string; key: string }) => ({
        label: provider.name,
        value: provider.key.toLowerCase(),
      }))

      setOptions(providers)

      const initial = providers[0]

      if (!initial) {
        setLoading(false)
        return
      }

      setFilters({ provider: initial.value, options: {} })
      setProvider(initial)
    } catch {
      setLoading(false)
      error()
    }
  }, [serverURL, api, error])

  const buildFeatures = useCallback(() => {
    if (!filters || !mediaType) return ''

    const params = new URLSearchParams()

    switch (filters.provider) {
      case 'unsplash': {
        const { color, orientation } = filters.options
        if (color) params.set('color', color)
        if (orientation) params.set('orientation', orientation)
        break
      }

      case 'pexels': {
        const { color, orientation, size } = filters.options
        if (color) params.set('color', color)
        if (orientation) params.set('orientation', orientation)
        if (size) params.set('size', size)
        if (mediaType === 'video') params.set('media', 'video')
        break
      }

      case 'pixabay': {
        const { category, image_type, order, orientation, colors } = filters.options
        if (category) params.set('category', category)
        if (image_type) params.set('image_type', image_type)
        if (order) params.set('order', order)
        if (orientation) params.set('orientation', orientation)
        if (colors) params.set('colors', colors)
        if (mediaType === 'video') params.set('media', 'video')
        break
      }
    }

    const query = params.toString()
    return query ? `?${query}` : ''
  }, [filters, mediaType])

  const getFeatures = useCallback(async () => {
    if (!provider || !filters || !mediaType) return

    try {
      setLoading(true)

      const json = await fetchCache(
        `${serverURL}${api}/providers/${provider.value}/featured${buildFeatures()}`
      )
      if (!json) return

      if (json.error) {
        toast.error(json.error)
        return
      }

      setMedia(json.data.images)
    } catch {
      error()
    } finally {
      setLoading(false)
    }
  }, [serverURL, api, provider, filters, buildFeatures, mediaType, error])

  const buildQuery = useCallback(
    (page = 1) => {
      if (!filters || !mediaType) return ''

      const params = new URLSearchParams()
      params.set('query', value)
      params.set('page', String(page))

      switch (filters.provider) {
        case 'unsplash': {
          const { color, orientation } = filters.options
          if (color) params.set('color', color)
          if (orientation) params.set('orientation', orientation)
          break
        }
        case 'pexels': {
          const { color, orientation, size } = filters.options
          if (color) params.set('color', color)
          if (orientation) params.set('orientation', orientation)
          if (size) params.set('size', size)
          if (mediaType === 'video') params.set('media', 'video')
          break
        }
        case 'pixabay': {
          const { category, image_type, order, orientation, colors } = filters.options
          if (category) params.set('category', category)
          if (image_type) params.set('image_type', image_type)
          if (order) params.set('order', order)
          if (orientation) params.set('orientation', orientation)
          if (colors) params.set('colors', colors)
          if (mediaType === 'video') params.set('media', 'video')
          break
        }
      }

      return params.toString()
    },
    [filters, value, mediaType]
  )

  const getMedia = useCallback(
    async (page = 1) => {
      try {
        setLoading(true)
        const json = await fetchCache(
          `${serverURL}${api}/providers/${provider?.value}/search?${buildQuery(page)}`
        )

        if (json.error) return toast.error(json.error)

        setMedia(json.data.images)
        setTotalPages(json.data.totalPages)
        setCurrentPage(page)
      } catch {
        error()
      } finally {
        setLoading(false)
      }
    },
    [serverURL, api, provider?.value, error, buildQuery]
  )

  const selectMedia = async (url: string, download?: string) => {
    onSelect(url)
    if (!download) return

    try {
      await fetch(
        `${serverURL}${api}/providers/${provider?.value}/track-download?url=${encodeURIComponent(
          download
        )}`
      )
    } catch {
      return null
    }
  }

  const selectFilter = useCallback(
    (value: unknown) => {
      const select = value as ProviderOption

      setFilters({ provider: select.value, options: {} })
      setProvider(select)
      if (select.value === 'unsplash') {
        setMediaType('image')
      }
      resetMedia()
    },
    [resetMedia]
  )

  const selectType = useCallback(
    (option: unknown) => {
      const value = (option as MediaOption)?.value

      setMediaType(value)
      resetMedia()
    },
    [resetMedia]
  )

  const changeFilters = useCallback(
    (search: string) => {
      setValue(search)
      resetMedia()
    },
    [resetMedia]
  )

  const renderMedia = (data: ProviderResult) => (
    <Fragment key={data.id}>
      {mediaType === 'video' ? (
        <VideoCard baseClass={baseClass} data={data} onSelect={selectMedia} />
      ) : (
        <ImageCard baseClass={baseClass} data={data} onSelect={selectMedia} />
      )}
    </Fragment>
  )

  useEffect(() => {
    void getOptions()
  }, [getOptions])

  useEffect(() => {
    if (!provider?.value || !filters || !mediaType) return

    if (value.trim().length > 0) {
      void getMedia(1)
    } else {
      void getFeatures()
    }
  }, [provider?.value, filters, value, mediaType, getMedia, getFeatures])

  return (
    <div className={baseClass}>
      <div className={`${baseClass}__fields`}>
        <ListSearchFilter label="Search media" onSearchChange={changeFilters} />

        <Select
          className={`${baseClass}__mediaToggle`}
          isClearable={false}
          isCreatable={false}
          isSearchable={false}
          onChange={selectType}
          options={mediaOptions}
          value={{ label: mediaType === 'image' ? 'Images' : 'Videos', value: mediaType }}
        />

        <Select
          className={`${baseClass}__options`}
          isClearable={false}
          isCreatable={false}
          isSearchable={false}
          onChange={selectFilter}
          options={options}
          value={provider as ProviderOption}
        />
      </div>

      {filters?.provider === 'pexels' && (
        <PexelsFilters
          baseClass={baseClass}
          filters={filters}
          mediaType={mediaType}
          setFilters={setFilters}
        />
      )}

      {filters?.provider === 'pixabay' && (
        <PixabayFilters
          baseClass={baseClass}
          filters={filters}
          mediaType={mediaType}
          setFilters={setFilters}
        />
      )}

      {filters?.provider === 'unsplash' && (
        <UnsplashFilters baseClass={baseClass} filters={filters} setFilters={setFilters} />
      )}

      {loading && <div className={`${baseClass}__loading`}>Loading media...</div>}

      {!loading && media?.length === 0 && (
        <div className={`${baseClass}__noResults`}>No media found</div>
      )}

      {!loading && media && media?.length > 0 && (
        <>
          <div className={`${baseClass}__results`}>{media.map(renderMedia)}</div>

          {currentPage && totalPages && totalPages > 1 && (
            <div className={`${baseClass}__pagination`}>
              <Pagination
                hasNextPage={currentPage < totalPages}
                hasPrevPage={currentPage > 1}
                nextPage={currentPage < totalPages ? currentPage + 1 : undefined}
                numberOfNeighbors={3}
                onChange={getMedia}
                page={currentPage}
                prevPage={currentPage > 1 ? currentPage - 1 : undefined}
                totalPages={totalPages}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
