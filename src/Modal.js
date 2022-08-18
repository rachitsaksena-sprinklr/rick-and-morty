import * as React from "react";

function Modal({ handler }) {
  return (
    <div className="modalOverlay">
      <div className="modal">
        <h1>Confirm Deletion</h1>
        <p>Are you sure you want to delete?</p>
        <div className="buttonRow">
          <button
            className="greenButton"
            onClick={() => handler({ type: "CONFIRM" })}
          >
            Yes
          </button>
          <button
            className="redButton"
            onClick={() => handler({ type: "REJECT" })}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export { Modal };
