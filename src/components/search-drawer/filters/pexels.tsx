import React, { type Dispatch, type SetStateAction } from 'react'
import { Select } from '@payloadcms/ui'

import {
  PexelsColours,
  PexelsOrientation,
  PexelsSize,
  PexelsVideoSize,
  type ProviderFilters,
  type ProviderOption,
} from '../../../types.js'

type Props = {
  filters: ProviderFilters
  mediaType: 'image' | 'video'
  setFilters: Dispatch<SetStateAction<ProviderFilters | null>>
  baseClass: string
}

export const PexelsFilters = ({ filters, mediaType, setFilters, baseClass }: Props) => {
  if (filters.provider !== 'pexels') return null

  const sizeOptions = mediaType === 'video' ? PexelsVideoSize : PexelsSize

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
                    ...prev,
                    options: {
                      ...prev.options,
                      color: (opt as ProviderOption | null)?.value,
                    },
                  }
                : prev
            )
          }
          options={PexelsColours}
          placeholder="Colour"
          value={PexelsColours.find((option) => option.value === filters.options.color)}
        />
      )}

      <Select
        isClearable
        isSearchable={false}
        onChange={(opt) =>
          setFilters((prev) =>
            prev?.provider === 'pexels'
              ? {
                  ...prev,
                  options: {
                    ...prev.options,
                    size: (opt as ProviderOption | null)?.value,
                  },
                }
              : prev
          )
        }
        options={sizeOptions}
        placeholder="Size"
        value={sizeOptions.find((option) => option.value === filters.options.size)}
      />

      <Select
        isClearable
        isSearchable={false}
        onChange={(opt) =>
          setFilters((prev) =>
            prev?.provider === 'pexels'
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
        options={PexelsOrientation}
        placeholder="Orientation"
        value={PexelsOrientation.find((option) => option.value === filters.options.orientation)}
      />
    </div>
  )
}
