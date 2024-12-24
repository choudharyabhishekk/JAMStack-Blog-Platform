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
            url
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
        featuredImageCollection {
          # Use featuredImageCollection
          items {
            url # Access url directly
          }
        }
      }
    }
  }
`;
