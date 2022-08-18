import * as React from "react";
import "./DisplayTable.css";
import { FilterBox } from "./FilterBox";
import { ContentBox } from "./ContentBox";
import { Footer } from "./Footer";
import { Headers } from "./Headers";
import { Modal } from "./Modal";
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

function DisplayTable({
  getData,
  useData,
  headers,
  templateColumns,
  defaultSort = 0,
}) {
  const [content, setContent] = React.useState([[]]);
  const [states, setStates] = React.useState(new Map());
  const [showModal, setShowModal] = React.useState(false);
  const [toDelete, setToDelete] = React.useState(undefined);
  const [buttonStates, setButtonStates] = React.useState(
    new Array(headers.length).fill(0)
  );
  const [pageState, setPageState] = React.useState({
    isNext: false,
    isPrev: false,
  });
  const [queryState, setQueryState] = React.useState({
    searchKeyword: "",
    page: 1,
  });

  // Data Retrieval when queryState changes
  // React.useEffect(() => {
  //   getData({
  //     type: "search",
  //     args: { searchKey: queryState.searchKeyword, page: queryState.page },
  //   }).then((data) => {
  //     setContent(() => {
  //       console.log("calling setContent");
  //       return data.content;
  //     });
  //     setPageState((prevState) => {
  //       return {
  //         isNext: data.pages.isNext,
  //         isPrev: data.pages.isPrev,
  //       };
  //     });
  //   });
  // }, [getData, queryState, setContent]);

  const { loading } = useQuery(query, {
    variables: queryState,
    onCompleted: (data) => {
      console.log("called onComplete: ", data.characters.results[0].id);
      setContent((prevState) => {
        console.log("calling setContent", data); // STUCK
        return data.characters.results.map((character) => [
          Number(character.id),
          character.name,
          character.status,
          character.species,
          character.gender,
        ]);
      });
      setPageState({
        isNext: data.characters.info.next,
        isPrev: data.characters.info.prev,
      });
    },
  });
  React.useEffect(() => console.log("Content changed: ", content), [content]);
  React.useEffect(
    () => console.log("queryState changed: ", queryState),
    [queryState]
  );

  function modalHandler({ type }) {
    if (type === "CONFIRM") {
      setStates((prevState) => {
        const newMap = new Map(prevState);
        newMap.set(toDelete, { isDeleted: true });
        return newMap;
      });
      setShowModal(false);
    } else if (type === "REJECT") {
      setShowModal(false);
    } else {
      setShowModal(false);
      throw new Error(
        "This should not be possible! check type sent to modalHandler"
      );
    }
  }

  let searchTimeout;
  function filterBoxHandler({ type, args }) {
    if (type === "SEARCH") {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        setQueryState((prevState) => {
          return {
            ...prevState,
            searchKeyword: args.event.target.value,
            page: 1,
          };
        });
        setButtonStates(new Array(headers.length).fill(0));
      }, 100);
    } else if (type === "REFRESH") {
      setQueryState((prevState) => {
        return { ...prevState };
      });
      setStates(new Map());
      setButtonStates(new Array(headers.length).fill(0));
    } else {
      throw new Error(
        "This should not be possible! check type sent to filterBoxHandler"
      );
    }
  }

  function headersHandler({ type, args }) {
    if (type === "SORT") {
      const newButtonStates = new Array(headers.length).fill(0);
      newButtonStates[args.index] = (buttonStates[args.index] + 1) % 3;
      setButtonStates(newButtonStates);
      if (newButtonStates[args.index] === 0) {
        sortContent(defaultSort, true);
      } else {
        sortContent(args.index, newButtonStates[args.index] === 1);
      }
    } else {
      throw new Error(
        "This should not be possible! check type sent to headersHandler"
      );
    }
  }
  function sortContent(index, asc) {
    setContent((content) => {
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
    });
  }

  function contentBoxHandler({ type, args }) {
    if (type === "STRIKETHROUGH") {
      setStates((prevState) => {
        const newMap = new Map(prevState);
        newMap.set(args.Key, {
          strikeThrough: prevState.get(args.Key)
            ? !prevState.get(args.Key).strikeThrough
            : true,
        });
        return newMap;
      });
    } else if (type === "DELETE") {
      setToDelete(args.Key);
      setShowModal(true);
    } else {
      throw new Error(
        "This should not be possible! check type sent to contentBoxHandler"
      );
    }
  }
  function getKey(row) {
    return row[0];
  }

  function footerHandler({ type, args }) {
    if (type === "NEXT") {
      setButtonStates(new Array(headers.length).fill(0));
      setQueryState((prevState) => {
        return { ...prevState, page: prevState.page + 1 };
      });
    } else if (type === "PREV") {
      setButtonStates(new Array(headers.length).fill(0));
      setQueryState((prevState) => {
        return { ...prevState, page: prevState.page - 1 };
      });
    } else {
      throw new Error(
        "This should not be possible! check type sent to footerHandler"
      );
    }
  }

  const rows = content.filter(
    (row) => !states.get(getKey(row)) || !states.get(getKey(row)).isDeleted
  );

  return (
    <div className="displayTableContainer">
      {showModal && <Modal handler={modalHandler} />}
      <FilterBox handler={filterBoxHandler} />
      <Headers
        headers={headers}
        templateColumns={templateColumns}
        buttonStates={buttonStates}
        handler={headersHandler}
      />
      <ContentBox
        rows={rows}
        getKey={getKey}
        states={states}
        templateColumns={templateColumns}
        handler={contentBoxHandler}
        loading={loading}
      />
      <Footer pageState={pageState} handler={footerHandler} />
    </div>
  );
}

export { DisplayTable };
