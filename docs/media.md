# Media

Download and decrypt encrypted WhatsApp media files.

## Download media

```ts
import { downloadMedia } from "wazzapi";

const result = await downloadMedia(
  "https://example.com/media",
  "your-media-key",
  "image/jpeg",
  {
    file_name: "photo.jpg",
    file_sha256: "expected-plain-sha256-base64",
    file_enc_sha256: "expected-encrypted-sha256-base64",
  },
);

console.log(result.file_name);
console.log(result.mimetype);
console.log(result.file_size);
```

## `MediaDownloadResult`

- `content` — decrypted file contents as `Buffer`
- `mimetype` — MIME type passed to the downloader
- `file_name` — file name from options or fallback name
- `file_size` — decrypted content size in bytes

## Low-level helpers

If you need lower-level primitives, the SDK also exports:

- `_decryptWaMedia()` / `_decrypt_wa_media()`
- `_mediaInfoBytes()` / `_media_info_bytes()`
