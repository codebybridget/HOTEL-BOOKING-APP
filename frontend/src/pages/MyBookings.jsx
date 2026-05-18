import React from "react";
import { useState, useEffect } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const MyBookings = () => {
  const { currency, axios } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // FETCH BOOKINGS
  // =========================
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get("/api/bookings/my");

        if (data.success) {
          setBookings(data.bookings);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="py-28 md:pt-32 md:pb-36 px-4 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="My Bookings"
        subTitle="Manage your past, current, and upcoming hotel reservations."
        align="left"
      />

      <div className="max-w-6xl mt-8 w-full text-gray-800">
        {/* Header */}
        <div className="hidden md:grid grid-cols-[3fr_2fr_1fr] border-b py-3 font-medium">
          <div>Hotel</div>
          <div>Date & Time</div>
          <div className="text-center">Payment</div>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-gray-500 mt-10 text-center">
            Loading bookings...
          </p>
        )}

        {/* Empty */}
        {!loading && bookings.length === 0 && (
          <p className="text-gray-500 mt-10 text-center">
            No bookings found.
          </p>
        )}

        {/* Bookings */}
        {!loading &&
          bookings.map((booking) => (
            <div
              key={booking._id}
              className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] border-b py-6 gap-4"
            >
              {/* Hotel */}
              <div className="flex flex-col md:flex-row gap-4">
                <img
                  src={booking?.room?.images?.[0]}
                  alt="hotel"
                  className="md:w-40 h-28 object-cover rounded"
                />

                <div>
                  <p className="font-playfair text-xl">
                    {booking?.hotel?.name}
                    <span className="text-sm ml-1">
                      ({booking?.room?.roomType})
                    </span>
                  </p>

                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <img
                      src={assets.locationIcon}
                      alt="location"
                      className="w-4"
                    />
                    <span>{booking?.hotel?.address}</span>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <img
                      src={assets.guestsIcon}
                      alt="guests"
                      className="w-4"
                    />
                    <span>Guests: {booking?.guests}</span>
                  </div>

                  <p className="mt-2 font-medium">
                    Total: {currency}
                    {booking?.totalPrice}
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="flex md:flex-col justify-between md:justify-center gap-4 text-sm">
                <div>
                  <p className="font-medium">Check-In</p>
                  <p className="text-gray-500">
                    {formatDate(booking?.checkInDate)}
                  </p>
                </div>

                <div>
                  <p className="font-medium">Check-Out</p>
                  <p className="text-gray-500">
                    {formatDate(booking?.checkOutDate)}
                  </p>
                </div>
              </div>

              {/* Payment */}
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-3 w-3 rounded-full ${
                      booking?.isPaid
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />

                  <p
                    className={`text-sm ${
                      booking?.isPaid
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {booking?.isPaid ? "Paid" : "Unpaid"}
                  </p>
                </div>

                {!booking?.isPaid && (
                  <button className="mt-4 px-4 py-1.5 text-xs border rounded-full hover:bg-gray-50 transition">
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MyBookings;