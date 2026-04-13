import { createImageUrlBuilder } from "@sanity/image-url";
import { getSanityClient } from "./client";

const builder = createImageUrlBuilder(getSanityClient());

export function urlForImage(source: Parameters<ReturnType<typeof createImageUrlBuilder>["image"]>[0]) {
  return builder.image(source);
}
