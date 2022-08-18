import * as React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

function ThreeDotsMenu({ Key, handler }) {
  const [visibleModal, setVisibleModal] = React.useState(false);

  function clickHandler() {
    setVisibleModal((prevState) => !prevState);
  }

  return (
    <div className="threeDotsMenu">
      <button className="threeDotsButton" onClick={clickHandler}>
        <BsThreeDotsVertical />
      </button>
      <div
        className="menuModal"
        style={{ visibility: visibleModal ? "visible" : "hidden" }}
      >
        <button
          className=""
          onClick={() => {
            handler({ type: "STRIKETHROUGH", args: { Key } });
            setVisibleModal(false);
          }}
          key={1}
        >
          Strike-Through
        </button>
        <button
          className=""
          onClick={(event) => {
            handler({ type: "DELETE", args: { Key } });
            setVisibleModal(false);
          }}
          key={2}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export { ThreeDotsMenu };
