import * as React from "react";

function Headers({ headers = [], templateColumns, buttonStates, handler }) {
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
          {buttonStates[index] === 0
            ? null
            : buttonStates[index] === 1
            ? "\u25B2"
            : "\u25BC"}
        </button>
      ))}
    </div>
  );
}

export { Headers };
