import React, { useState, useContext } from "react";
import Backdrop from "../modal/Backdrop";
import Modal from "../modal/Modal";
import { AuthContext } from "../../context/AuthContext";

function Event(props) {
  const [isDark, setIsDark] = useState(false);
  const { token } = useContext(AuthContext);

  var date = new Date(props.date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
  });

  const bookEvent = () => {
    const queryBody = {
      query: `
          mutation {
            bookEvent(eventId: "${props.eventId}") {
              _id
              createdAt
              updatedAt
            }
          }
        `,
    };

    fetch("http://localhost:1000/graphql", {
      method: "POST",
      body: JSON.stringify(queryBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((res) => {
        console.log(res);
        setIsDark(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

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
          confirmHandler={bookEvent}
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
