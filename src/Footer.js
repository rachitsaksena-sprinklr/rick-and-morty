import * as React from "react";
import { AiOutlineVerticalAlignTop } from "react-icons/ai";

function Footer({ pageState, handler }) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="footer">
      <button
        style={{ display: pageState.isPrev ? "" : "none", gridColumn: 1 }}
        onClick={() => {
          handler({ type: "PREV" });
          scrollToTop();
        }}
      >
        Prev
      </button>
      <button
        style={{ display: pageState.isNext ? "" : "none", gridColumn: 2 }}
        onClick={() => {
          handler({ type: "NEXT" });
          scrollToTop();
        }}
      >
        Next
      </button>
      <button
        style={{ gridColumn: -2, fontSize: "xx-large" }}
        onClick={scrollToTop}
      >
        <AiOutlineVerticalAlignTop />
      </button>
    </div>
  );
}

export { Footer };
