import type React from 'react'
import { Select } from '@payloadcms/ui'

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
        isClearable
        isSearchable={false}
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
        options={PixabayCategories}
        placeholder="Category"
        value={PixabayCategories.find((o) => o.value === filters.options.category)}
      />

      {mediaType !== 'video' && (
        <>
          <Select
            isClearable
            isSearchable={false}
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
            options={PixabayImageType}
            placeholder="Type"
            value={PixabayImageType.find((o) => o.value === filters.options.image_type)}
          />

          <Select
            isClearable
            isSearchable={false}
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
            options={PixabayColours}
            placeholder="Colour"
            value={PixabayColours.find((o) => o.value === filters.options.colors)}
          />

          <Select
            isClearable
            isSearchable={false}
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
            options={PixabayOrientation}
            placeholder="Orientation"
            value={PixabayOrientation.find((o) => o.value === filters.options.orientation)}
          />
        </>
      )}

      <Select
        isClearable
        isSearchable={false}
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
        options={PixabayOrder}
        placeholder="Order"
        value={PixabayOrder.find((o) => o.value === filters.options.order)}
      />
    </div>
  )
}
