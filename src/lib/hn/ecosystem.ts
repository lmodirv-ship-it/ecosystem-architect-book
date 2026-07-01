/**
 * HN Ecosystem — Single Source of Truth for the 149 live properties.
 * Grouped by root domain, categorized by product family.
 * Per Architecture Bible Ch.05 (Applications) and Ch.06 (Data).
 */

export type HNPropertyCategory =
  | "platform"
  | "ai"
  | "database"
  | "driver"
  | "call-center"
  | "carwash"
  | "print"
  | "media"
  | "commerce"
  | "creator"
  | "clinic"
  | "finance"
  | "realestate"
  | "education"
  | "religion"
  | "cv"
  | "chat"
  | "brand";

export type HNProperty = {
  url: string;
  host: string;
  subdomain: string; // "" for apex, "www" normalized to apex sibling
  root: string; // e.g. "hn-groupe.net"
};

export type HNDomainGroup = {
  root: string;
  category: HNPropertyCategory;
  brand: string; // human name
  color: "violet" | "cyan" | "rose" | "mint" | "amber" | "sky";
  properties: HNProperty[];
};

const RAW_URLS = `
https://adkhar.hn-groupe.net
https://admin.hn-db.fun
https://admin.hn-driver.com
https://admin.hndriver.company
https://ai.hn-db.fun
https://ai.hn-groupe.org
https://api.hn-db.fun
https://api.hn-dbpro.com
https://api.slavacall-hiba.online
https://audit.hn-groupe.net
https://auth.hn-db.fun
https://blog.hn-groupe.org
https://build.hn-createur.com
https://build.hn-groupe.net
https://buildcv-ai.online
https://call.hndriver.company
https://callcentre.hn-driver.com
https://carwashpro.com
https://cinema.hn-groupe.org
https://client.hn-driver.com
https://client.hndriver.company
https://cloud.hn-createur.com
https://createur.hn-groupe.net
https://cv.hn-groupe.org
https://db.hn-createur.com
https://delivery.hn-driver.com
https://delivery.hndriver.company
https://driver.hn-driver.com
https://driver.hndriver.company
https://facturation.hn-createur.com
https://files.hn-db.fun
https://film.hn-createur.com
https://film.hn-groupe.net
https://generatin.hn-groupe.org
https://goupe-hn.com
https://goupe-hn.fun
https://goupe-hn.online
https://goupe-hn.site
https://groupe-hn.com
https://hiba-eco.com
https://hn-adkhar.life
https://hn-ai.online
https://hn-ai.pro
https://hn-ai.site
https://hn-ai.store
https://hn-bd.online
https://hn-carwash.online
https://hn-carwash.site
https://hn-chat.com
https://hn-createur.com
https://hn-db.fun
https://hn-db.hn-groupe.net
https://hn-dbpro.com
https://hn-driver.com
https://hn-driver.online
https://hn-driver.site
https://hn-finance.online
https://hn-finance.site
https://hn-groupe.fun
https://hn-groupe.net
https://hn-groupe.org
https://hn-groupe.pro
https://hn-groupe.site
https://hn-groupe.tech
https://hn-immo.com
https://hnapps.store
https://hnchat.net
https://hnclinik-ai.com
https://hnclinik.hn-groupe.net
https://hndriver.company
https://hndriver.hn-driver.com
https://imm.hn-groupe.net
https://lavagenizar.com
https://learn.hn-createur.com
https://learn.hn-groupe.tech
https://nawat.hn-groupe.net
https://owner.hn-db.fun
https://rfp.hn-groupe.net
https://ride.hn-driver.com
https://rule.hn-db.fun
https://search.hn-groupe.net
https://site.hn-groupe.tech
https://slavacall-hiba.com
https://slavacall-hiba.online
https://status.hn-db.fun
https://store.hn-groupe.net
https://stouk.hn-driver.com
https://studio.hn-createur.com
https://studio.hn-groupe.org
https://super.hn-driver.com
https://tanjaprint.com
https://tanjaprint.online
https://tender.hn-groupe.org
https://users.hn-db.fun
https://video.hn-createur.com
https://video.hn-groupe.net
https://video.hn-groupe.org
https://video.hn-groupe.tech
https://ws.hn-db.fun
https://www.ai.hn-groupe.org
https://www.audit.hn-groupe.net
https://www.buildcv-ai.online
https://www.createur.hn-groupe.net
https://www.film.hn-groupe.net
https://www.goupe-hn.com
https://www.goupe-hn.fun
https://www.goupe-hn.online
https://www.goupe-hn.site
https://www.groupe-hn.com
https://www.hiba-eco.com
https://www.hn-adkhar.life
https://www.hn-ai.online
https://www.hn-ai.pro
https://www.hn-ai.site
https://www.hn-ai.store
https://www.hn-bd.online
https://www.hn-carwash.online
https://www.hn-carwash.site
https://www.hn-chat.com
https://www.hn-createur.com
https://www.hn-db.fun
https://www.hn-dbpro.com
https://www.hn-driver.com
https://www.hn-driver.online
https://www.hn-driver.site
https://www.hn-finance.online
https://www.hn-finance.site
https://www.hn-groupe.fun
https://www.hn-groupe.net
https://www.hn-groupe.org
https://www.hn-groupe.site
https://www.hn-groupe.tech
https://www.hn-immo.com
https://www.hnapps.store
https://www.hnchat.net
https://www.hnclinik-ai.com
https://www.hndriver.company
https://www.lavagenizar.com
https://www.nawat.hn-groupe.net
https://www.rfp.hn-groupe.net
https://www.search.hn-groupe.net
https://www.slavacall-hiba.online
https://www.store.hn-groupe.net
https://www.tanjaprint.com
https://www.tender.hn-groupe.org
https://www.video.hn-createur.com
https://www.video.hn-groupe.net
https://www.video.hn-groupe.org
https://www.video.hn-groupe.tech
`;

