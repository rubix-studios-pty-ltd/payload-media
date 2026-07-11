'use client'

import React, { useCallback } from 'react'
import { Button, Drawer, useConfig, useModal, useUploadControls } from '@payloadcms/ui'

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
      <Button buttonStyle="pill" onClick={() => openModal(drawerSlug)} size="small">
        Search media
      </Button>
      <Drawer slug={drawerSlug}>
        <SearchDrawer
          api={config.routes.api}
          onSelect={handleSearchSubmit}
          serverURL={config.serverURL}
        />
      </Drawer>
    </>
  )
}
