import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Booking from "./Booking";
import "./style.css";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const { token } = useContext(AuthContext);

  const cancelHandler = (id) => {
    const queryBody = {
      query: `
        mutation {
          cancelBooking(bookingId : "${id}") {
            _id
            title
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
        setBookings((prev) => {
          const newBookings = prev.filter((booking) => booking._id !== id);
          return newBookings;
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const fetchBookings = () => {
    const queryBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            event {
              _id
              title
              date
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
        const data = res.data.bookings;
        setBookings(data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <ul className="bookings__list">
      {bookings.map((booking) => (
        <Booking key={booking._id} booking={booking} onDelete={cancelHandler} />
      ))}
    </ul>
  );
}

export default Bookings;
