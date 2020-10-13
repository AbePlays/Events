import React, { useState } from "react";
import Modal from "../modal/Modal";
import Backdrop from "../modal/Backdrop";
import "./style.css";

function Events() {
  const [isDark, setIsDark] = useState(false);

  return (
    <>
      {isDark && <Backdrop />}
      {isDark && (
        <Modal title="Add Event" canCancel canConfirm setIsDark={setIsDark}>
          <p>Modal Content</p>
        </Modal>
      )}
      <div className="events-control">
        <p>Share your own events</p>
        <button
          onClick={() => {
            setIsDark(true);
          }}
        >
          Create Event
        </button>
      </div>
    </>
  );
}

export default Events;
