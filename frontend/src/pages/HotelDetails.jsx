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

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const { data } = await axios.get(`/api/hotels/${id}`);

        if (data?.success) {
          setHotel(data.hotel);
          setRooms(data.rooms || []);
          setMainImage(data.hotel?.images?.[0] || "");
        }
      } catch (error) {
        console.error("Hotel details error:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
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

  if (!hotel) {
    return (
      <div className="pt-32 text-center text-xl text-gray-500">
        Hotel not found
      </div>
    );
  }

  return (
    <div className="bg-[#f8f8f8] min-h-screen pt-28 px-4 md:px-10 lg:px-20 pb-20">
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <p className="text-[#00ADEF] text-lg font-medium capitalize">
          {hotel.city} {hotel.area && `• ${hotel.area}`}
        </p>

        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mt-3">
          {hotel.name}
        </h1>

        <div className="flex flex-wrap gap-4 mt-6">
          <div className="bg-[#eef9ff] text-[#00ADEF] px-5 py-3 rounded-xl">
            📍 {hotel.address}
          </div>

          <div className="bg-[#eef9ff] text-[#00ADEF] px-5 py-3 rounded-xl">
            📞 {hotel.contact}
          </div>

          <div className="bg-green-600 text-white px-5 py-3 rounded-xl">
            {rooms.length} Available Rooms
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-5 mt-10">
        <img
          src={mainImage || hotel?.images?.[0] || assets.roomImg}
          alt={hotel.name}
          className="w-full h-[520px] object-cover rounded-3xl"
        />

        <div className="grid grid-cols-2 gap-4">
          {(hotel.images?.length ? hotel.images : [assets.roomImg]).map(
            (img, index) => (
              <img
                key={index}
                src={img}
                alt={`${hotel.name}-${index}`}
                onClick={() => setMainImage(img)}
                className={`h-[250px] w-full object-cover rounded-2xl cursor-pointer border-4 ${
                  mainImage === img ? "border-[#00ADEF]" : "border-transparent"
                }`}
              />
            )
          )}
        </div>
      </div>

      <div className="mt-14">
        <h2 className="text-4xl font-bold text-gray-800">
          Available Rooms
        </h2>

        <p className="text-gray-500 mt-3 text-lg">
          Choose a room, check the price, and continue to booking.
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
            {rooms.map((room) => (
              <div
                key={room._id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition border"
              >
                <img
                  src={room?.images?.[0] || assets.roomImg}
                  alt={room.roomType}
                  className="w-full h-72 object-cover"
                />

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {room.roomType}
                  </h3>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {room?.amenities?.slice(0, 4).map((item, index) => (
                      <span
                        key={index}
                        className="bg-[#eef9ff] text-[#00ADEF] px-3 py-1 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-end justify-between mt-8">
                    <div>
                      <p className="text-gray-500">Price / night</p>

                      <h2 className="text-3xl font-bold text-gray-800 mt-1">
                        {currency}
                        {Number(room.pricePerNight || 0).toLocaleString()}
                      </h2>
                    </div>

                    <button
                      onClick={() => handleRoomClick(room._id)}
                      className="bg-[#00ADEF] hover:bg-[#0095cc] text-white px-5 py-3 rounded-xl font-semibold transition"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelDetails;