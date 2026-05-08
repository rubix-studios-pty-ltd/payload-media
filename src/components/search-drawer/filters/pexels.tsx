import { Select } from '@payloadcms/ui'
import React from 'react'
import {
  PexelsColours,
  PexelsOrientation,
  PexelsSize,
  PexelsVideoSize,
  type ProviderFilters,
  type ProviderOption,
} from '../../../types.js'

type PexelsFiltersProps = {
  filters: ProviderFilters
  mediaType: 'image' | 'video'
  setFilters: React.Dispatch<React.SetStateAction<ProviderFilters | null>>
  baseClass: string
}

export const PexelsFilters = ({
  filters,
  mediaType,
  setFilters,
  baseClass,
}: PexelsFiltersProps) => {
  if (filters?.provider !== 'pexels') return null

  return (
    <div className={`${baseClass}__filters`}>
      {mediaType !== 'video' && (
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
      )}

      <Select
        options={mediaType === 'video' ? PexelsVideoSize : PexelsSize}
        value={(mediaType === 'video' ? PexelsVideoSize : PexelsSize).find(
          (o) => o.value === filters.options.size
        )}
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
  )
}
