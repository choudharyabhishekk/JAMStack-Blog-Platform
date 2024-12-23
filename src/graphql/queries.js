import { gql } from "graphql-request";

export const GET_ALL_POSTS = gql`
  query GetAllPosts {
    blogPostCollection(order: [sys_publishedAt_DESC]) {
      items {
        title
        slug
        date
        featuredImageCollection {
          items {
            url # Access the URL directly on the Asset
            # Or, if you need other fields from the Asset:
            # title
            # description
          }
        }
      }
    }
  }
`;

export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: String!) {
    blogPostCollection(where: { slug: $slug }, limit: 1) {
      items {
        title
        date
        content
        featuredImage {
          url
        }
      }
    }
  }
`;
