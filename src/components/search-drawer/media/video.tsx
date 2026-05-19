import { LinkIcon, Tooltip } from '@payloadcms/ui'
import React, { useState } from 'react'

import { type ProviderResult } from '../../../types.js'
import { HeartIcon } from './heart.js'
import { PlusIcon } from './plus.js'

type VideoCardProps = {
  data: ProviderResult
  baseClass: string
  onSelect: (url: string, download?: string) => void
}

export const VideoCard = ({ data, baseClass, onSelect }: VideoCardProps) => {
  const [show, setShow] = useState(false)

  return (
    <div key={data.id} className={`${baseClass}__video`}>
      <video
        src={data.urls.original}
        poster={data.urls.view}
        controls
        preload="metadata"
        style={{
          width: '100%',
          height: '100%',
          aspectRatio: `${data.width} / ${data.height}`,
          objectFit: 'cover',
          display: 'block',
        }}
      />
      <div className={`${baseClass}__topOverlay`}>
        <a
          className={`${baseClass}__attribution`}
          href={data.attribution.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {data.avatar && (
            <img
              className={`${baseClass}__avatar`}
              src={data.avatar}
              alt={data.attribution.name}
              width={24}
              height={24}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          )}
          {data.attribution.name}
        </a>
        <div className={`${baseClass}__actions`}>
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
          <button
            type="button"
            className={`${baseClass}__add`}
            onClick={() => onSelect?.(data.urls.original, data.urls.download)}
          >
            <PlusIcon />
          </button>

          <a
            className={`${baseClass}__download`}
            href={data.urls.download}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkIcon />
          </a>
        </div>
      </div>
    </div>
  )
}
