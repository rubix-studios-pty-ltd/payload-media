'use client'

import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
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

  const requestRef = useRef<AbortController | null>(null)

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

  const getOptions = useCallback(
    async (signal: AbortSignal) => {
      try {
        const response = await fetch(`${serverURL}${api}/providers`, { signal })
        const json = await response.json()

        if (signal.aborted) return

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
        if (signal.aborted) return

        setLoading(false)
        error()
      }
    },
    [serverURL, api, error]
  )

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
    async (page?: number) => {
      requestRef.current?.abort()
      requestRef.current = null

      if (!provider || !filters || !mediaType) return

      const controller = new AbortController()
      requestRef.current = controller

      setLoading(true)
      resetMedia()

      try {
        const path =
          page === undefined ? `featured${buildFeatures()}` : `search?${buildQuery(page)}`

        const json = await fetchCache(
          `${serverURL}${api}/providers/${provider.value}/${path}`,
          controller.signal
        )

        if (controller.signal.aborted || requestRef.current !== controller) return

        if (json.error) {
          toast.error(json.error)
          return
        }

        setMedia(json.data.images)
        setTotalPages(page === undefined ? null : json.data.totalPages)
        setCurrentPage(page ?? 1)
      } catch {
        if (controller.signal.aborted || requestRef.current !== controller) return

        error()
      } finally {
        if (requestRef.current === controller) {
          requestRef.current = null
          setLoading(false)
        }
      }
    },
    [serverURL, api, provider, filters, mediaType, error, buildQuery, buildFeatures, resetMedia]
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
    const controller = new AbortController()

    void getOptions(controller.signal)

    return () => controller.abort()
  }, [getOptions])

  useEffect(() => {
    void getMedia(value.trim().length > 0 ? 1 : undefined)

    return () => {
      requestRef.current?.abort()
      requestRef.current = null
    }
  }, [value, getMedia])

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
