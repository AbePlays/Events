import React, { useState } from "react";
import Backdrop from "../modal/Backdrop";
import Modal from "../modal/Modal";

function Event(props) {
  const [isDark, setIsDark] = useState(false);
  var date = new Date(props.date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
  });
  date = date.split(" ");
  const month = date[0];
  const day = date[1];
  return (
    <>
      {isDark && <Backdrop />}
      {isDark && (
        <Modal
          title={props.title}
          canCancel
          canConfirm
          setIsDark={setIsDark}
          confirmTitle="Book"
        >
          <h3>{`$${props.price} - ${month}, ${day}`}</h3>
          <br />
          <p>{props.description}</p>
        </Modal>
      )}
      <li className="events__list-item" key={props.eventId}>
        <div>
          <h1>{props.title}</h1>
          <h2>{`$${props.price} - ${month}, ${day}`}</h2>
        </div>
        <div>
          {props.authUserId !== props.creatorId ? (
            <button
              onClick={() => {
                setIsDark(true);
              }}
            >
              View Details
            </button>
          ) : (
            <p>You're the owner of this event</p>
          )}
        </div>
      </li>
    </>
  );
}

export default Event;
