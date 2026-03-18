import { createClient, type SanityClient } from "@sanity/client";

let _client: SanityClient | null = null;

export function getSanityClient(): SanityClient {
  if (!_client) {
    _client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
      apiVersion: "2024-01-01",
      useCdn: process.env.NODE_ENV === "production",
      token: process.env.SANITY_API_TOKEN,
    });
  }
  return _client;
}
