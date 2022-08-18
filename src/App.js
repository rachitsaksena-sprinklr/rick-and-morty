import "./App.css";
import * as React from "react";
import { DisplayTable } from "./DisplayTable";
import { client } from "./client";
import { ApolloProvider, gql, useQuery } from "@apollo/client";

const query = gql`
  query Query($page: Int, $searchKeyword: String) {
    characters(page: $page, filter: { name: $searchKeyword }) {
      info {
        next
        prev
      }
      results {
        id
        name
        status
        species
        gender
      }
    }
  }
`;

async function getData({ type, args = {} }) {
  let variables = {
    page: args.page !== undefined ? args.page : 1,
    searchKeyword: args.searchKey !== undefined ? args.searchKey : "",
  };
  let data = await client.query({ query, variables });
  return {
    content: data.data.characters.results.map((character) => [
      Number(character.id),
      character.name,
      character.status,
      character.species,
      character.gender,
    ]),
    pages: {
      isNext: data.data.characters.info.next,
      isPrev: data.data.characters.info.prev,
    },
  };
}

function App() {
  return (
    <ApolloProvider client={client}>
      <DisplayTable
        getData={getData}
        useData={useData}
        headers={["ID", "Name", "Status", "Species", "Gender"]}
        templateColumns={`2fr repeat(4, 5fr) 1fr`}
      />
    </ApolloProvider>
  );
}

export default App;

function useData({ variables, onCompleted }) {
  const { data, loading, error } = useQuery(query, { variables, onCompleted });
  // if (!loading && !error) {
  //   onCompleted(data);
  // }
  return [data, loading, error];
}

// async function fetchData(url) {
//   const reponse = await fetch(url);
//   const data = await reponse.json();
//   return data;
// }

// async function getDataAPI({ type, args }) {
//   let data;
//   if (type === "default") {
//     data = await fetchData("https://rickandmortyapi.com/api/character");
//   } else if (type === "search") {
//     const { searchKey, page } = args;
//     let urlToRequest = `https://rickandmortyapi.com/api/character`;
//     if (searchKey && searchKey !== "") {
//       urlToRequest += `?name=${searchKey}`;
//       if (page) {
//         urlToRequest += `&page=${page}`;
//       }
//     } else if (page) {
//       urlToRequest += `?page=${page}`;
//     }
//     data = await fetchData(urlToRequest);
//   }
//   if (!data.results) {
//     return { content: [[]], pages: { isNext: false, isPrev: false } };
//   }
//   return {
//     content: data.results.map((element) => [
//       element.id,
//       element.name,
//       element.status,
//       element.species,
//       element.gender,
//     ]),
//     pages: {
//       isNext: data.info.next ? true : false,
//       isPrev: data.info.prev ? true : false,
//     },
//   };
// }
