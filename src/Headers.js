import * as React from "react";

const symbolMap = ["", "\u25B2", "\u25BC"];

function Headers({
  headers = [],
  templateColumns,
  sortIndex,
  sortType,
  handler,
}) {
  const numCols = headers.length + 1;
  const styleProps = {
    gridTemplateRows: "1fr",
    gridTemplateColumns: templateColumns || `repeat(${numCols}, 1fr)`,
  };

  return (
    <div className="headers" style={styleProps}>
      {headers.map((element, index) => (
        <button
          key={index}
          onClick={() => handler({ type: "SORT", args: { index } })}
        >
          {element}
          {sortIndex === index ? symbolMap[sortType] : null}
        </button>
      ))}
    </div>
  );
}

export { Headers };
