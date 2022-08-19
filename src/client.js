import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const link = new HttpLink({ uri: "https://rickandmortyapi.com/graphql" });
const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache,
});

export { client };