// Registered domains (know which suffixes are the actual "root"). Anything
// longer than 2 labels is treated as a subdomain of one of these.
const KNOWN_ROOTS = new Set<string>([
  "hn-groupe.net",
  "hn-groupe.org",
  "hn-groupe.fun",
  "hn-groupe.pro",
  "hn-groupe.site",
  "hn-groupe.tech",
  "hn-db.fun",
  "hn-dbpro.com",
  "hn-driver.com",
  "hn-driver.online",
  "hn-driver.site",
  "hndriver.company",
  "hn-createur.com",
  "hn-ai.online",
  "hn-ai.pro",
  "hn-ai.site",
  "hn-ai.store",
  "hn-bd.online",
  "hn-carwash.online",
  "hn-carwash.site",
  "hn-chat.com",
  "hn-finance.online",
  "hn-finance.site",
  "hn-immo.com",
  "hn-adkhar.life",
  "hnapps.store",
  "hnchat.net",
  "hnclinik-ai.com",
  "goupe-hn.com",
  "goupe-hn.fun",
  "goupe-hn.online",
  "goupe-hn.site",
  "groupe-hn.com",
  "hiba-eco.com",
  "buildcv-ai.online",
  "carwashpro.com",
  "lavagenizar.com",
  "slavacall-hiba.com",
  "slavacall-hiba.online",
  "tanjaprint.com",
  "tanjaprint.online",
]);

function parseUrl(raw: string): HNProperty | null {
  const url = raw.trim();
  if (!url) return null;
  const host = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const noWww = host.replace(/^www\./, "");
  // Find the longest known root that is a suffix.
  let root = noWww;
  for (const r of KNOWN_ROOTS) {
    if (noWww === r || noWww.endsWith("." + r)) {
      if (r.length > root.length || root === noWww) root = r;
    }
  }
  const subdomain =
    noWww === root ? "" : noWww.slice(0, noWww.length - root.length - 1);
  return { url, host, subdomain, root };
}

