'use client'

import { LinkIcon, Pagination, SearchFilter, Select, Tooltip, toast } from '@payloadcms/ui'
import React, { useCallback, useEffect, useState } from 'react'
import {
  PexelsColours,
  PexelsOrientation,
  PexelsSize,
  PixabayCategories,
  PixabayColours,
  PixabayImageType,
  PixabayOrder,
  PixabayOrientation,
  ProviderFilters,
  type ProviderOption,
  type ProviderResult,
  type SearchImagesProps,
  UnsplashColours,
  UnsplashOrientation,
} from '../../types.js'
import { fetchCache } from '../../utils/fetchCache.js'
import { HeartIcon } from '../SearchImages/heart.js'
import './style.css'

const baseClass = 'search-images'

export const SearchImages = (props: SearchImagesProps) => {
  const { serverURL, api, onSelect } = props

  const [selectedProvider, setSelectedProvider] = useState<ProviderOption | null>(null)
  const [options, setOptions] = useState<ProviderOption[]>([])

  const [images, setImages] = useState<ProviderResult[] | null>(null)
  const [filters, setFilters] = useState<ProviderFilters | null>(null)

  const [currentPage, setCurrentPage] = useState<number | null>(null)
  const [totalPages, setTotalPages] = useState<number | null>(null)

  const [loading, setLoading] = useState(true)
  const [show, setShow] = useState(false)
  const [value, setValue] = useState('')

  const defaultError = useCallback(() => {
    toast.error('Something went wrong.')
  }, [])

  const resetImages = useCallback(() => {
    setImages(null)
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
      if (!initial) return

      setFilters({ provider: initial.value, options: {} })
      setSelectedProvider(initial)
    } catch {
      setLoading(false)
      defaultError()
    }
  }, [serverURL, api, defaultError])

  const buildFeatured = useCallback(() => {
    if (!filters) return ''

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
        break
      }
      case 'pixabay': {
        const { category, image_type, order, orientation, colors } = filters.options
        if (category) params.set('category', category)
        if (image_type) params.set('image_type', image_type)
        if (order) params.set('order', order)
        if (orientation) params.set('orientation', orientation)
        if (colors) params.set('colors', colors)
        break
      }
    }

    const query = params.toString()
    return query ? `?${query}` : ''
  }, [filters])

  const getFeatured = useCallback(async () => {
    if (!selectedProvider || !filters) return

    try {
      setLoading(true)

      const json = await fetchCache(`${serverURL}${api}/providers/${selectedProvider.value}/featured${buildFeatured()}`)
      if (!json) return

      if (json.error) {
        toast.error(json.error)
        return
      }

      setImages(json.data.images)
    } catch {
      defaultError()
    } finally {
      setLoading(false)
    }
  }, [serverURL, api, selectedProvider, filters, buildFeatured, defaultError])

  const buildQuery = useCallback(
    (page = 1) => {
      if (!filters) return ''

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
          break
        }
        case 'pixabay': {
          const { category, image_type, order, orientation, colors } = filters.options
          if (category) params.set('category', category)
          if (image_type) params.set('image_type', image_type)
          if (order) params.set('order', order)
          if (orientation) params.set('orientation', orientation)
          if (colors) params.set('colors', colors)
          break
        }
      }

      return params.toString()
    },
    [filters, value]
  )

  const getPhotos = useCallback(
    async (page = 1) => {
      try {
        setLoading(true)
        const json = await fetchCache(
          `${serverURL}${api}/providers/${selectedProvider?.value}/search?${buildQuery(page)}`
        )

        if (json.error) return toast.error(json.error)

        setImages(json.data.images)
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
      resetImages()
    },
    [resetImages]
  )

  const changeFilters = useCallback(
    (search: string) => {
      setValue(search)
      resetImages()
    },
    [resetImages]
  )

  useEffect(() => {
    void getOptions()
  }, [getOptions])

  useEffect(() => {
    if (!selectedProvider?.value || !filters) return

    if (value.trim().length > 0) {
      void getPhotos(1)
    } else {
      void getFeatured()
    }
  }, [selectedProvider?.value, filters, value, getPhotos, getFeatured])

  return (
    <div className={baseClass}>
      <div className={`${baseClass}__fields`}>
        <SearchFilter label="" handleChange={changeFilters} />
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
        <div className={`${baseClass}__filters`}>
          <Select
            options={PexelsColours}
            value={PexelsColours.find((o) => o.value === filters.options.color)}
            onChange={(opt) =>
              setFilters((prev) =>
                prev?.provider === 'pexels'
                  ? {
                      provider: 'pexels',
                      options: {
                        ...prev.options,
                        color: (opt as ProviderOption)?.value,
                      },
                    }
                  : prev
              )
            }
            isClearable
            isSearchable={false}
            placeholder="Colour"
          />

          <Select
            options={PexelsSize}
            value={PexelsSize.find((o) => o.value === filters.options.size)}
            onChange={(opt) =>
              setFilters((prev) =>
                prev?.provider === 'pexels'
                  ? {
                      provider: 'pexels',
                      options: {
                        ...prev.options,
                        size: (opt as ProviderOption)?.value,
                      },
                    }
                  : prev
              )
            }
            isClearable
            isSearchable={false}
            placeholder="Size"
          />

          <Select
            options={PexelsOrientation}
            value={PexelsOrientation.find((o) => o.value === filters.options.orientation)}
            onChange={(opt) =>
              setFilters((prev) =>
                prev?.provider === 'pexels'
                  ? {
                      provider: 'pexels',
                      options: {
                        ...prev.options,
                        orientation: (opt as ProviderOption)?.value,
                      },
                    }
                  : prev
              )
            }
            isClearable
            isSearchable={false}
            placeholder="Orientation"
          />
        </div>
      )}

      {filters?.provider === 'pixabay' && (
        <div className={`${baseClass}__filters`}>
          <Select
            options={PixabayCategories}
            value={PixabayCategories.find((o) => o.value === filters.options.category)}
            onChange={(opt) =>
              setFilters((prev) =>
                prev?.provider === 'pixabay'
                  ? {
                      provider: 'pixabay',
                      options: {
                        ...prev.options,
                        category: (opt as ProviderOption)?.value,
                      },
                    }
                  : prev
              )
            }
            isClearable
            isSearchable={false}
            placeholder="Category"
          />

          <Select
            options={PixabayImageType}
            value={PixabayImageType.find((o) => o.value === filters.options.image_type)}
            onChange={(opt) =>
              setFilters((prev) =>
                prev?.provider === 'pixabay'
                  ? {
                      provider: 'pixabay',
                      options: {
                        ...prev.options,
                        image_type: (opt as ProviderOption)?.value,
                      },
                    }
                  : prev
              )
            }
            isClearable
            isSearchable={false}
            placeholder="Type"
          />

          <Select
            options={PixabayColours}
            value={PixabayColours.find((o) => o.value === filters.options.colors)}
            onChange={(opt) =>
              setFilters((prev) =>
                prev?.provider === 'pixabay'
                  ? {
                      provider: 'pixabay',
                      options: {
                        ...prev.options,
                        colors: (opt as ProviderOption)?.value,
                      },
                    }
                  : prev
              )
            }
            isClearable
            isSearchable={false}
            placeholder="Colour"
          />

          <Select
            options={PixabayOrientation}
            value={PixabayOrientation.find((o) => o.value === filters.options.orientation)}
            onChange={(opt) =>
              setFilters((prev) =>
                prev?.provider === 'pixabay'
                  ? {
                      provider: 'pixabay',
                      options: {
                        ...prev.options,
                        orientation: (opt as ProviderOption)?.value,
                      },
                    }
                  : prev
              )
            }
            isClearable
            isSearchable={false}
            placeholder="Orientation"
          />

          <Select
            options={PixabayOrder}
            value={PixabayOrder.find((o) => o.value === filters.options.order)}
            onChange={(opt) =>
              setFilters((prev) =>
                prev?.provider === 'pixabay'
                  ? {
                      provider: 'pixabay',
                      options: {
                        ...prev.options,
                        order: (opt as ProviderOption)?.value,
                      },
                    }
                  : prev
              )
            }
            isClearable
            isSearchable={false}
            placeholder="Order"
          />
        </div>
      )}

      {filters?.provider === 'unsplash' && (
        <div className={`${baseClass}__filters`}>
          <Select
            options={UnsplashColours}
            value={UnsplashColours.find((o) => o.value === filters.options.color)}
            onChange={(opt) =>
              setFilters((prev) =>
                prev?.provider === 'unsplash'
                  ? {
                      provider: 'unsplash',
                      options: {
                        ...prev.options,
                        color: (opt as ProviderOption)?.value,
                      },
                    }
                  : prev
              )
            }
            isClearable
            isSearchable={false}
            placeholder="Colour"
          />

          <Select
            options={UnsplashOrientation}
            value={UnsplashOrientation.find((o) => o.value === filters.options.orientation)}
            onChange={(opt) =>
              setFilters((prev) =>
                prev?.provider === 'unsplash'
                  ? {
                      provider: 'unsplash',
                      options: {
                        ...prev.options,
                        orientation: (opt as ProviderOption)?.value,
                      },
                    }
                  : prev
              )
            }
            isClearable
            isSearchable={false}
            placeholder="Orientation"
          />
        </div>
      )}

      {loading && <div className={`${baseClass}__loading`}>Loading images...</div>}

      {!loading && images?.length === 0 && (
        <div className={`${baseClass}__noResults`}>No images found</div>
      )}

      {!loading && images && images?.length > 0 && (
        <>
          <div className={`${baseClass}__results`}>
            {images.map((data) => (
              <div key={data.id} className={`${baseClass}__card`}>
                <button
                  type="button"
                  className={`${baseClass}__button`}
                  onClick={() => selectImage(data.urls.original, data.urls?.downloadLocation)}
                  style={{ backgroundColor: data.color }}
                >
                  <img
                    src={data.urls.view}
                    alt={data.alt}
                    width={data.width}
                    height={data.height}
                  />
                </button>
                <div className={`${baseClass}__topOverlay`}>
                  {data.likes !== undefined && (
                    <button
                      type="button"
                      className={`${baseClass}__likes`}
                      onMouseEnter={() => setShow(true)}
                      onMouseLeave={() => setShow(false)}
                      onFocus={() => setShow(true)}
                      onBlur={() => setShow(false)}
                    >
                      <HeartIcon />
                      <Tooltip position="bottom" alignCaret="center" show={show}>
                        {data.likes} likes
                      </Tooltip>
                    </button>
                  )}
                  <a
                    className={`${baseClass}__download`}
                    href={data.urls.download}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkIcon />
                  </a>
                </div>
                <div className={`${baseClass}__bottomOverlay`}>
                  <a
                    className={`${baseClass}__attribution`}
                    href={data.attribution.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data.avatar ? (
                      <img
                        className={`${baseClass}__avatar`}
                        src={data.avatar}
                        alt={data.attribution.name}
                        width={24}
                        height={24}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className={`${baseClass}__avatarFallback`} aria-hidden />
                    )}
                    {data.attribution.name}
                  </a>
                </div>
              </div>
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
                onChange={(page: number) => getPhotos(page)}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
