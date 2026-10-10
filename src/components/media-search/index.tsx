'use client'

import React, { useCallback } from 'react'
import { Button, Drawer, useConfig, useModal, useUploadControls } from '@payloadcms/ui'

import { SearchDrawer } from '../search-drawer/index.js'

export const drawerSlug = 'payload-media-search'

export const MediaSearch = () => {
  const { config } = useConfig()
  const { setUploadControlFileUrl } = useUploadControls()
  const { openModal, closeModal } = useModal()

  const handleSubmit = useCallback(
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

      <Button buttonStyle="secondary" onClick={() => openModal(drawerSlug)} size="medium">
        Search media
      </Button>

      <Drawer slug={drawerSlug} title="Media">
        <SearchDrawer
          api={config.routes.api}
          onSelect={handleSubmit}
          serverURL={config.serverURL}
        />
      </Drawer>
    </>
  )
}
