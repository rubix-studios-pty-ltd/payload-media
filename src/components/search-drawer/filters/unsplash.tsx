import type React from 'react'
import { Select } from '@payloadcms/ui'

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
        isClearable
        isSearchable={false}
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
        options={UnsplashColours}
        placeholder="Colour"
        value={UnsplashColours.find((o) => o.value === filters.options.color)}
      />

      <Select
        isClearable
        isSearchable={false}
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
        options={UnsplashOrientation}
        placeholder="Orientation"
        value={UnsplashOrientation.find((o) => o.value === filters.options.orientation)}
      />
    </div>
  )
}
