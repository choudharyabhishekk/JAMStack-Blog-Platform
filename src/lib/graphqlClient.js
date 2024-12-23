import { GraphQLClient } from "graphql-request";

const graphQLClient = new GraphQLClient(
  `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master?access_token=${process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN}`
);

export default graphQLClient;
