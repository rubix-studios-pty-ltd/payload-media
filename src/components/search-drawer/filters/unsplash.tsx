import { Select } from '@payloadcms/ui'
import React from 'react'

import {
  type ProviderFilters,
  type ProviderOption,
  UnsplashColours,
  UnsplashOrientation,
} from '../../../types.js'

type UnsplashFiltersProps = {
  filters: ProviderFilters
  setFilters: React.Dispatch<React.SetStateAction<ProviderFilters | null>>
  baseClass: string
}

export const UnsplashFilters = ({ filters, setFilters, baseClass }: UnsplashFiltersProps) => {
  if (filters?.provider !== 'unsplash') return null

  return (
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
  )
}
