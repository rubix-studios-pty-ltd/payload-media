# Payload CMS Media Plugin

Payload CMS Media Plugin adds stock image and video search to the Payload Admin interface. Search Unsplash, Pexels, and Pixabay, apply provider-specific filters, preview results, and import selected media into upload collections.

![Stock image selection](https://github.com/user-attachments/assets/80ecb11f-65eb-4f58-a422-df9b170ac5d2)

![Stock video selection](https://github.com/user-attachments/assets/28044aaa-7144-4b66-9d5f-afc58d7939d5)

## Compatibility

The plugin maintains two release lines, with Payload CMS v4 as the primary release and Payload CMS v3 maintained separately.

| Payload CMS | Plugin version | Release branch | npm dist-tag |
| --- | --- | --- | --- |
| v4 | 2.x | `main` | `latest` |
| v3 | 1.x | `payload-v3` | `payload-v3` |

Install the release matching your Payload version. The `latest` tag targets Payload v4 after the v4 release is published.

## Installation

### Payload CMS v4

Install the latest release.

```sh
pnpm add @rubixstudios/payload-media
```

### Payload CMS v3

Install from the dedicated v3 release channel.

```sh
pnpm add @rubixstudios/payload-media@payload-v3
```

## Configuration

Register `mediaPlugin` in `payload.config.ts`. The plugin uses the same configuration options across both supported Payload versions.

```typescript
import { buildConfig } from 'payload'
import { mediaPlugin } from '@rubixstudios/payload-media'

export default buildConfig({
  plugins: [
    mediaPlugin({
      pexels: process.env.API_KEY_PEXELS,
      pixabay: process.env.API_KEY_PIXABAY,
      unsplash: process.env.API_KEY_UNSPLASH,
      access: ({ req: { user } }) => Boolean(user),
      disabled: false,
    }),
  ],
})
```

Provide an API key only for the providers you want to enable. Configured providers appear in the search interface. The plugin adds a **Search media** control to collections with uploads enabled.

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `pexels` | `string` | `''` | Pexels API key |
| `pixabay` | `string` | `''` | Pixabay API key |
| `unsplash` | `string` | `''` | Unsplash access key |
| `access` | Payload `Access` | Authenticated users | Controls who may use the media search endpoints |
| `disabled` | `boolean` | `false` | Disables plugin registration |

## Provider API keys

Obtain API credentials from the relevant provider.

- [Unsplash Developers](https://unsplash.com/developers)
- [Pexels API](https://www.pexels.com/api/)
- [Pixabay API](https://pixabay.com/api/docs/)

For Unsplash, use the application's **Access Key**, not its Secret Key. Keep credentials in server-side environment variables.

## Features

- Search stock images and videos inside Payload Admin upload collections.
- Search images from Unsplash, Pexels, and Pixabay, and videos from Pexels and Pixabay.
- Browse featured results or search by keyword.
- Refine searches with provider-specific controls, including colour, orientation, size, image type, category, and ordering where supported.
- Preview images and videos before selection.
- Import a selected asset using Payload's upload controls.
- Restrict access using a configurable Payload access function.
- Cache successful search responses in browser storage for 24 hours.

## Usage and liability

Media availability, licensing, attribution, and permitted uses depend on the source provider. Review the applicable provider terms and licence conditions before using imported assets.

Rubix Studios, its developers, and contributors bear no responsibility for how imported media is used.

## Support

For support or enquiries, contact [Rubix Studios](https://rubixstudios.com.au) or [rubixvi on LinkedIn](https://www.linkedin.com/in/rubixvi/). You can also [open an issue on GitHub](https://github.com/rubix-studios-pty-ltd/payload-media/issues).

## License

Distributed under the [MIT License](LICENSE).

## Author

[Rubix Studios](https://rubixstudios.com.au)

## Acknowledgments

This project is an independent implementation derived from [PayloadBites' Image Search](https://github.com/rilrom/payload-bites/tree/main/packages/image-search) by [Riley Langbein](https://github.com/rilrom), extended with provider-specific filters, video support, and Windows compatibility improvements.
