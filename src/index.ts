import { type Config } from 'payload'

import { defaultPluginOptions } from './defaults.js'
import { providers } from './endpoints/index.js'
import { type ProviderConfig } from './types.js'

export const mediaPlugin =
  (pluginConfig: ProviderConfig = {}) =>
  (incomingConfig: Config): Config => {
    if (pluginConfig.disabled) return incomingConfig

    const options: Required<ProviderConfig> = {
      ...defaultPluginOptions,
      ...pluginConfig,
    }

    const config: Config = { ...incomingConfig }

    config.custom = {
      ...(config.custom ?? {}),
      providerAccess: options.access,
      providerKeys: {
        pexels: options.pexels,
        unsplash: options.unsplash,
        pixabay: options.pixabay,
      },
    }

    config.collections = (config.collections ?? []).map((collection) => {
      const upload = collection.upload
      if (!upload) return collection

      const uploadConfig = upload === true ? {} : typeof upload === 'object' ? upload : undefined

      return {
        ...collection,
        upload: {
          ...(uploadConfig ?? {}),
          admin: {
            ...(uploadConfig?.admin ?? {}),
            components: {
              ...(uploadConfig?.admin?.components ?? {}),
              controls: [
                ...(uploadConfig?.admin?.components?.controls ?? []),
                '@rubixstudios/payload-media/client#MediaSearch',
              ],
            },
          },
        },
      }
    })

    config.endpoints = [...(config.endpoints ?? []), ...providers]

    return config
  }
