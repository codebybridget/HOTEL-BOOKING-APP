import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const MyBookings = () => {
  const { currency, axios } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    return parsedDate.toLocaleDateString("en-US", {
      timeZone: "UTC",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get("/api/bookings/my");

        if (data?.success) {
          setBookings(data.bookings || []);
        } else {
          setBookings([]);
          toast.error(data?.message || "Failed to fetch bookings");
        }
      } catch (error) {
        console.error(
          "Fetch bookings error:",
          error.response?.data || error.message
        );

        setBookings([]);

        toast.error(
          error.response?.data?.message || "Failed to fetch bookings"
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
        <div className="hidden md:grid grid-cols-[3fr_2fr_1fr] border-b py-3 font-medium">
          <div>Hotel</div>
          <div>Date & Time</div>
          <div className="text-center">Status</div>
        </div>

        {loading && (
          <p className="text-gray-500 mt-10 text-center">
            Loading bookings...
          </p>
        )}

        {!loading && bookings.length === 0 && (
          <p className="text-gray-500 mt-10 text-center">
            No bookings found.
          </p>
        )}

        {!loading &&
          bookings.map((booking) => (
            <div
              key={booking._id}
              className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] border-b py-6 gap-6"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <img
                  src={booking?.room?.images?.[0] || assets.roomImg1}
                  alt="hotel"
                  className="w-full md:w-44 h-48 md:h-32 object-cover rounded-lg"
                />

                <div className="min-w-0">
                  <p className="font-playfair text-2xl md:text-xl break-words">
                    {booking?.hotel?.name || "Hotel"}
                    <span className="text-base md:text-sm ml-1 text-gray-500">
                      ({booking?.room?.roomType || "Room"})
                    </span>
                  </p>

                  <div className="flex items-start gap-2 text-sm text-gray-500 mt-2">
                    <img
                      src={assets.locationIcon}
                      alt="location"
                      className="w-4 mt-0.5 shrink-0"
                    />

                    <span className="break-words">
                      {booking?.hotel?.address || "Address unavailable"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                    <img
                      src={assets.guestsIcon}
                      alt="guests"
                      className="w-4 shrink-0"
                    />

                    <span>Guests: {booking?.guests || 1}</span>
                  </div>

                  <p className="mt-4 font-semibold text-xl">
                    Total: {currency}
                    {Number(booking?.totalPrice || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex justify-between md:flex-col md:justify-center gap-4 text-sm">
                <div>
                  <p className="font-semibold text-gray-800">Check-In</p>
                  <p className="text-gray-500">
                    {formatDate(booking?.checkInDate)}
                  </p>
                </div>

                <div className="text-right md:text-left">
                  <p className="font-semibold text-gray-800">Check-Out</p>
                  <p className="text-gray-500">
                    {formatDate(booking?.checkOutDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center md:justify-center">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-green-500" />
                  <p className="text-sm font-semibold text-green-600">
                    Reserved
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MyBookings;