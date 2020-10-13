import React from "react";
import "./style.css";

function Modal(props) {
  return (
    <div className="modal">
      <header className="modal__header">
        <h1>{props.title}</h1>
      </header>
      <section className="modal__content">{props.children}</section>
      <section className="modal__actions">
        {props.canCancel && (
          <button
            onClick={() => {
              props.setIsDark(false);
            }}
          >
            Cancel
          </button>
        )}
        {props.canConfirm && (
          <button
            onClick={() => {
              props.setIsDark(false);
            }}
          >
            Confirm
          </button>
        )}
      </section>
    </div>
  );
}

export default Modal;
