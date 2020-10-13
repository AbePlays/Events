import React from "react";

function Booking({ booking, onDelete }) {
  return (
    <li className="bookings__item">
      <div className="bookings__item-data">
        <h1>{booking.event.title}</h1>
        <h2>{new Date(booking.createdAt).toLocaleDateString()}</h2>
      </div>
      <div className="bookings__item-actions">
        <button
          onClick={() => {
            onDelete(booking._id);
          }}
        >
          Cancel
        </button>
      </div>
    </li>
  );
}

export default Booking;
