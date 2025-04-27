import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://tronboarding.com"

  // Core pages
  const routes = [
    "",
    "/about",
    "/boards",
    "/contact",
    "/legal",
    "/login",
    "/prestige",
    "/privacy",
    "/profile",
    "/signup",
    "/terms",
    "/tokens",
    "/leaderboard",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }))

  return routes
}
