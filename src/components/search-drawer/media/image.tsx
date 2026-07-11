import React, { useState } from 'react'
import { LinkIcon, Tooltip } from '@payloadcms/ui'

import { type ProviderResult } from '../../../types.js'
import { HeartIcon } from './heart.js'

type ImageCardProps = {
  data: ProviderResult
  baseClass: string
  onSelect: (url: string, download?: string) => void
}

export const ImageCard = ({ data, baseClass, onSelect }: ImageCardProps) => {
  const [show, setShow] = useState(false)

  return (
    <div className={`${baseClass}__card`} key={data.id}>
      <button
        className={`${baseClass}__button`}
        onClick={() => onSelect(data.urls.original, data.urls?.downloadLocation)}
        style={{ backgroundColor: data.color }}
        type="button"
      >
        <img alt={data.alt} height={data.height} src={data.urls.view} width={data.width} />
      </button>
      <div className={`${baseClass}__topOverlay`}>
        {data.likes !== undefined && (
          <button
            className={`${baseClass}__likes`}
            onBlur={() => setShow(false)}
            onFocus={() => setShow(true)}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
            type="button"
          >
            <HeartIcon />
            <Tooltip alignCaret="center" position="bottom" show={show}>
              {data.likes} likes
            </Tooltip>
          </button>
        )}
        <a
          className={`${baseClass}__download`}
          href={data.urls.download}
          rel="noopener noreferrer"
          target="_blank"
        >
          <LinkIcon />
        </a>
      </div>
      <div className={`${baseClass}__bottomOverlay`}>
        <a
          className={`${baseClass}__attribution`}
          href={data.attribution.link}
          rel="noopener noreferrer"
          target="_blank"
        >
          {data.avatar ? (
            <img
              alt={data.attribution.name}
              className={`${baseClass}__avatar`}
              height={24}
              loading="lazy"
              referrerPolicy="no-referrer"
              src={data.avatar}
              width={24}
            />
          ) : (
            <div aria-hidden className={`${baseClass}__avatarFallback`} />
          )}
          {data.attribution.name}
        </a>
      </div>
    </div>
  )
}
