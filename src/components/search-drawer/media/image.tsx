import { LinkIcon, Tooltip } from '@payloadcms/ui'
import React, { useState } from 'react'
import { type ProviderResult } from '../../../types.js'
import { HeartIcon } from './heart.jsx'

type ImageCardProps = {
  data: ProviderResult
  baseClass: string
  onSelect: (url: string, download?: string) => void
}

export const ImageCard = ({ data, baseClass, onSelect }: ImageCardProps) => {
  const [show, setShow] = useState(false)

  return (
    <div key={data.id} className={`${baseClass}__card`}>
      <button
        type="button"
        className={`${baseClass}__button`}
        onClick={() => onSelect(data.urls.original, data.urls?.downloadLocation)}
        style={{ backgroundColor: data.color }}
      >
        <img src={data.urls.view} alt={data.alt} width={data.width} height={data.height} />
      </button>
      <div className={`${baseClass}__topOverlay`}>
        {data.likes !== undefined && (
          <button
            type="button"
            className={`${baseClass}__likes`}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
            onFocus={() => setShow(true)}
            onBlur={() => setShow(false)}
          >
            <HeartIcon />
            <Tooltip position="bottom" alignCaret="center" show={show}>
              {data.likes} likes
            </Tooltip>
          </button>
        )}
        <a
          className={`${baseClass}__download`}
          href={data.urls.download}
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkIcon />
        </a>
      </div>
      <div className={`${baseClass}__bottomOverlay`}>
        <a
          className={`${baseClass}__attribution`}
          href={data.attribution.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {data.avatar ? (
            <img
              className={`${baseClass}__avatar`}
              src={data.avatar}
              alt={data.attribution.name}
              width={24}
              height={24}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className={`${baseClass}__avatarFallback`} aria-hidden />
          )}
          {data.attribution.name}
        </a>
      </div>
    </div>
  )
}