const ALL: HNProperty[] = RAW_URLS.split("\n")
  .map(parseUrl)
  .filter((p): p is HNProperty => Boolean(p));

// Deduplicate: prefer non-www variant; count both as one property.
const byKey = new Map<string, HNProperty>();
for (const p of ALL) {
  const key = `${p.subdomain}|${p.root}`;
  const existing = byKey.get(key);
  if (!existing || existing.url.includes("www.")) byKey.set(key, p);
}
const UNIQUE: HNProperty[] = Array.from(byKey.values());

const META: Record<
  string,
  { category: HNPropertyCategory; brand: string; color: HNDomainGroup["color"] }
> = {
  "hn-groupe.net": { category: "platform", brand: "HN Groupe (Core)", color: "violet" },
  "hn-groupe.org": { category: "platform", brand: "HN Groupe (Org)", color: "violet" },
  "hn-groupe.fun": { category: "brand", brand: "HN Groupe (Fun)", color: "violet" },
  "hn-groupe.pro": { category: "brand", brand: "HN Groupe (Pro)", color: "violet" },
  "hn-groupe.site": { category: "brand", brand: "HN Groupe (Site)", color: "violet" },
  "hn-groupe.tech": { category: "brand", brand: "HN Groupe (Tech)", color: "violet" },
  "goupe-hn.com": { category: "brand", brand: "Goupe HN", color: "violet" },
  "goupe-hn.fun": { category: "brand", brand: "Goupe HN", color: "violet" },
  "goupe-hn.online": { category: "brand", brand: "Goupe HN", color: "violet" },
  "goupe-hn.site": { category: "brand", brand: "Goupe HN", color: "violet" },
  "groupe-hn.com": { category: "brand", brand: "Groupe HN", color: "violet" },

  "hn-db.fun": { category: "database", brand: "HN DB", color: "mint" },
  "hn-dbpro.com": { category: "database", brand: "HN DB Pro", color: "mint" },

  "hn-ai.online": { category: "ai", brand: "HN AI", color: "cyan" },
  "hn-ai.pro": { category: "ai", brand: "HN AI", color: "cyan" },
  "hn-ai.site": { category: "ai", brand: "HN AI", color: "cyan" },
  "hn-ai.store": { category: "ai", brand: "HN AI", color: "cyan" },
  "hnclinik-ai.com": { category: "clinic", brand: "HN Clinik AI", color: "rose" },
  "buildcv-ai.online": { category: "cv", brand: "BuildCV AI", color: "sky" },

  "hn-driver.com": { category: "driver", brand: "HN Driver", color: "amber" },
  "hn-driver.online": { category: "driver", brand: "HN Driver", color: "amber" },
  "hn-driver.site": { category: "driver", brand: "HN Driver", color: "amber" },
  "hndriver.company": { category: "driver", brand: "HN Driver (Company)", color: "amber" },

  "hn-createur.com": { category: "creator", brand: "HN Créateur", color: "rose" },

  "hn-chat.com": { category: "chat", brand: "HN Chat", color: "cyan" },
  "hnchat.net": { category: "chat", brand: "HN Chat", color: "cyan" },
  "hnapps.store": { category: "commerce", brand: "HN Apps Store", color: "sky" },

  "hn-carwash.online": { category: "carwash", brand: "HN Carwash", color: "sky" },
  "hn-carwash.site": { category: "carwash", brand: "HN Carwash", color: "sky" },
  "carwashpro.com": { category: "carwash", brand: "Carwash Pro", color: "sky" },
  "lavagenizar.com": { category: "carwash", brand: "Lavage Nizar", color: "sky" },

  "hn-finance.online": { category: "finance", brand: "HN Finance", color: "mint" },
  "hn-finance.site": { category: "finance", brand: "HN Finance", color: "mint" },
  "hn-bd.online": { category: "commerce", brand: "HN BD", color: "violet" },

  "hn-immo.com": { category: "realestate", brand: "HN Immo", color: "amber" },
  "hn-adkhar.life": { category: "religion", brand: "HN Adhkar", color: "mint" },

  "hiba-eco.com": { category: "commerce", brand: "Hiba Eco", color: "mint" },
  "slavacall-hiba.com": { category: "call-center", brand: "Slavacall Hiba", color: "rose" },
  "slavacall-hiba.online": { category: "call-center", brand: "Slavacall Hiba", color: "rose" },

  "tanjaprint.com": { category: "print", brand: "TanjaPrint", color: "amber" },
  "tanjaprint.online": { category: "print", brand: "TanjaPrint", color: "amber" },
};

