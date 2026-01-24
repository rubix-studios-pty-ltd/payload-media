import type { SVGProps } from 'react'
import React from 'react'

export function HeartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <path
        d="M13.91 6.75c-1.17 2.25-4.3 5.31-6.07 6.94a.52.52 0 0 1-.67 0C5.39 12.06 2.26 9 1.09 6.75-1.48 1.8 5-1.5 7.5 3.45 10-1.5 16.48 1.8 13.91 6.75z"
        fill="currentColor"
      />
    </svg>
  )
}
