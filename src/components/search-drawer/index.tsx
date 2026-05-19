'use client'

import { Pagination, SearchFilter, Select, toast } from '@payloadcms/ui'
import React, { useCallback, useEffect, useState } from 'react'

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

export type SearchDrawerProps = {
  serverURL: string
  api: string
  onSelect: (value: string) => void
}

export const SearchDrawer = (props: SearchDrawerProps) => {
  const { serverURL, api, onSelect } = props

  const [selectedProvider, setSelectedProvider] = useState<ProviderOption | null>(null)
  const [options, setOptions] = useState<ProviderOption[]>([])

  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [media, setMedia] = useState<ProviderResult[] | null>(null)
  const [filters, setFilters] = useState<ProviderFilters | null>(null)

  const [currentPage, setCurrentPage] = useState<number | null>(null)
  const [totalPages, setTotalPages] = useState<number | null>(null)

  const [loading, setLoading] = useState(true)
  const [value, setValue] = useState('')

  const defaultError = useCallback(() => {
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
      setSelectedProvider(initial)
    } catch {
      setLoading(false)
      defaultError()
    }
  }, [serverURL, api, defaultError])

  const buildFeatured = useCallback(() => {
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

  const getFeatured = useCallback(async () => {
    if (!selectedProvider || !filters || !mediaType) return

    try {
      setLoading(true)

      const json = await fetchCache(
        `${serverURL}${api}/providers/${selectedProvider.value}/featured${buildFeatured()}`
      )
      if (!json) return

      if (json.error) {
        toast.error(json.error)
        return
      }

      setMedia(json.data.images)
    } catch {
      defaultError()
    } finally {
      setLoading(false)
    }
  }, [serverURL, api, selectedProvider, filters, buildFeatured, mediaType, defaultError])

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
          `${serverURL}${api}/providers/${selectedProvider?.value}/search?${buildQuery(page)}`
        )

        if (json.error) return toast.error(json.error)

        setMedia(json.data.images)
        setTotalPages(json.data.totalPages)
        setCurrentPage(page)
      } catch {
        defaultError()
      } finally {
        setLoading(false)
      }
    },
    [serverURL, api, selectedProvider?.value, defaultError, buildQuery]
  )

  const selectImage = async (url: string, download?: string) => {
    onSelect(url)
    if (!download) return

    try {
      await fetch(
        `${serverURL}${api}/providers/${selectedProvider?.value}/track-download?url=${download}`
      )
    } catch {
      return null
    }
  }

  const selectFilter = useCallback(
    (select: ProviderOption) => {
      setFilters({ provider: select.value, options: {} })
      setSelectedProvider(select)
      if (select.value === 'unsplash') {
        setMediaType('image')
      }
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

  useEffect(() => {
    void getOptions()
  }, [getOptions])

  useEffect(() => {
    if (!selectedProvider?.value || !filters || !mediaType) return

    if (value.trim().length > 0) {
      void getMedia(1)
    } else {
      void getFeatured()
    }
  }, [selectedProvider?.value, filters, value, mediaType, getMedia, getFeatured])

  return (
    <div className={baseClass}>
      <div className={`${baseClass}__fields`}>
        <SearchFilter label="" handleChange={changeFilters} />
        <Select
          options={MediaOptions.filter((option) =>
            filters?.provider === 'unsplash' ? option.value === 'image' : true
          )}
          value={{ label: mediaType === 'image' ? 'Images' : 'Videos', value: mediaType }}
          onChange={(opt) => {
            const val = (opt as MediaOption)?.value
            setMediaType(val)
            resetMedia()
          }}
          isClearable={false}
          isSearchable={false}
          isCreatable={false}
          className={`${baseClass}__mediaToggle`}
        />
        <Select
          options={options}
          value={selectedProvider as ProviderOption}
          onChange={(value) => selectFilter(value as ProviderOption)}
          isClearable={false}
          isSearchable={false}
          isCreatable={false}
          className={`${baseClass}__options`}
        />
      </div>

      {filters?.provider === 'pexels' && (
        <PexelsFilters
          filters={filters}
          mediaType={mediaType}
          setFilters={setFilters}
          baseClass={baseClass}
        />
      )}

      {filters?.provider === 'pixabay' && (
        <PixabayFilters
          filters={filters}
          mediaType={mediaType}
          setFilters={setFilters}
          baseClass={baseClass}
        />
      )}

      {filters?.provider === 'unsplash' && (
        <UnsplashFilters filters={filters} setFilters={setFilters} baseClass={baseClass} />
      )}

      {loading && <div className={`${baseClass}__loading`}>Loading media...</div>}

      {!loading && media?.length === 0 && (
        <div className={`${baseClass}__noResults`}>No media found</div>
      )}

      {!loading && media && media?.length > 0 && (
        <>
          <div className={`${baseClass}__results`}>
            {media.map((data) => (
              <React.Fragment key={data.id}>
                {mediaType === 'video' ? (
                  <VideoCard data={data} baseClass={baseClass} />
                ) : (
                  <ImageCard data={data} baseClass={baseClass} onSelect={selectImage} />
                )}
              </React.Fragment>
            ))}
          </div>

          {currentPage && totalPages && totalPages > 1 && (
            <div className={`${baseClass}__pagination`}>
              <Pagination
                hasNextPage={currentPage < totalPages}
                hasPrevPage={currentPage > 1}
                nextPage={currentPage < totalPages ? currentPage + 1 : undefined}
                numberOfNeighbors={3}
                page={currentPage}
                prevPage={currentPage > 1 ? currentPage - 1 : undefined}
                totalPages={totalPages}
                onChange={(page: number) => getMedia(page)}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
