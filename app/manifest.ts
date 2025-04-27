import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TRON Board",
    short_name: "TRON Board",
    description: "TRON-first crypto message board for alpha, bounties, and on-chain predictions.",
    start_url: "/",
    display: "standalone",
    background_color: "#121212",
    theme_color: "#00a0e9",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
