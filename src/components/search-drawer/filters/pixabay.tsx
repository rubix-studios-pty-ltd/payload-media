import { Select } from '@payloadcms/ui'
import React from 'react'
import {
  PixabayCategories,
  PixabayColours,
  PixabayImageType,
  PixabayOrder,
  PixabayOrientation,
  type ProviderFilters,
  type ProviderOption,
} from '../../../types.js'

type PixabayFiltersProps = {
  filters: ProviderFilters
  mediaType: 'image' | 'video'
  setFilters: React.Dispatch<React.SetStateAction<ProviderFilters | null>>
  baseClass: string
}

export const PixabayFilters = ({
  filters,
  mediaType,
  setFilters,
  baseClass,
}: PixabayFiltersProps) => {
  if (filters?.provider !== 'pixabay') return null

  return (
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

      {mediaType !== 'video' && (
        <>
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
        </>
      )}

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
  )
}
