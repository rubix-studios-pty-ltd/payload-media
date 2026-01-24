import { type ImageConfig } from './types.js'

export const defaultPluginOptions: Required<ImageConfig> = {
  disabled: false,
  unsplash: '',
  pexels: '',
  pixabay: '',
  openverse: '',
  access: ({ req: { user } }) => Boolean(user),
}
