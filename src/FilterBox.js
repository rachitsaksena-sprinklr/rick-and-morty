import * as React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BiRefresh } from "react-icons/bi";

function FilterBox({ handler }) {
  return (
    <div className="filterBox">
      <div className="searchBox">
        <AiOutlineSearch />
        <input
          type="search"
          onChange={(event) => handler({ type: "SEARCH", args: { event } })}
        />
      </div>
      <button
        style={{ gridColumn: 2 }}
        onClick={(event) => handler({ type: "REFRESH", args: { event } })}
      >
        <BiRefresh />
      </button>
    </div>
  );
}

export { FilterBox };
