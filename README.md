# PayloadCMS Image Search Plugin

Integrated Payload CMS plugin for stock image search across Unsplash, Pexels, and Pixabay, with filterable results and instant import.

This project is an independent implementation derived [PayloadBites' Image Search](https://github.com/rilrom/payload-bites/tree/main/packages/image-search) extended with provider-specific image filtering and improved Windows OS compatibility.

## Installation

```sh
pnpm add @rubixstudios/payload-images
```

```typescript
// payload.config.ts
import { buildConfig } from 'payload/config'
import { imagePlugin } from '@rubixstudios/payload-images'

export default buildConfig({
  plugins: [
    imagePlugin({
      disabled: false, // Optional, defaults to false
      access: ({ req: { user } }) => Boolean(user), // Image search access control
      pexels: process.env.API_KEY_PEXELS!,
      pixabay: process.env.API_KEY_PIXABAY!,
      unsplash: process.env.API_KEY_UNSPLASH!,
    }),
  ],
})
```

## Notes

API key can be obtained from the respective provider's website.

- [Unsplash](https://unsplash.com/developers)
- [Pexels](https://www.pexels.com/api/)
- [Pixabay](https://pixabay.com/api/docs/)

When using Unplash, utilise your Access Key for the API Token.

## Features

- Stock image search inside Payload Admin
- Providers: Unsplash, Pexels, Pixabay
- Provider-specific filters (color, orientation, size, type)
- Featured and keyword search modes
- One-click image import
- Permission-based access control

## Liability

Rubix Studios, its developers, and contributors bear no responsibility for how images are used.
Before using any provider, ensure you have reviewed and agreed to their terms and usage policies.

## Support

For support or inquiries:

- LinkedIn: [rubixvi](https://www.linkedin.com/in/rubixvi/)
- Website: [Rubix Studios](https://rubixstudios.com.au)

## Author

Rubix Studios Pty. Ltd.  
[https://rubixstudios.com.au](https://rubixstudios.com.au)

## Acknowledgments

- [Riley Langbein](https://github.com/rilrom)
