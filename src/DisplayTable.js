import * as React from "react";
import "./DisplayTable.css";
import { FilterBox } from "./FilterBox";
import { ContentBox } from "./ContentBox";
import { Footer } from "./Footer";
import { Headers } from "./Headers";
import { Modal } from "./Modal";
import { useData, sortContent } from "./utils";

const initialState = {
  content: [[]],
  rowStates: new Map(),
  showModal: false,
  toDelete: undefined,
  sortIndex: 0,
  sortType: 0,
  isNext: false,
  isPrev: false,
  searchKeyword: "",
  page: 1,
};

function reducer(state, action) {
  switch (action.type) {
    case "CONFIRM":
      const newMap_cnf = new Map(state.rowStates);
      newMap_cnf.set(state.toDelete, { isDeleted: true });
      return { ...state, showModal: false, rowStates: newMap_cnf };

    case "REJECT":
      return { ...state, showModal: false };

    case "SEARCH":
      return {
        ...state,
        searchKeyword: action.args.event.target.value,
        sortIndex: 0,
        sortType: 0,
      };

    case "REFRESH":
      return { ...state, rowStates: new Map(), sortIndex: 0, sortType: 0 };

    case "SORT":
      console.log(state);
      let sortType = 1,
        newContent = state.content;
      if (action.args.index === state.sortIndex) {
        sortType = (state.sortType + 1) % 3;
      }
      if (sortType !== 0) {
        newContent = sortContent(
          state.content,
          action.args.index,
          sortType === 1
        );
      } else {
        newContent = sortContent(state.content, 0, true);
      }
      console.log(action.args.index, sortType);
      return {
        ...state,
        content: newContent,
        sortIndex: action.args.index,
        sortType,
      };

    case "STRIKETHROUGH":
      const newMap_str = new Map(state.rowStates);
      newMap_str.set(action.args.identifier, {
        strikeThrough: state.rowStates.get(action.args.identifier)
          ? !state.rowStates.get(action.args.identifier).strikeThrough
          : true,
      });
      return { ...state, rowStates: newMap_str };

    case "DELETE":
      return { ...state, toDelete: action.args.identifier, showModal: true };

    case "NEXT":
      return { ...state, page: state.page + 1, sortIndex: 0, sortType: 0 };

    case "PREV":
      return { ...state, page: state.page - 1, sortIndex: 0, sortType: 0 };

    case "UPDATE":
      return { ...state, ...action.args };

    default:
      throw new Error("unhandled case in reducer!");
  }
}

function DisplayTable({ headers, templateColumns }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const { loading } = useData({
    variables: {
      searchKeyword: state.searchKeyword,
      page: state.page,
    },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      // console.log("called onComplete: ", data.characters.results[0].id);
      dispatch({
        type: "UPDATE",
        args: {
          content: data.characters.results.map((character) => [
            Number(character.id),
            character.name,
            character.status,
            character.species,
            character.gender,
          ]),
          isNext: data.characters.info.next,
          isPrev: data.characters.info.prev,
        },
      });
    },
  });

  const rows = state.content.filter(
    (row) =>
      !state.rowStates.get(row[0]) || !state.rowStates.get(row[0]).isDeleted
  );

  return (
    <div className="displayTableContainer">
      {state.showModal && <Modal handler={dispatch} />}
      <FilterBox handler={dispatch} />
      <Headers
        headers={headers}
        templateColumns={templateColumns}
        sortIndex={state.sortIndex}
        sortType={state.sortType}
        handler={dispatch}
      />
      <ContentBox
        rows={rows}
        getKey={(row) => row[0]}
        states={state.rowStates}
        templateColumns={templateColumns}
        handler={dispatch}
        loading={loading}
      />
      <Footer isNext={state.isNext} isPrev={state.isPrev} handler={dispatch} />
    </div>
  );
}

export { DisplayTable };
