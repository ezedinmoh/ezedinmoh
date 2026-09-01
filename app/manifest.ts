import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ezedin Mohammed — Software Engineer Portfolio",
    short_name: "Ezedin Moh",
    description:
      "Software Engineer from Ethiopia crafting immersive digital experiences with modern web technologies.",
    start_url: "/",
    id: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#1a1a2e",
    theme_color: "#1a1a2e",
    categories: ["portfolio", "utilities", "productivity"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Projects",
        short_name: "Projects",
        description: "View software engineering projects",
        url: "/projects",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Contact",
        short_name: "Contact",
        description: "Get in touch with Ezedin Moh",
        url: "/contact",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Blog",
        short_name: "Blog",
        description: "Read technical articles and insights",
        url: "/blog",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Guestbook",
        short_name: "Guestbook",
        description: "Leave a message on the guestbook",
        url: "/guestbook",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
