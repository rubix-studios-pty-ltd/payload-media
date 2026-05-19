import { LinkIcon, Tooltip } from '@payloadcms/ui'
import React, { useState } from 'react'

import { type ProviderResult } from '../../../types.js'
import { HeartIcon } from './heart.js'

type VideoCardProps = {
  data: ProviderResult
  baseClass: string
}

export const VideoCard = ({ data, baseClass }: VideoCardProps) => {
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
