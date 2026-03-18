const tagFields = `
  "slug": slug.current,
  name,
  color
`;

const coverImageFields = `
  "src": asset->url,
  alt
`;

const postSummaryFields = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  featured,
  "coverImage": coverImage { ${coverImageFields} },
  "tags": tags[]->{ ${tagFields} }
`;

export const FEATURED_POST_QUERY = `
  *[_type == "post" && featured == true] | order(publishedAt desc) [0] {
    ${postSummaryFields},
    "bodyText": pt::text(body)
  }
`;

export const RECENT_POSTS_QUERY = `
  *[_type == "post"] | order(publishedAt desc) [0...$limit] {
    ${postSummaryFields},
    "bodyText": pt::text(body)
  }
`;

export const ALL_POST_SUMMARIES_QUERY = `
  *[_type == "post"] | order(publishedAt desc) {
    ${postSummaryFields},
    "bodyText": pt::text(body)
  }
`;

export const POSTS_BY_TAG_QUERY = `
  *[_type == "post" && $tagSlug in tags[]->slug.current] | order(publishedAt desc) {
    ${postSummaryFields},
    "bodyText": pt::text(body)
  }
`;

export const POST_BY_SLUG_QUERY = `
  *[_type == "post" && slug.current == $slug][0] {
    ${postSummaryFields},
    "bodyText": pt::text(body),
    body
  }
`;

export const ALL_SLUGS_QUERY = `
  *[_type == "post"] { "slug": slug.current }
`;

export const ALL_TAGS_QUERY = `
  *[_type == "tag"] | order(name asc) {
    name,
    "slug": slug.current,
    color
  }
`;
