import React, { useState } from 'react'
import { LinkIcon, Tooltip } from '@payloadcms/ui'

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
    <div className={`${baseClass}__video`} key={data.id}>
      <video
        controls
        poster={data.urls.view}
        preload="metadata"
        src={data.urls.original}
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
          rel="noopener noreferrer"
          target="_blank"
        >
          {data.avatar && (
            <img
              alt={data.attribution.name}
              className={`${baseClass}__avatar`}
              height={24}
              loading="lazy"
              referrerPolicy="no-referrer"
              src={data.avatar}
              width={24}
            />
          )}
          {data.attribution.name}
        </a>
        <div className={`${baseClass}__actions`}>
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
          <button
            className={`${baseClass}__add`}
            onClick={() => onSelect?.(data.urls.original, data.urls.download)}
            type="button"
          >
            <PlusIcon />
          </button>

          <a
            className={`${baseClass}__download`}
            href={data.urls.download}
            rel="noopener noreferrer"
            target="_blank"
          >
            <LinkIcon />
          </a>
        </div>
      </div>
    </div>
  )
}
