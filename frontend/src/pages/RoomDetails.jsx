import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { facilityIcons, roomCommonData } from "../assets/assets";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const RoomDetails = () => {
  const { id } = useParams();
  const { axios } = useAppContext();

  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking state
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);

  // =========================
  // FETCH ROOM
  // =========================
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await axios.get("/api/rooms");

        if (data.success) {
          const foundRoom = data.rooms.find(
            (r) => String(r._id) === String(id)
          );

          if (foundRoom) {
            setRoom(foundRoom);
            setMainImage(foundRoom.images?.[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching room:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  // =========================
  // HANDLE BOOKING
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/bookings", {
        room: room._id,
        checkInDate,
        checkOutDate,
        guests,
      });

      if (data.success) {
        toast.success("Booking successful!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Booking failed"
      );
    }
  };

  if (loading) {
    return <p className="pt-28 text-center">Loading...</p>;
  }

  if (!room) {
    return <p className="pt-28 text-center">Room not found</p>;
  }

  return (
    <div className="py-28 md:py-36 px-4 lg:px-24 xl:px-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-6">
        <h1 className="text-3xl md:text-4xl font-playfair">
          {room?.hotel?.name}
          <span className="text-sm ml-2">({room?.roomType})</span>
        </h1>

        <span className="text-xs px-3 py-1 bg-orange-500 text-white rounded">
          Available
        </span>
      </div>

      {/* Images */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-[2]">
          <img
            src={mainImage}
            className="w-full h-[360px] rounded-lg object-cover"
          />
          <p className="mt-2 text-gray-600">
            {room?.hotel?.address}
          </p>
        </div>

        {room?.images?.length > 1 && (
          <div className="grid grid-cols-2 gap-3 flex-1">
            {room.images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setMainImage(img)}
                className={`h-[170px] rounded-lg cursor-pointer ${
                  mainImage === img ? "ring-2 ring-orange-500" : ""
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center mt-6">
        <StarRating rating={4} />
        <p className="ml-2 text-gray-500 text-sm">Reviews</p>
      </div>

      {/* Amenities */}
      <div className="flex flex-col md:flex-row justify-between mt-10 gap-6">
        <div>
          <h2 className="text-2xl font-playfair">
            Experience Luxury Like Never Before
          </h2>

          <div className="flex flex-wrap gap-3 mt-4">
            {room?.amenities?.map((item, i) => (
              <div key={i} className="flex gap-2 bg-gray-100 px-3 py-2 rounded">
                <img src={facilityIcons[item]} className="w-5" />
                <span className="text-xs">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-2xl font-semibold">
          ${room?.pricePerNight} / night
        </p>
      </div>

      {/* Booking */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-6 bg-white shadow p-6 rounded mt-16"
      >
        <input
          type="date"
          required
          onChange={(e) => setCheckInDate(e.target.value)}
          className="input"
        />

        <input
          type="date"
          required
          onChange={(e) => setCheckOutDate(e.target.value)}
          className="input"
        />

        <input
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="input w-20"
        />

        <button className="bg-black text-white px-6 py-2 rounded">
          Book Now
        </button>
      </form>

      {/* Specs */}
      <div className="mt-24 space-y-4">
        {roomCommonData.map((spec, i) => (
          <div key={i} className="flex gap-3">
            <img src={spec.icon} className="w-5" />
            <div>
              <p>{spec.title}</p>
              <p className="text-gray-500 text-sm">
                {spec.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomDetails;