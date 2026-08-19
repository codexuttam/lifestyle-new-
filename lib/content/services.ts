import "server-only";

import { SERVICES } from "@/data/services";
import { serviceSchema, type ServiceRecord } from "@/lib/schemas/service";

import { getHome } from "./home";
import { CONTENT_TAGS, cachedCollection } from "./repository";

const FALLBACK: ServiceRecord[] = SERVICES.map((service, index) => ({
  ...service,
  order: index,
  published: true,
}));

const readServices = cachedCollection({
  collection: "services",
  tag: CONTENT_TAGS.services,
  schema: serviceSchema,
  fallback: FALLBACK,
});

export async function getServices(): Promise<ServiceRecord[]> {
  const services = await readServices();
  return services.filter((service) => service.published);
}

export async function getAllServices(): Promise<ServiceRecord[]> {
  return readServices();
}

/**
 * The homepage grid, in the order chosen in the CMS.
 *
 * It animates exactly four cards (see CARD_FROM in components/Services.tsx),
 * so a stale selection falls back to the featured flag, capped at four,
 * rather than shipping an un-animated fifth or a gap.
 */
export async function getFeaturedServices(): Promise<ServiceRecord[]> {
  const [services, home] = await Promise.all([getServices(), getHome()]);
  const byId = new Map(services.map((service) => [service.id, service]));
  const picked = home.composition.featuredServiceIds
    .map((id) => byId.get(id))
    .filter((service): service is ServiceRecord => Boolean(service));

  return picked.length === 4
    ? picked
    : services.filter((service) => service.featured).slice(0, 4);
}
