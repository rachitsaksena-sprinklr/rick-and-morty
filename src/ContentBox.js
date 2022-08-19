import * as React from "react";
import { ThreeDotsMenu } from "./ThreeDotsMenu";
import { Rings } from "react-loader-spinner";
// import { useVirtualizer } from "@tanstack/react-virtual";

function Row({
  row = [],
  identifier,
  isStrikeThrough,
  templateColumns,
  handler,
}) {
  const numCols = row.length;
  const styleProps = {
    gridTemplateColumns: templateColumns || `repeat(${numCols}, 5fr) 1fr`,
  };

  let cells;
  const inLineStyleProps = {
    textDecoration: "line-through",
  };
  cells = row.map((element, index) => (
    <p key={index} style={isStrikeThrough ? inLineStyleProps : {}}>
      {element}
    </p>
  ));
  cells.push(
    <div key={row.length + 1}>
      <ThreeDotsMenu
        identifier={identifier}
        key={row.length + 1}
        handler={handler}
      />
    </div>
  );
  return (
    <div className="row" style={styleProps}>
      {cells}
    </div>
  );
}

function ContentBox({
  rows = [[]],
  templateRows,
  templateColumns,
  states,
  handler,
  getKey,
  loading,
  onLoadMore,
  containerRef,
}) {
  // const parentRef = React.useRef();

  // const rowVirtualizer = useVirtualizer({
  //   count: 10000,
  //   getScrollElement: () => parentRef.current,
  //   estimateSize: () => 35,
  // });

  if (loading) {
    return (
      <div className="contentBox">
        <Rings color="black" />
      </div>
    );
  }
  if (rows.length === 0 || rows[0].length === 0) {
    return <div className="contentBox empty"> Uh Oh! Nothing found!</div>;
  }
  const styleProps = {
    gridTemplateRows: templateRows || `repeat(${rows.length}, 1fr)`,
    gridTemplateColumns: "1fr",
  };

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight) < 1;
    if (bottom) {
      console.log("reached bottom!");
      onLoadMore();
    }
  };

  return (
    <div
      className="contentBox"
      style={styleProps}
      onScroll={handleScroll}
      ref={containerRef}
    >
      {rows.map((row) => (
        <Row
          templateColumns={templateColumns}
          key={getKey(row)}
          identifier={getKey(row)}
          row={row}
          isStrikeThrough={
            states.get(getKey(row))
              ? states.get(getKey(row)).strikeThrough
              : false
          }
          handler={handler}
        />
      ))}
    </div>
  );
}

export { ContentBox };
