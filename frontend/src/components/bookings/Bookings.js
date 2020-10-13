import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./style.css";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const { token } = useContext(AuthContext);

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
    <ul>
      {bookings.map((booking) => (
        <li>{booking.event.title}</li>
      ))}
    </ul>
  );
}

export default Bookings;
