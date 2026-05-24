import React, { useEffect, useState } from "react";
import {
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
        searchParams.get(
          "guests"
        )
      ) || 1
    );

  useEffect(() => {
    const fetchRoom =
      async () => {
        try {
          const { data } =
            await axios.get(
              "/api/rooms"
            );

          if (data?.success) {
            const foundRoom =
              data.rooms.find(
                (r) =>
                  String(r._id) ===
                  String(id)
              );

            if (foundRoom) {
              setRoom(foundRoom);

              setMainImage(
                foundRoom?.images?.[0] ||
                  ""
              );
            }
          }
        } catch (error) {
          console.error(
            "Fetch room error:",
            error.response
              ?.data ||
              error.message
          );
        } finally {
          setLoading(false);
        }
      };

    fetchRoom();
  }, [axios, id]);

  const handleSubmit =
    async (e) => {
      e.preventDefault();

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
        new Date(
          checkOutDate
        ) <=
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
      <div className="pt-32 text-center text-2xl">
        Loading room...
      </div>
    );
  }

  if (!room) {
    return (
      <div className="pt-32 text-center text-2xl">
        Room not found
      </div>
    );
  }

  return (
    <div className="bg-[#f8f8f8] min-h-screen py-28 px-4 lg:px-20">
      {/* TOP */}
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          <div>
            <p className="text-[#00ADEF] text-lg capitalize">
              {room?.hotel?.city} •{" "}
              {room?.hotel?.area}
            </p>

            <h1 className="text-5xl font-bold text-gray-800 mt-3">
              {room?.hotel?.name}
            </h1>

            <h2 className="text-2xl text-gray-600 mt-4">
              {room?.roomType}
            </h2>

            <div className="flex items-center mt-5">
              <StarRating rating={4} />

              <p className="ml-3 text-gray-500">
                4.0 Reviews
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <div className="bg-[#eef9ff] text-[#00ADEF] px-5 py-3 rounded-xl">
                📍 {room?.hotel?.address}
              </div>

              <div className="bg-[#eef9ff] text-[#00ADEF] px-5 py-3 rounded-xl">
                📞 {room?.hotel?.contact}
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-gray-500 text-lg">
              Price Per Night
            </p>

            <h2 className="text-6xl font-bold text-gray-800 mt-4">
              {currency}
              {Number(
                room?.pricePerNight || 0
              ).toLocaleString()}
            </h2>

            <p className="text-gray-500 mt-2 text-lg">
              / night
            </p>
          </div>
        </div>
      </div>

      {/* IMAGES */}
      <div className="mt-10 grid lg:grid-cols-[2fr_1fr] gap-5">
        <div>
          <img
            src={
              mainImage ||
              assets.roomImg
            }
            alt="room"
            className="w-full h-[520px] object-cover rounded-3xl"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {room?.images?.map(
            (img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                onClick={() =>
                  setMainImage(img)
                }
                className={`h-[250px] w-full object-cover rounded-2xl cursor-pointer border-4 ${
                  mainImage === img
                    ? "border-[#00ADEF]"
                    : "border-transparent"
                }`}
              />
            )
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10 mt-12">
        {/* LEFT */}
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <h2 className="text-4xl font-bold text-gray-800">
            Experience Luxury Like Never Before
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed mt-6">
            Enjoy premium comfort,
            luxury hospitality,
            elegant interiors, and
            world-class services during
            your stay.
          </p>

          {/* AMENITIES */}
          <div className="mt-12">
            <h3 className="text-3xl font-bold text-gray-800">
              Room Amenities
            </h3>

            <div className="grid sm:grid-cols-2 gap-5 mt-8">
              {room?.amenities?.map(
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

          {/* FEATURES */}
          <div className="mt-14">
            <h3 className="text-3xl font-bold text-gray-800">
              Hotel Features
            </h3>

            <div className="space-y-6 mt-8">
              {roomCommonData.map(
                (spec, i) => (
                  <div
                    key={i}
                    className="flex gap-5"
                  >
                    <img
                      src={spec.icon}
                      alt=""
                      className="w-7 h-7"
                    />

                    <div>
                      <p className="font-semibold text-lg">
                        {spec.title}
                      </p>

                      <p className="text-gray-500 mt-1">
                        {
                          spec.description
                        }
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* BOOKING */}
        <div className="bg-white rounded-3xl p-8 shadow-sm h-fit sticky top-28">
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
                className="border w-full rounded-xl px-4 py-4 mt-2"
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
                className="border w-full rounded-xl px-4 py-4 mt-2"
              />
            </div>

            <div>
              <label className="text-gray-500">
                Guests
              </label>

              <input
                type="number"
                min={1}
                value={guests}
                onChange={(e) =>
                  setGuests(
                    e.target.value
                  )
                }
                className="border w-full rounded-xl px-4 py-4 mt-2"
              />
            </div>

            <button
              type="submit"
              disabled={
                bookingLoading
              }
              className="w-full bg-[#00ADEF] hover:bg-[#0095cc] text-white py-4 rounded-xl text-lg font-semibold transition"
            >
              {bookingLoading
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