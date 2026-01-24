'use client'

import { Button, Drawer, useConfig, useModal, useUploadControls } from '@payloadcms/ui'
import React, { useCallback } from 'react'

import { SearchImages } from '../SearchImages/index.js'

export const drawerSlug = 'payload-image-search'

export const ImageSearch = () => {
  const { config } = useConfig()
  const { setUploadControlFileUrl } = useUploadControls()
  const { openModal, closeModal } = useModal()

  const handleSearchSubmit = useCallback(
    (url: string) => {
      if (!url) return

      setUploadControlFileUrl(url)
      closeModal(drawerSlug)
    },
    [setUploadControlFileUrl, closeModal]
  )

  return (
    <>
      <span className="file-field__orText">Or</span>
      <Button buttonStyle="pill" size="small" onClick={() => openModal(drawerSlug)}>
        Search images
      </Button>
      <Drawer slug={drawerSlug}>
        <SearchImages
          serverURL={config.serverURL}
          api={config.routes.api}
          onSelect={handleSearchSubmit}
        />
      </Drawer>
    </>
  )
}
