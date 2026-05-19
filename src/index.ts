import { type Config } from 'payload'

import { defaultPluginOptions } from './defaults.js'
import { providers } from './endpoints/index.js'
import { type ProviderConfig } from './types.js'

export const mediaPlugin =
  (pluginConfig: ProviderConfig = {}) =>
  (incomingConfig: Config): Config => {
    if (pluginConfig.disabled) return incomingConfig

    const mergedOptions: Required<ProviderConfig> = {
      ...defaultPluginOptions,
      ...pluginConfig,
    }

    const settings: Config = { ...incomingConfig }

    settings.custom = {
      ...(settings.custom || {}),
      providerAccess: mergedOptions.access,
      providerKeys: {
        pexels: mergedOptions.pexels,
        unsplash: mergedOptions.unsplash,
        pixabay: mergedOptions.pixabay,
      },
    }

    settings.collections = (settings.collections || []).map((collection) => {
      const upload = collection.upload
      if (!upload) return collection

      const uploadObj = upload === true ? {} : typeof upload === 'object' ? upload : undefined

      const modifiedCollection = {
        ...collection,
        upload: {
          ...(uploadObj || {}),
          admin: {
            ...(uploadObj?.admin || {}),
            components: {
              ...(uploadObj?.admin?.components || {}),
              controls: [
                ...(uploadObj?.admin?.components?.controls || []),
                '@rubixstudios/payload-images/client#MediaSearch',
              ],
            },
          },
        },
      }

      return modifiedCollection
    })

    settings.endpoints = [...(settings.endpoints || []), ...providers]

    return settings
  }
