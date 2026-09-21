import pool from "./db";
import { ensureIndexes } from "./ensure-indexes";

type HomeCatalog = {
  categories: any[];
  desktopBanners: string[];
  mobileBanners: string[];
};

const cache = new Map<string, { at: number; data: HomeCatalog }>();
const TTL_MS = 45_000;

function bannerUrls(row: any | undefined): string[] {
  if (!row) return [];
  return [row.banner1_url, row.banner2_url, row.banner3_url].filter(Boolean);
}

export async function getHomeCatalog(locationTitle = ""): Promise<HomeCatalog> {
  ensureIndexes();
  const key = locationTitle || "_root";
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) {
    return hit.data;
  }

  const categorySql = locationTitle
    ? "SELECT id, title, type, image_url, zones_location FROM categories WHERE status = 'Active' AND zones_location LIKE ?"
    : "SELECT id, title, type, image_url, zones_location FROM categories WHERE status = 'Active'";
  const categoryParams = locationTitle ? [`%${locationTitle}%`] : [];

  const [catResult, servicesResult, desktopResult, mobileResult] = await Promise.allSettled([
    pool.query(categorySql, categoryParams),
    pool.query(
      "SELECT id, category_id, title, image_url, original_price, selling_price, rating FROM services"
    ),
    pool.query(
      "SELECT banner1_url, banner2_url, banner3_url FROM banners WHERE type = 'desktop' OR type IS NULL ORDER BY created_at DESC LIMIT 1"
    ),
    pool.query(
      "SELECT banner1_url, banner2_url, banner3_url FROM banners WHERE type = 'mobile' ORDER BY created_at DESC LIMIT 1"
    ),
  ]);

  const catRows: any[] =
    catResult.status === "fulfilled" ? ((catResult.value[0] as any[]) || []) : [];
  const allServices: any[] =
    servicesResult.status === "fulfilled" ? ((servicesResult.value[0] as any[]) || []) : [];
  const desktopRows: any[] =
    desktopResult.status === "fulfilled" ? ((desktopResult.value[0] as any[]) || []) : [];
  const mobileRows: any[] =
    mobileResult.status === "fulfilled" ? ((mobileResult.value[0] as any[]) || []) : [];

  const servicesByCategory = new Map<number, any[]>();
  for (const srv of allServices) {
    const list = servicesByCategory.get(srv.category_id) || [];
    list.push({
      ...srv,
      rating: srv.rating || "4.8",
      reviews: "120+",
    });
    servicesByCategory.set(srv.category_id, list);
  }

  const data: HomeCatalog = {
    categories: catRows.map((cat) => ({
      ...cat,
      services: servicesByCategory.get(cat.id) || [],
    })),
    desktopBanners: bannerUrls(desktopRows[0]),
    mobileBanners: bannerUrls(mobileRows[0]),
  };

  cache.set(key, { at: Date.now(), data });
  return data;
}
