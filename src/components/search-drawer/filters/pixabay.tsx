import React, { type Dispatch, type SetStateAction } from 'react'
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

type Props = {
  filters: ProviderFilters
  mediaType: 'image' | 'video'
  setFilters: Dispatch<SetStateAction<ProviderFilters | null>>
  baseClass: string
}

export const PixabayFilters = ({ filters, mediaType, setFilters, baseClass }: Props) => {
  if (filters.provider !== 'pixabay') return null

  return (
    <div className={`${baseClass}__filters`}>
      <Select
        isClearable
        isSearchable={false}
        onChange={(opt) =>
          setFilters((prev) =>
            prev?.provider === 'pixabay'
              ? {
                  ...prev,
                  options: {
                    ...prev.options,
                    category: (opt as ProviderOption | null)?.value,
                  },
                }
              : prev
          )
        }
        options={PixabayCategories}
        placeholder="Category"
        value={PixabayCategories.find((option) => option.value === filters.options.category)}
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
                      ...prev,
                      options: {
                        ...prev.options,
                        image_type: (opt as ProviderOption | null)?.value,
                      },
                    }
                  : prev
              )
            }
            options={PixabayImageType}
            placeholder="Type"
            value={PixabayImageType.find((option) => option.value === filters.options.image_type)}
          />

          <Select
            isClearable
            isSearchable={false}
            onChange={(opt) =>
              setFilters((prev) =>
                prev?.provider === 'pixabay'
                  ? {
                      ...prev,
                      options: {
                        ...prev.options,
                        colors: (opt as ProviderOption | null)?.value,
                      },
                    }
                  : prev
              )
            }
            options={PixabayColours}
            placeholder="Colour"
            value={PixabayColours.find((option) => option.value === filters.options.colors)}
          />

          <Select
            isClearable
            isSearchable={false}
            onChange={(opt) =>
              setFilters((prev) =>
                prev?.provider === 'pixabay'
                  ? {
                      ...prev,
                      options: {
                        ...prev.options,
                        orientation: (opt as ProviderOption | null)?.value,
                      },
                    }
                  : prev
              )
            }
            options={PixabayOrientation}
            placeholder="Orientation"
            value={PixabayOrientation.find(
              (option) => option.value === filters.options.orientation
            )}
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
                  ...prev,
                  options: {
                    ...prev.options,
                    order: (opt as ProviderOption | null)?.value,
                  },
                }
              : prev
          )
        }
        options={PixabayOrder}
        placeholder="Order"
        value={PixabayOrder.find((option) => option.value === filters.options.order)}
      />
    </div>
  )
}
