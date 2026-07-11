import type React from 'react'
import { Select } from '@payloadcms/ui'

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
          isClearable
          isSearchable={false}
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
          options={PexelsColours}
          placeholder="Colour"
          value={PexelsColours.find((o) => o.value === filters.options.color)}
        />
      )}

      <Select
        isClearable
        isSearchable={false}
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
        options={mediaType === 'video' ? PexelsVideoSize : PexelsSize}
        placeholder="Size"
        value={(mediaType === 'video' ? PexelsVideoSize : PexelsSize).find(
          (o) => o.value === filters.options.size
        )}
      />

      <Select
        isClearable
        isSearchable={false}
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
        options={PexelsOrientation}
        placeholder="Orientation"
        value={PexelsOrientation.find((o) => o.value === filters.options.orientation)}
      />
    </div>
  )
}
