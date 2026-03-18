import imageUrlBuilder from "@sanity/image-url";
import { getSanityClient } from "./client";

export function urlForImage(source: Parameters<ReturnType<typeof imageUrlBuilder>["image"]>[0]) {
  return imageUrlBuilder(getSanityClient()).image(source);
}
