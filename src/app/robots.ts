import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/giris",
          "/kayit",
          "/uzman/giris",
          "/uzman/kayit",
          "/uzman/dashboard",
          "/uzman/profil",
          "/uzman/belgeler",
          "/uzman/musaitlik",
          "/uzman/talepler",
          "/uzman/blog",
          "/uzman/bildirimler",
          "/profilim",
          "/taleplerim",
          "/testlerim",
          "/sifre-sifirla",
          "/api/",
        ],
      },
    ],
    sitemap: "https://yecamer.com.tr/sitemap.xml",
  };
}
