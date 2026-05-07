export const getMediaType = (value: unknown): 'image' | 'video' | undefined => {
  if (value === 'image' || value === 'video') return value

  return undefined
}
