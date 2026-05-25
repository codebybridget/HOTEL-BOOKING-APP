import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios, currency } = useAppContext();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString();
  };

  const getAvailableRooms = (room) => {
    return Math.max(
      Number(room?.totalRooms || 0) - Number(room?.bookedRooms || 0),
      0
    );
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchHotelDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await axios.get(`/api/hotels/${id}`, {
          signal: controller.signal,
        });

        if (data?.success) {
          setHotel(data.hotel);
          setRooms(data.rooms || []);
          setMainImage(data.hotel?.images?.[0] || "");
        } else {
          setError(data?.message || "Hotel not found");
        }
      } catch (error) {
        if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
          return;
        }

        console.error(
          "Hotel details error:",
          error.response?.data || error.message
        );

        setError(
          error.response?.data?.message ||
            "Unable to load hotel details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();

    return () => controller.abort();
  }, [axios, id]);

  const handleRoomClick = (roomId) => {
    navigate(`/rooms/${roomId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="pt-32 text-center text-xl text-gray-500">
        Loading hotel...
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="pt-32 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-700">
          {error || "Hotel not found"}
        </h2>

        <button
          onClick={() => navigate(-1)}
          className="mt-6 bg-[#00ADEF] hover:bg-[#0095cc] text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const hotelImages = hotel.images?.length ? hotel.images : [assets.roomImg];

  return (
    <div className="bg-[#f8f8f8] min-h-screen pt-28 px-4 md:px-10 lg:px-20 pb-20 overflow-x-hidden">
      <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-sm">
        <p className="text-[#00ADEF] text-lg font-medium capitalize">
          {hotel.city} • {hotel.area}
        </p>

        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-800 mt-3">
          {hotel.name}
        </h1>

        <div className="flex flex-wrap gap-4 mt-6">
          <div className="bg-[#eef9ff] text-[#00ADEF] px-5 py-3 rounded-xl break-words">
            📍 {hotel.address}
          </div>

          <div className="bg-[#eef9ff] text-[#00ADEF] px-5 py-3 rounded-xl">
            📞 {hotel.contact}
          </div>

          <div className="bg-green-600 text-white px-5 py-3 rounded-xl font-semibold">
            {rooms.length} Room Types Available
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-5 mt-10">
        <img
          src={mainImage || hotelImages[0]}
          alt={`${hotel.name} main view`}
          className="w-full h-[280px] sm:h-[420px] lg:h-[520px] object-cover rounded-3xl"
        />

        <div className="grid grid-cols-2 gap-4">
          {hotelImages.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setMainImage(img)}
              className={`rounded-2xl border-4 overflow-hidden focus:outline-none ${
                mainImage === img ? "border-[#00ADEF]" : "border-transparent"
              }`}
            >
              <img
                src={img}
                alt={`${hotel.name} preview ${index + 1}`}
                loading="lazy"
                className="h-[120px] sm:h-[250px] w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-14">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
          Available Rooms
        </h2>

        <p className="text-gray-500 mt-3 text-lg">
          Choose your preferred room and continue booking.
        </p>

        {rooms.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 mt-8 text-center">
            <h3 className="text-2xl font-bold text-gray-700">
              No rooms available
            </h3>

            <p className="text-gray-500 mt-3">
              This hotel has not uploaded rooms yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-10">
            {rooms.map((room) => {
              const availableRooms = getAvailableRooms(room);
              const isSoldOut = availableRooms <= 0 || !room?.isAvailable;

              return (
                <div
                  key={room._id}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition border"
                >
                  <img
                    src={room?.images?.[0] || assets.roomImg}
                    alt={room.roomType || "Hotel room"}
                    loading="lazy"
                    className="w-full h-72 object-cover"
                  />

                  <div className="p-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                      {room.roomType}
                    </h3>

                    <p className="text-gray-500 mt-3 leading-relaxed text-sm sm:text-base">
                      {room.description ||
                        "Spacious and luxurious room designed for comfort and premium stay experience."}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-4">
                      <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">
                        👥 Max Guests: {room.maxGuests || 2}
                      </span>

                      <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                        🏨 Total Rooms: {room.totalRooms || 0}
                      </span>

                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                        ✅ Available: {availableRooms}
                      </span>

                      <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold">
                        📌 Booked: {room.bookedRooms || 0}
                      </span>

                      {isSoldOut && (
                        <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-bold">
                          SOLD OUT
                        </span>
                      )}
                    </div>

                    {room?.amenities?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-5">
                        {room.amenities.slice(0, 4).map((item, index) => (
                          <span
                            key={index}
                            className="bg-[#eef9ff] text-[#00ADEF] px-3 py-1 rounded-full text-sm"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mt-8">
                      <div>
                        <p className="text-gray-500">Price / night</p>

                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-1">
                          {currency}
                          {formatPrice(room.pricePerNight)}
                        </h2>
                      </div>

                      <button
                        disabled={isSoldOut}
                        onClick={() => handleRoomClick(room._id)}
                        className={`px-6 py-3 rounded-xl font-semibold transition ${
                          isSoldOut
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-[#00ADEF] hover:bg-[#0095cc] text-white"
                        }`}
                      >
                        {isSoldOut ? "Sold Out" : "Book Now"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelDetails;