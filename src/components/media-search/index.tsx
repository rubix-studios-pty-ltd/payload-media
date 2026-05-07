'use client'

import { Button, Drawer, useConfig, useModal, useUploadControls } from '@payloadcms/ui'
import React, { useCallback } from 'react'

import { SearchDrawer } from '../search-drawer/index.js'

export const drawerSlug = 'payload-media-search'

export const MediaSearch = () => {
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
        Search media
      </Button>
      <Drawer slug={drawerSlug}>
        <SearchDrawer
          serverURL={config.serverURL}
          api={config.routes.api}
          onSelect={handleSearchSubmit}
        />
      </Drawer>
    </>
  )
}
