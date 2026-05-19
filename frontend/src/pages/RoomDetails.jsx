import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { facilityIcons, roomCommonData } from "../assets/assets";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const RoomDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const { axios, currency } = useAppContext();

  const today = new Date().toISOString().split("T")[0];

  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [checkInDate, setCheckInDate] = useState(
    searchParams.get("checkInDate") || ""
  );

  const [checkOutDate, setCheckOutDate] = useState(
    searchParams.get("checkOutDate") || ""
  );

  const [guests, setGuests] = useState(
    Number(searchParams.get("guests")) || 1
  );

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await axios.get("/api/rooms");

        if (data?.success) {
          const foundRoom = data.rooms.find(
            (r) => String(r._id) === String(id)
          );

          if (foundRoom) {
            setRoom(foundRoom);
            setMainImage(foundRoom?.images?.[0] || "");
          }
        }
      } catch (error) {
        console.error(
          "Fetch room error:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [axios, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkInDate || !checkOutDate) {
      toast.error("Select booking dates");
      return;
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    if (guests < 1) {
      toast.error("Guests must be at least 1");
      return;
    }

    if (room?.maxGuests && guests > room.maxGuests) {
      toast.error(`This room only allows ${room.maxGuests} guests`);
      return;
    }

    try {
      setBookingLoading(true);

      const availabilityRes = await axios.post(
        "/api/bookings/check-availability",
        {
          room: room._id,
          checkInDate,
          checkOutDate,
        }
      );

      if (!availabilityRes.data?.success || !availabilityRes.data?.isAvailable) {
        toast.error("Room is not available for selected dates");
        return;
      }

      const { data } = await axios.post("/api/bookings", {
        room: room._id,
        checkInDate,
        checkOutDate,
        guests: Number(guests),
      });

      if (!data?.success) {
        toast.error(data?.message || "Booking failed");
        return;
      }

      toast.success(data.message || "Booking successful");

      setCheckInDate("");
      setCheckOutDate("");
      setGuests(1);
    } catch (error) {
      console.error(
        "Booking error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message || "Booking failed"
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <p className="pt-28 text-center">Loading room...</p>;
  }

  if (!room) {
    return <p className="pt-28 text-center">Room not found</p>;
  }

  return (
    <div className="py-28 md:py-36 px-4 lg:px-24 xl:px-32">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-6">
        <h1 className="text-3xl md:text-4xl font-playfair">
          {room?.hotel?.name}
          <span className="text-sm ml-2 text-gray-500">
            ({room?.roomType})
          </span>
        </h1>

        <span
          className={`text-xs px-3 py-1 rounded text-white ${
            room?.isAvailable ? "bg-green-600" : "bg-red-500"
          }`}
        >
          {room?.isAvailable ? "Available" : "Unavailable"}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-[2]">
          <img
            src={mainImage}
            alt="room"
            className="w-full h-[360px] rounded-lg object-cover"
          />

          <p className="mt-2 text-gray-600">{room?.hotel?.address}</p>
        </div>

        {room?.images?.length > 1 && (
          <div className="grid grid-cols-2 gap-3 flex-1">
            {room.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`room-${i}`}
                onClick={() => setMainImage(img)}
                className={`h-[170px] w-full object-cover rounded-lg cursor-pointer ${
                  mainImage === img ? "ring-2 ring-orange-500" : ""
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center mt-6">
        <StarRating rating={4} />
        <p className="ml-2 text-gray-500 text-sm">Reviews</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between mt-10 gap-6">
        <div>
          <h2 className="text-2xl font-playfair">
            Experience Luxury Like Never Before
          </h2>

          <div className="flex flex-wrap gap-3 mt-4">
            {room?.amenities?.map((item, i) => (
              <div
                key={i}
                className="flex gap-2 bg-gray-100 px-3 py-2 rounded"
              >
                <img src={facilityIcons[item]} alt={item} className="w-5" />
                <span className="text-xs">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-2xl font-semibold">
          {currency}
          {Number(room?.pricePerNight || 0).toLocaleString()} / night
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-6 bg-white shadow-lg border p-6 rounded-xl mt-16"
      >
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-1">Check In</label>

          <input
            type="date"
            required
            value={checkInDate}
            min={today}
            onChange={(e) => {
              setCheckInDate(e.target.value);

              if (
                checkOutDate &&
                new Date(checkOutDate) <= new Date(e.target.value)
              ) {
                setCheckOutDate("");
              }
            }}
            className="border rounded px-3 py-2"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-1">Check Out</label>

          <input
            type="date"
            required
            value={checkOutDate}
            min={checkInDate || today}
            onChange={(e) => setCheckOutDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-1">Guests</label>

          <input
            type="number"
            min={1}
            max={room?.maxGuests || 10}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="border rounded px-3 py-2 w-24"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={bookingLoading || !room?.isAvailable}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900 transition disabled:opacity-50"
          >
            {bookingLoading ? "Booking..." : "Book Now"}
          </button>
        </div>
      </form>

      <div className="mt-24 space-y-4">
        {roomCommonData.map((spec, i) => (
          <div key={i} className="flex gap-3">
            <img src={spec.icon} alt={spec.title} className="w-5 h-5" />

            <div>
              <p>{spec.title}</p>
              <p className="text-gray-500 text-sm">{spec.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomDetails;