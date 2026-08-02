import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ezedin Mohammed — Software Engineer Portfolio",
    short_name: "Ezedin Moh",
    description:
      "Software Engineer from Ethiopia crafting immersive digital experiences with modern web technologies.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#1a1a2e",
    theme_color: "#1a1a2e",
    icons: [
      {
        src: "/icon.svg",
        sizes: "192x192 512x512",
        type: "image/svg+xml",
        purpose: "any maskable",
      },
    ],
  };
}