const grouped = new Map<string, HNDomainGroup>();
for (const p of UNIQUE) {
  const meta =
    META[p.root] ?? { category: "brand" as const, brand: p.root, color: "violet" as const };
  const g = grouped.get(p.root) ?? {
    root: p.root,
    category: meta.category,
    brand: meta.brand,
    color: meta.color,
    properties: [],
  };
  g.properties.push(p);
  grouped.set(p.root, g);
}

// Sort properties: apex first, then alphabetical.
for (const g of grouped.values()) {
  g.properties.sort((a, b) => {
    if (a.subdomain === "" && b.subdomain !== "") return -1;
    if (b.subdomain === "" && a.subdomain !== "") return 1;
    return a.subdomain.localeCompare(b.subdomain);
  });
}

export const HN_DOMAIN_GROUPS: HNDomainGroup[] = Array.from(grouped.values()).sort(
  (a, b) => b.properties.length - a.properties.length,
);

export const HN_ALL_PROPERTIES: HNProperty[] = UNIQUE;

export const HN_ECOSYSTEM_STATS = {
  totalUrls: ALL.length, // raw count including www variants (149)
  uniqueProperties: UNIQUE.length,
  rootDomains: HN_DOMAIN_GROUPS.length,
  categories: new Set(HN_DOMAIN_GROUPS.map((g) => g.category)).size,
};

export const HN_CATEGORY_META: Record<
  HNPropertyCategory,
  { label: string; arabic: string; color: HNDomainGroup["color"] }
> = {
  platform: { label: "Platform", arabic: "المنصّة الأم", color: "violet" },
  ai: { label: "AI", arabic: "الذكاء الاصطناعي", color: "cyan" },
  database: { label: "Database", arabic: "قواعد البيانات", color: "mint" },
  driver: { label: "Mobility", arabic: "النقل والتوصيل", color: "amber" },
  "call-center": { label: "Call Center", arabic: "مركز الاتصالات", color: "rose" },
  carwash: { label: "Carwash", arabic: "غسيل السيارات", color: "sky" },
  print: { label: "Print", arabic: "الطباعة", color: "amber" },
  media: { label: "Media", arabic: "الوسائط", color: "rose" },
  commerce: { label: "Commerce", arabic: "التجارة", color: "violet" },
  creator: { label: "Creator Studio", arabic: "استوديو المبدعين", color: "rose" },
  clinic: { label: "Clinic", arabic: "الصحّة", color: "rose" },
  finance: { label: "Finance", arabic: "المالية", color: "mint" },
  realestate: { label: "Real Estate", arabic: "العقارات", color: "amber" },
  education: { label: "Education", arabic: "التعليم", color: "cyan" },
  religion: { label: "Religion", arabic: "روحانيات", color: "mint" },
  cv: { label: "CV Builder", arabic: "بناء السير الذاتية", color: "sky" },
  chat: { label: "Chat", arabic: "المحادثة", color: "cyan" },
  brand: { label: "Brand", arabic: "علامات موازية", color: "violet" },
};
