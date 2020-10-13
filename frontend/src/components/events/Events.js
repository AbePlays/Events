import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import Modal from "../modal/Modal";
import Backdrop from "../modal/Backdrop";
import "./style.css";

function Events() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [events, setEvents] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const { token } = useContext(AuthContext);

  const fetchEvents = () => {
    const queryBody = {
      query: `
        query {
          events {
            _id
            title
            description
            date
            price
            creator {
              _id
              email
            }
          }
        }
      `,
    };  

    fetch("http://localhost:1000/graphql", {
      method: "POST",
      body: JSON.stringify(queryBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((res) => {
        const data = res.data.events;
        setEvents(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  const confirmHandler = () => {
    const event = { title, price: +price, date, description };
    console.log(event);

    const queryBody = {
      query: `
        mutation {
          createEvent(eventInput : {
            title: "${title}",
            description: "${description}",
            price: ${+price},
            date: "${date}",
          }) {
            _id
            title
            description
            date
            price
            creator {
              _id
              email
            }
          }
        }
      `,
    };  

    fetch("http://localhost:1000/graphql", {
      method: "POST",
      body: JSON.stringify(queryBody),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((res) => {
        fetchEvents();
      })
      .catch((e) => {
        console.log(e);
      });

    setIsDark(false);
  };

  useEffect(()=>{fetchEvents()}, [])

  return (
    <>
      {isDark && <Backdrop />}
      {isDark && (
        <Modal
          title="Add Event"
          canCancel
          canConfirm
          confirmHandler={confirmHandler}
          setIsDark={setIsDark}
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input
                type="datetime-local"
                id="date"
                onChange={(e) => {
                  setDate(e.target.value);
                }}
              />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows="4"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              ></textarea>
            </div>
          </form>
        </Modal>
      )}
      {token && <div className="events-control">
        <p>Share your own events</p>
        <button
          onClick={() => {
            setIsDark(true);
          }}
        >
          Create Event
        </button>
      </div>}
      <ul className="events__list">
        {events.map(event => <li className="events__list-item" key={event._id}>{event.title}</li>)}
      </ul>
    </>
  );
}

export default Events;
