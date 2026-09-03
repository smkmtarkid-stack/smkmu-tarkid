import { MetadataRoute } from "next";
import { siteConfig } from "@/constants/site";
import { mainNavigation } from "@/constants/navigation";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = mainNavigation.map((route) => ({
    url: `${siteConfig.url}${route.href}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route.href === "/" ? 1 : 0.8,
  }));

  // Add submenu routes (Profil pages)
  const profilRoute = mainNavigation.find((r) => r.label === "Profil");
  const subRoutes = profilRoute?.children?.map((child) => ({
    url: `${siteConfig.url}${child.href}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  })) || [];

  return [...routes, ...subRoutes];
}
