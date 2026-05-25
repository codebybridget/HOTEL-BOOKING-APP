import React, { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import {
  facilityIcons,
  roomCommonData,
  assets,
} from "../assets/assets";

import StarRating from "../components/StarRating";

import { useAppContext } from "../context/AppContext";

import { toast } from "react-hot-toast";

const RoomDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const { axios, currency } =
    useAppContext();

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const [room, setRoom] =
    useState(null);

  const [mainImage, setMainImage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    bookingLoading,
    setBookingLoading,
  ] = useState(false);

  const [
    checkInDate,
    setCheckInDate,
  ] = useState(
    searchParams.get(
      "checkInDate"
    ) || ""
  );

  const [
    checkOutDate,
    setCheckOutDate,
  ] = useState(
    searchParams.get(
      "checkOutDate"
    ) || ""
  );

  const [guests, setGuests] =
    useState(
      Number(
        searchParams.get("guests")
      ) || 1
    );

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);

        setError("");

        const { data } =
          await axios.get(
            "/api/rooms"
          );

        if (data?.success) {
          const foundRoom =
            data.rooms.find(
              (item) =>
                String(item._id) ===
                String(id)
            );

          if (foundRoom) {
            setRoom(foundRoom);

            setMainImage(
              foundRoom?.images?.[0] ||
                ""
            );
          } else {
            setError(
              "Room not found"
            );
          }
        } else {
          setError(
            data?.message ||
              "Unable to load room details"
          );
        }
      } catch (error) {
        console.error(
          "Fetch room error:",
          error.response?.data ||
            error.message
        );

        setError(
          error.response?.data
            ?.message ||
            "Unable to load room details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [axios, id]);

  const formatPrice = (
    price
  ) => {
    return Number(
      price || 0
    ).toLocaleString();
  };

  const calculateNights = () => {
    if (
      !checkInDate ||
      !checkOutDate
    )
      return 0;

    const start = new Date(
      checkInDate
    );

    const end = new Date(
      checkOutDate
    );

    const diff = end - start;

    return Math.ceil(
      diff / (1000 * 60 * 60 * 24)
    );
  };

  const totalNights =
    calculateNights();

  const totalPrice =
    totalNights *
    Number(
      room?.pricePerNight || 0
    );

  const totalRooms = Number(
    room?.totalRooms || 0
  );

  const bookedRooms = Number(
    room?.bookedRooms || 0
  );

  const availableRooms =
    Math.max(
      totalRooms - bookedRooms,
      0
    );

  const isSoldOut =
    availableRooms <= 0 ||
    !room?.isAvailable;

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (isSoldOut) {
      toast.error(
        "Room sold out"
      );

      return;
    }

    if (
      !checkInDate ||
      !checkOutDate
    ) {
      toast.error(
        "Select booking dates"
      );

      return;
    }

    if (
      new Date(checkOutDate) <=
      new Date(checkInDate)
    ) {
      toast.error(
        "Check-out must be after check-in"
      );

      return;
    }

    try {
      setBookingLoading(true);

      const { data } =
        await axios.post(
          "/api/bookings",
          {
            room: room._id,
            checkInDate,
            checkOutDate,
            guests,
          }
        );

      if (!data?.success) {
        toast.error(
          data?.message ||
            "Booking failed"
        );

        return;
      }

      toast.success(
        "Booking successful"
      );

      navigate("/my-bookings");
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Booking failed"
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 text-center text-2xl text-gray-500">
        Loading room...
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="pt-32 px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-700">
          {error ||
            "Room not found"}
        </h2>

        <button
          onClick={() =>
            navigate(-1)
          }
          className="mt-6 bg-[#00ADEF] hover:bg-[#0095cc] text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const roomImages =
    room?.images?.length > 0
      ? room.images
      : [assets.roomImg];

  return (
    <div className="bg-[#f8f8f8] min-h-screen py-28 px-4 lg:px-20 overflow-x-hidden">
      <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          <div>
            <p className="text-[#00ADEF] text-lg capitalize">
              {room?.hotel?.city} •{" "}
              {room?.hotel?.area}
            </p>

            <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 mt-3">
              {room?.hotel?.name}
            </h1>

            <h2 className="text-xl sm:text-2xl text-gray-600 mt-4">
              {room?.roomType}
            </h2>

            <div className="flex items-center mt-5">
              <StarRating rating={4} />

              <p className="ml-3 text-gray-500">
                4.0 Reviews
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <div className="bg-[#eef9ff] text-[#00ADEF] px-5 py-3 rounded-xl break-words">
                📍{" "}
                {
                  room?.hotel
                    ?.address
                }
              </div>

              <div className="bg-[#eef9ff] text-[#00ADEF] px-5 py-3 rounded-xl">
                📞{" "}
                {
                  room?.hotel
                    ?.contact
                }
              </div>
            </div>
          </div>

          <div className="text-left lg:text-right">
            <p className="text-gray-500 text-lg">
              Price Per Night
            </p>

            <h2 className="text-4xl sm:text-6xl font-bold text-gray-800 mt-4">
              {currency}
              {formatPrice(
                room?.pricePerNight
              )}
            </h2>

            <p className="text-gray-500 mt-2 text-lg">
              / night
            </p>

            <div className="mt-6 space-y-3">
              <div className="bg-[#eef9ff] text-[#00ADEF] px-5 py-3 rounded-xl font-semibold">
                Total Rooms:{" "}
                {totalRooms}
              </div>

              <div className="bg-green-100 text-green-700 px-5 py-3 rounded-xl font-semibold">
                Available:{" "}
                {availableRooms}
              </div>

              <div className="bg-orange-100 text-orange-700 px-5 py-3 rounded-xl font-semibold">
                Booked:{" "}
                {bookedRooms}
              </div>

              {isSoldOut && (
                <div className="bg-red-100 text-red-700 px-5 py-3 rounded-xl font-bold">
                  SOLD OUT
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 grid lg:grid-cols-[2fr_1fr] gap-5">
        <div>
          <img
            src={
              mainImage ||
              assets.roomImg
            }
            alt={
              room?.roomType
            }
            className="w-full h-[280px] sm:h-[420px] lg:h-[520px] object-cover rounded-3xl"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {roomImages.map(
            (img, i) => (
              <button
                key={i}
                type="button"
                onClick={() =>
                  setMainImage(img)
                }
                className={`rounded-2xl overflow-hidden border-4 transition ${
                  mainImage === img
                    ? "border-[#00ADEF]"
                    : "border-transparent"
                }`}
              >
                <img
                  src={img}
                  alt={`room-${i}`}
                  loading="lazy"
                  className="h-[120px] sm:h-[250px] w-full object-cover"
                />
              </button>
            )
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10 mt-12">
        <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-sm">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Experience Luxury
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed mt-6">
            {room?.description}
          </p>

          {room?.amenities
            ?.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Room Amenities
              </h3>

              <div className="grid sm:grid-cols-2 gap-5 mt-8">
                {room.amenities.map(
                  (item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 bg-[#f8f8f8] rounded-2xl px-5 py-5"
                    >
                      <img
                        src={
                          facilityIcons[
                            item
                          ]
                        }
                        alt={item}
                        className="w-7 h-7"
                      />

                      <span className="text-lg text-gray-700">
                        {item}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-sm h-fit sticky top-28">
          <h2 className="text-3xl font-bold text-gray-800">
            Book This Room
          </h2>

          <form
            onSubmit={
              handleSubmit
            }
            className="mt-8 space-y-6"
          >
            <div>
              <label className="text-gray-500">
                Check In
              </label>

              <input
                type="date"
                required
                min={today}
                value={
                  checkInDate
                }
                onChange={(e) =>
                  setCheckInDate(
                    e.target.value
                  )
                }
                className="border w-full rounded-xl px-4 py-4 mt-2 outline-none focus:border-[#00ADEF]"
              />
            </div>

            <div>
              <label className="text-gray-500">
                Check Out
              </label>

              <input
                type="date"
                required
                min={
                  checkInDate ||
                  today
                }
                value={
                  checkOutDate
                }
                onChange={(e) =>
                  setCheckOutDate(
                    e.target.value
                  )
                }
                className="border w-full rounded-xl px-4 py-4 mt-2 outline-none focus:border-[#00ADEF]"
              />
            </div>

            <div>
              <label className="text-gray-500">
                Guests
              </label>

              <input
                type="number"
                min={1}
                max={
                  room?.maxGuests ||
                  10
                }
                value={guests}
                onChange={(e) =>
                  setGuests(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="border w-full rounded-xl px-4 py-4 mt-2 outline-none focus:border-[#00ADEF]"
              />
            </div>

            {totalNights >
              0 && (
              <div className="bg-[#f8f8f8] rounded-2xl p-5">
                <div className="flex justify-between text-gray-600">
                  <span>
                    Nights
                  </span>

                  <span>
                    {
                      totalNights
                    }
                  </span>
                </div>

                <div className="flex justify-between text-gray-600 mt-3">
                  <span>
                    Price per
                    night
                  </span>

                  <span>
                    {currency}
                    {formatPrice(
                      room?.pricePerNight
                    )}
                  </span>
                </div>

                <div className="border-t mt-4 pt-4 flex justify-between font-bold text-xl text-gray-800">
                  <span>
                    Total
                  </span>

                  <span>
                    {currency}
                    {formatPrice(
                      totalPrice
                    )}
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={
                bookingLoading ||
                isSoldOut
              }
              className={`w-full py-4 rounded-xl text-lg font-semibold transition ${
                isSoldOut
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-[#00ADEF] hover:bg-[#0095cc] text-white"
              }`}
            >
              {isSoldOut
                ? "Sold Out"
                : bookingLoading
                ? "Booking..."
                : "Book Now"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;