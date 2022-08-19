import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const link = new HttpLink({ uri: "https://rickandmortyapi.com/graphql" });
const cache = new InMemoryCache({
  typePolicies: {
    Characters: {
      merge(existing, incoming, { mergeObjects }) {
        return mergeObjects(existing, incoming);
      },
    },
  },
});

const client = new ApolloClient({
  link,
  cache,
});

export { client };
