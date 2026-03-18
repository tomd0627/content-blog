/** Matches the GROQ tag projection: { slug, name, color } */
export interface SanityTag {
  _id?: string;
  name: string;
  slug: string; // projected as slug.current
  color?: string;
}

/** Matches the GROQ coverImage projection: { src, alt } */
export interface SanityCoverImage {
  src: string; // projected as asset->url
  alt: string;
  // raw asset ref for urlForImage helper (only in full post fetch)
  asset?: { _ref: string };
}

/** Matches the GROQ post summary projection */
export interface SanityPostSummary {
  _id: string;
  title: string;
  slug: string; // projected as slug.current
  excerpt: string;
  publishedAt: string;
  coverImage: SanityCoverImage;
  tags: SanityTag[];
  featured: boolean;
  bodyText?: string;
}

import type { TypedObject } from "@portabletext/types";

/** Matches the GROQ full post projection (includes body) */
export interface SanityPost extends SanityPostSummary {
  _updatedAt?: string;
  body: TypedObject[];
}

export type PortableTextBlock = TypedObject;
