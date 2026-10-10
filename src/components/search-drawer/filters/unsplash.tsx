import React, { type Dispatch, type SetStateAction } from 'react'
import { Select } from '@payloadcms/ui'

import {
  type ProviderFilters,
  type ProviderOption,
  UnsplashColours,
  UnsplashOrientation,
} from '../../../types.js'

type Props = {
  filters: ProviderFilters
  setFilters: Dispatch<SetStateAction<ProviderFilters | null>>
  baseClass: string
}

export const UnsplashFilters = ({ filters, setFilters, baseClass }: Props) => {
  if (filters.provider !== 'unsplash') return null

  return (
    <div className={`${baseClass}__filters`}>
      <Select
        isClearable
        isSearchable={false}
        onChange={(opt) =>
          setFilters((prev) =>
            prev?.provider === 'unsplash'
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
        options={UnsplashColours}
        placeholder="Colour"
        value={UnsplashColours.find((option) => option.value === filters.options.color)}
      />

      <Select
        isClearable
        isSearchable={false}
        onChange={(opt) =>
          setFilters((prev) =>
            prev?.provider === 'unsplash'
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
        options={UnsplashOrientation}
        placeholder="Orientation"
        value={UnsplashOrientation.find((option) => option.value === filters.options.orientation)}
      />
    </div>
  )
}
