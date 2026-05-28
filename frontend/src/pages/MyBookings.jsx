import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const MyBookings = () => {
  const { currency, axios } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // FETCH BOOKINGS
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } =
          await axios.get(
            "/api/bookings/my"
          );

        if (data?.success) {
          setBookings(
            data.bookings || []
          );
        } else {
          setBookings([]);

          toast.error(
            data?.message ||
              "Failed to fetch bookings"
          );
        }
      } catch (error) {
        console.error(
          "Fetch bookings error:",
          error.response?.data ||
            error.message
        );

        setBookings([]);

        toast.error(
          error.response?.data
            ?.message ||
            "Failed to fetch bookings"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [axios]);

  return (
    <div className="py-28 md:pt-32 md:pb-36 px-4 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="My Bookings"
        subTitle="Manage your hotel reservations."
        align="left"
      />

      <div className="max-w-6xl mt-8 w-full text-gray-800">
        {/* HEADER */}
        <div className="hidden md:grid grid-cols-[3fr_2fr_1fr] border-b py-3 font-medium">
          <div>Hotel</div>

          <div>Date & Time</div>

          <div className="text-center">
            Status
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-gray-500 mt-10 text-center">
            Loading bookings...
          </p>
        )}

        {/* EMPTY */}
        {!loading &&
          bookings.length ===
            0 && (
            <p className="text-gray-500 mt-10 text-center">
              No bookings found.
            </p>
          )}

        {/* BOOKINGS */}
        {!loading &&
          bookings.map(
            (booking) => (
              <div
                key={
                  booking._id
                }
                className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] border-b py-6 gap-6"
              >
                {/* HOTEL */}
                <div className="flex flex-col md:flex-row gap-4">
                  <img
                    src={
                      booking
                        ?.room
                        ?.images?.[0] ||
                      assets.roomImg1
                    }
                    alt="hotel"
                    className="md:w-44 h-32 object-cover rounded-lg"
                  />

                  <div>
                    <p className="font-playfair text-xl">
                      {booking
                        ?.hotel
                        ?.name ||
                        "Hotel"}

                      <span className="text-sm ml-1 text-gray-500">
                        (
                        {booking
                          ?.room
                          ?.roomType ||
                          "Room"}
                        )
                      </span>
                    </p>

                    {/* ADDRESS */}
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <img
                        src={
                          assets.locationIcon
                        }
                        alt="location"
                        className="w-4"
                      />

                      <span>
                        {booking
                          ?.hotel
                          ?.address ||
                          "Address unavailable"}
                      </span>
                    </div>

                    {/* GUESTS */}
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <img
                        src={
                          assets.guestsIcon
                        }
                        alt="guests"
                        className="w-4"
                      />

                      <span>
                        Guests:{" "}
                        {booking?.guests ||
                          1}
                      </span>
                    </div>

                    {/* PRICE */}
                    <p className="mt-3 font-medium text-lg">
                      Total:{" "}
                      {currency}
                      {Number(
                        booking?.totalPrice ||
                          0
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* DATES */}
                <div className="flex md:flex-col justify-between md:justify-center gap-4 text-sm">
                  <div>
                    <p className="font-medium">
                      Check-In
                    </p>

                    <p className="text-gray-500">
                      {formatDate(
                        booking?.checkInDate
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">
                      Check-Out
                    </p>

                    <p className="text-gray-500">
                      {formatDate(
                        booking?.checkOutDate
                      )}
                    </p>
                  </div>
                </div>

                {/* STATUS */}
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-green-500" />

                    <p className="text-sm font-medium text-green-600">
                      Reserved
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
      </div>
    </div>
  );
};

export default MyBookings;