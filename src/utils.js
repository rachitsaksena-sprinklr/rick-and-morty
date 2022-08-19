import { gql, useQuery } from "@apollo/client";

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

export function sortContent(content, index, asc) {
  const newContent = [...content];
  newContent.sort((a, b) => {
    if (a[index] > b[index]) {
      return asc ? 1 : -1;
    } else if (a[index] < b[index]) {
      return asc ? -1 : 1;
    }
    return 0;
  });
  return newContent;
}

export function useData(options) {
  return useQuery(query, options);
}
