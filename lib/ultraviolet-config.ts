export const UV_CONFIG = {
  prefix: "/uv/",
  bare: "/bare/",
  encodeUrl: (url: string) => {
    return `${UV_CONFIG.prefix}${btoa(url)}`
  },
  decodeUrl: (encoded: string) => {
    if (encoded.startsWith(UV_CONFIG.prefix)) {
      return atob(encoded.substring(UV_CONFIG.prefix.length))
    }
    return encoded
  },
}
