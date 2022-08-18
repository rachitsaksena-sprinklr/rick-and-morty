import logo from "./logo.svg";
import "./App.css";
import * as React from "react";

async function getData(url) {
  const reponse = await fetch(url);
  const data = await reponse.json();
  return data;
}

async function getAllEpisodes() {
  const urls = [1, 2, 3].map(
    (pageNo) => `https://rickandmortyapi.com/api/episode?page=${pageNo}`
  );
  const data = [];
  for (let url of urls) {
    // 🤬
    const response = await getData(url);
    // console.log(`response ${url}`, response);
    data.push(...response.results);
  }
  return data;
}

function episodeDispatcher(oldState, newState) {
  return newState;
}

// unused functionality
function sortButtonReducer(state, action) {
  if (action.type === "toggle") {
    if (state.isSorted === false) {
      return {
        ...state,
        isSorted: true,
      };
    } else if (state.asc) {
      return {
        ...state,
        asc: false,
      };
    } else {
      return {
        ...state,
        isSorted: false,
        asc: true,
        key: state.defaultKey,
      };
    }
  }
  if (action.type === "reset") {
    return {
      ...state,
      isSorted: true,
      asc: true,
      key: action.key,
    };
  }
}
function SortButton({
  sortProps,
  dispatchSortProps,
  sortKey,
  episodes,
  dispatchEpisodes,
}) {
  function sortEpisodes() {
    if (sortProps.isSorted) {
      // console.log(`sorted episodes`);
      const newEpisodes = [...episodes];
      newEpisodes.sort((a, b) => {
        if (a[sortProps.key] > b[sortProps.key]) {
          return sortProps.asc ? 1 : -1;
        } else if (a[sortProps.key] < b[sortProps.key]) {
          return sortProps.asc ? -1 : 1;
        }
        return 0;
      });
      dispatchEpisodes(newEpisodes);
    }
  }

  function clickHandler() {
    if (sortProps.key === sortKey) {
      dispatchSortProps({ type: "toggle", key: sortKey }).then(sortEpisodes);
    } else {
      dispatchSortProps({ type: "reset", key: sortKey }).then(sortEpisodes);
    }
  }

  // React.useEffect(() => {
  //   if (sortProps.isSorted) {
  //     // console.log(`sorted episodes`);
  //     const newEpisodes = [...episodes];
  //     newEpisodes.sort((a, b) => {
  //       if (a[sortProps.key] > b[sortProps.key]) {
  //         return sortProps.asc ? 1 : -1;
  //       } else if (a[sortProps.key] < b[sortProps.key]) {
  //         return sortProps.asc ? -1 : 1;
  //       }
  //       return 0;
  //     });
  //     dispatchEpisodes(newEpisodes);
  //   }
  // }, [dispatchEpisodes, sortProps]);

  return <button onClick={clickHandler}>{sortKey}</button>;
}

function DisplayTableHeader({ heads, episodes, dispatchEpisodes }) {
  const [sortProps, dispatchSortProps] = React.useReducer(sortButtonReducer, {
    isSorted: false,
    key: heads[0],
    asc: true,
    defaultKey: heads[0],
  });
  return (
    <div>
      {heads.map((element) => (
        <SortButton
          key={element}
          sortProps={sortProps}
          dispatchSortProps={dispatchSortProps}
          sortKey={element}
          episodes={episodes}
          dispatchEpisodes={dispatchEpisodes}
        />
      ))}
    </div>
  );
}

function DisplayBox({ episodes, episodesInPage, filterProps }) {
  // order to do operations = filter->pagify->sort
  let episodesToDisplay = [...episodes];

  // filter
  if (filterProps.isFiltered) {
    const searchByKeywordRegex = new RegExp(filterProps.key);
    episodesToDisplay = episodesToDisplay.filter((episode) =>
      searchByKeywordRegex.test(episode.name)
    );
  }

  // pagify
  episodesToDisplay = episodesToDisplay.slice(0, episodesInPage);

  // sort
  // if (sortProps.isSorted) {
  //   console.log(`sorted episodes`);
  //   episodesToDisplay.sort((a, b) => {
  //     if (a[sortProps.key] > b[sortProps.key]) {
  //       return sortProps.asc ? 1 : -1;
  //     } else if (a[sortProps.key] < b[sortProps.key]) {
  //       return sortProps.asc ? -1 : 1;
  //     }
  //     return 0;
  //   });
  // }

  // render
  return (
    <ul>
      {episodesToDisplay.map((element) => (
        <li key={element.episode}>{element.name}</li>
      ))}
    </ul>
  );
}

function EpisodeTable() {
  const [episodes, dispatchEpisodes] = React.useReducer(
    episodeDispatcher,
    undefined
  );
  const [episodesInPage, setEpisodesInPage] = React.useState(10);
  const [filterEpisodes, setFilterEpisodes] = React.useState("");
  const [filterProps, setFilteredProps] = React.useState({
    isFiltered: false,
    key: "",
  });

  React.useEffect(() => {
    getAllEpisodes().then((responseData) => dispatchEpisodes(responseData));
  }, []);

  function sortEpisodes(prop) {
    console.log(`called sort episodes`);
    const sortedEpisodes = [...episodes];
    sortedEpisodes.sort((a, b) => {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      }
      return 0;
    });
    dispatchEpisodes(sortedEpisodes);
  }

  function handleSearch(event) {
    setFilterEpisodes(event.target.value);
    setFilteredProps({
      isFiltered: event.target.value === "" ? false : true,
      key: event.target.value,
    });
  }

  if (episodes === undefined) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <DisplayTableHeader
          heads={["id", "name"]}
          episodes={episodes}
          dispatchEpisodes={dispatchEpisodes}
        />
        <DisplayBox
          episodes={episodes}
          episodesInPage={episodesInPage}
          filterProps={filterProps}
        />
        <button onClick={() => sortEpisodes("name")}>name</button>
        <button onClick={() => sortEpisodes("id")}>id</button>
        <select
          value={episodesInPage}
          onChange={(event) => setEpisodesInPage(event.target.value)}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
        <input value={filterEpisodes} onChange={handleSearch}></input>
      </div>
    );
  }
}

function App() {
  return <EpisodeTable />;
}

export default App;
