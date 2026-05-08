import { type ProviderConfig } from './types.js'

export const defaultPluginOptions: Required<ProviderConfig> = {
  disabled: false,
  unsplash: '',
  pexels: '',
  pixabay: '',
  openverse: '',
  access: ({ req: { user } }) => Boolean(user),
}
