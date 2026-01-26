'use client'

import { LinkIcon, Pagination, SearchFilter, Select, Tooltip, toast } from '@payloadcms/ui'
import React, { useCallback, useEffect, useState } from 'react'
import {
  PexelsColours,
  type PexelsFilters,
  PexelsOrientation,
  PexelsSize,
  PixabayCategories,
  PixabayColours,
  type PixabayFilters,
  PixabayImageType,
  PixabayOrder,
  PixabayOrientation,
  type ProviderResult,
  UnsplashColours,
  type UnsplashFilters,
  UnsplashOrientation,
} from '../../types.js'
import { fetchCache } from '../../utils/fetchCache.js'
import { HeartIcon } from '../SearchImages/heart.js'
import './style.css'

const baseClass = 'search-images'

export const previewImageDrawerSlug = 'preview-image'

type ProviderOption = {
  label: string
  value: string
}

type SearchImagesProps = {
  serverURL: string
  api: string
  onSelect: (value: string) => void
}

export const SearchImages = (props: SearchImagesProps) => {
  const { serverURL, api, onSelect } = props

  const [providerOptions, setProviderOptions] = useState<ProviderOption[]>([])
  const [selectedProvider, setSelectedProvider] = useState<ProviderOption | null>(null)
  const [unsplashFilters, setUnsplashFilters] = useState<UnsplashFilters>({})
  const [pexelsFilters, setPexelsFilters] = useState<PexelsFilters>({})
  const [pixabayFilters, setPixabayFilters] = useState<PixabayFilters>({})

  const [images, setImages] = useState<ProviderResult[] | null>(null)
  const [totalPages, setTotalPages] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState<number | null>(null)

  const [loading, setLoading] = useState(true)
  const [show, setShow] = useState(false)
  const [value, setValue] = useState('')

  const addDefaultError = useCallback(() => {
    toast.error('Something went wrong.')
  }, [])

  const resetImages = useCallback(() => {
    setImages(null)
    setTotalPages(null)
    setCurrentPage(1)
  }, [])

  const getProviderOptions = useCallback(async () => {
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

      setProviderOptions(providers)
      setSelectedProvider(providers[0])
    } catch {
      setLoading(false)
      addDefaultError()
    }
  }, [serverURL, api, addDefaultError])

  const buildFeaturedParams = useCallback(() => {
    const params = new URLSearchParams()

    if (selectedProvider?.value === 'unsplash') {
      if (unsplashFilters.color) params.set('color', unsplashFilters.color)
      if (unsplashFilters.orientation) params.set('orientation', unsplashFilters.orientation)
    }

    if (selectedProvider?.value === 'pexels') {
      if (pexelsFilters.color) params.set('color', pexelsFilters.color)
      if (pexelsFilters.orientation) params.set('orientation', pexelsFilters.orientation)
      if (pexelsFilters.size) params.set('size', pexelsFilters.size)
    }

    if (selectedProvider?.value === 'pixabay') {
      if (pixabayFilters.category) params.set('category', pixabayFilters.category)
      if (pixabayFilters.image_type) params.set('image_type', pixabayFilters.image_type)
      if (pixabayFilters.order) params.set('order', pixabayFilters.order)
      if (pixabayFilters.orientation) params.set('orientation', pixabayFilters.orientation)
      if (pixabayFilters.colors) params.set('colors', pixabayFilters.colors)
    }

    const query = params.toString()
    return query ? `?${query}` : ''
  }, [selectedProvider?.value, unsplashFilters, pexelsFilters, pixabayFilters])

  const getFeaturedPhotos = useCallback(async () => {
    if (!selectedProvider?.value) return

    try {
      setLoading(true)
      resetImages()

      const json = await fetchCache(
        `${serverURL}${api}/providers/${selectedProvider?.value}/featured${buildFeaturedParams()}`
      )

      if (json.error) return toast.error(json.error)

      setImages(json.data.images)
    } catch {
      addDefaultError()
      resetImages()
    } finally {
      setLoading(false)
    }
  }, [resetImages, serverURL, api, selectedProvider?.value, addDefaultError, buildFeaturedParams])

  const buildQueryParams = useCallback(
    (page = 1) => {
      const params = new URLSearchParams()
      params.set('query', value)
      params.set('page', String(page))

      if (selectedProvider?.value === 'unsplash') {
        if (unsplashFilters.color) params.set('color', unsplashFilters.color)
        if (unsplashFilters.orientation) params.set('orientation', unsplashFilters.orientation)
      }

      if (selectedProvider?.value === 'pexels') {
        if (pexelsFilters.color) params.set('color', pexelsFilters.color)
        if (pexelsFilters.orientation) params.set('orientation', pexelsFilters.orientation)
        if (pexelsFilters.size) params.set('size', pexelsFilters.size)
      }

      if (selectedProvider?.value === 'pixabay') {
        if (pixabayFilters.category) params.set('category', pixabayFilters.category)
        if (pixabayFilters.image_type) params.set('image_type', pixabayFilters.image_type)
        if (pixabayFilters.order) params.set('order', pixabayFilters.order)
        if (pixabayFilters.orientation) params.set('orientation', pixabayFilters.orientation)
        if (pixabayFilters.colors) params.set('colors', pixabayFilters.colors)
      }

      return params.toString()
    },
    [value, selectedProvider?.value, unsplashFilters, pexelsFilters, pixabayFilters]
  )

  const getPhotos = useCallback(
    async (page = 1) => {
      try {
        setLoading(true)
        resetImages()

        const json = await fetchCache(
          `${serverURL}${api}/providers/${selectedProvider?.value}/search?${buildQueryParams(page)}`
        )

        if (json.error) return toast.error(json.error)

        setImages(json.data.images)
        setTotalPages(json.data.totalPages)
        setCurrentPage(page)
      } catch {
        addDefaultError()
        resetImages()
      } finally {
        setLoading(false)
      }
    },
    [resetImages, serverURL, api, selectedProvider?.value, addDefaultError, buildQueryParams]
  )

  const handleSearchFilterChange = useCallback((search: string) => {
    setValue(search)
  }, [])

  const handleSelectChange = useCallback((select: ProviderOption) => {
    setSelectedProvider(select)
  }, [])

  const handleSelect = async (url: string, download?: string) => {
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

  useEffect(() => {
    if (!selectedProvider) {
      void getProviderOptions()
    }
  }, [getProviderOptions, selectedProvider])

  useEffect(() => {
    if (!selectedProvider?.value) return
    void getFeaturedPhotos()
  }, [selectedProvider, getFeaturedPhotos])

  return (
    <div className={baseClass}>
      <div className={`${baseClass}__fields`}>
        <SearchFilter label="" handleChange={handleSearchFilterChange} />
        <Select
          options={providerOptions}
          value={selectedProvider as ProviderOption}
          onChange={(value) => handleSelectChange(value as ProviderOption)}
          isClearable={false}
          isSearchable={false}
          isCreatable={false}
        />
      </div>

      {selectedProvider?.value === 'pexels' && (
        <div className={`${baseClass}__filters`}>
          <Select
            options={PexelsColours}
            value={PexelsColours.find((o) => o.value === pexelsFilters.color)}
            onChange={(opt) =>
              setPexelsFilters((prev) => ({
                ...prev,
                color: (opt as ProviderOption)?.value,
              }))
            }
            isClearable={true}
            isSearchable={false}
            placeholder="Select color..."
          />

          <Select
            options={PexelsSize}
            value={PexelsSize.find((o) => o.value === pexelsFilters.size)}
            onChange={(opt) =>
              setPexelsFilters((prev) => ({
                ...prev,
                size: (opt as ProviderOption)?.value,
              }))
            }
            isClearable={true}
            isSearchable={false}
            placeholder="Select size..."
          />

          <Select
            options={PexelsOrientation}
            value={PexelsOrientation.find((o) => o.value === pexelsFilters.orientation)}
            onChange={(opt) =>
              setPexelsFilters((prev) => ({
                ...prev,
                orientation: (opt as ProviderOption)?.value,
              }))
            }
            isClearable={true}
            isSearchable={false}
            placeholder="Select orientation..."
          />
        </div>
      )}

      {selectedProvider?.value === 'pixabay' && (
        <div className={`${baseClass}__filters`}>
          <Select
            options={PixabayCategories}
            value={PixabayCategories.find((o) => o.value === pixabayFilters.category)}
            onChange={(opt) =>
              setPixabayFilters((prev) => ({
                ...prev,
                category: (opt as ProviderOption)?.value,
              }))
            }
            isClearable={true}
            isSearchable={false}
            placeholder="Select category..."
          />

          <Select
            options={PixabayImageType}
            value={PixabayImageType.find((o) => o.value === pixabayFilters.image_type)}
            onChange={(opt) =>
              setPixabayFilters((prev) => ({
                ...prev,
                image_type: (opt as ProviderOption)?.value,
              }))
            }
            isClearable={true}
            isSearchable={false}
            placeholder="Select type..."
          />

          <Select
            options={PixabayColours}
            value={PixabayColours.find((o) => o.value === pixabayFilters.colors)}
            onChange={(opt) =>
              setPixabayFilters((prev) => ({
                ...prev,
                colors: (opt as ProviderOption)?.value,
              }))
            }
            isClearable={true}
            isSearchable={false}
            placeholder="Select color..."
          />

          <Select
            options={PixabayOrientation}
            value={PixabayOrientation.find((o) => o.value === pixabayFilters.orientation)}
            onChange={(opt) =>
              setPixabayFilters((prev) => ({
                ...prev,
                orientation: (opt as ProviderOption)?.value,
              }))
            }
            isClearable={true}
            isSearchable={false}
            placeholder="Select orientation..."
          />

          <Select
            options={PixabayOrder}
            value={PixabayOrder.find((o) => o.value === pixabayFilters.order)}
            onChange={(opt) =>
              setPixabayFilters((prev) => ({
                ...prev,
                order: (opt as ProviderOption)?.value,
              }))
            }
            isClearable={true}
            isSearchable={false}
            placeholder="Select order..."
          />
        </div>
      )}
      {selectedProvider?.value === 'unsplash' && (
        <div className={`${baseClass}__filters`}>
          <Select
            options={UnsplashColours}
            value={UnsplashColours.find((o) => o.value === unsplashFilters.color)}
            onChange={(opt) =>
              setUnsplashFilters((prev) => ({
                ...prev,
                color: (opt as ProviderOption)?.value,
              }))
            }
            isClearable={true}
            isSearchable={false}
            placeholder="Select color..."
          />

          <Select
            options={UnsplashOrientation}
            value={UnsplashOrientation.find((o) => o.value === unsplashFilters.orientation)}
            onChange={(opt) =>
              setUnsplashFilters((prev) => ({
                ...prev,
                orientation: (opt as ProviderOption)?.value,
              }))
            }
            isClearable={true}
            isSearchable={false}
            placeholder="Select orientation..."
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
                  onClick={() => handleSelect(data.urls.original, data.urls?.downloadLocation)}
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
