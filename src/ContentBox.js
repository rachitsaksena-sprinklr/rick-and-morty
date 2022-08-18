import * as React from "react";
import { ThreeDotsMenu } from "./ThreeDotsMenu";
import { Rings } from "react-loader-spinner";

function Row({ row = [], Key, isStrikeThrough, templateColumns, handler }) {
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
    <ThreeDotsMenu Key={Key} key={row.length + 1} handler={handler} />
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
}) {
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
  return (
    <div className="contentBox" style={styleProps}>
      {rows.map((row) => {
        return (
          <Row
            templateColumns={templateColumns}
            key={getKey(row)}
            Key={getKey(row)}
            row={row}
            isStrikeThrough={
              states.get(getKey(row))
                ? states.get(getKey(row)).strikeThrough
                : false
            }
            handler={handler}
          />
        );
      })}
    </div>
  );
}

export { ContentBox };
