import React from "react";
import { useState, useEffect } from "react";
import { assets, facilityIcons } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/AppContext";

// Checkbox
const CheckBox = ({ label, selected, onChange }) => (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
    <input
      type="checkbox"
      checked={selected}
      onChange={(e) => onChange(label, e.target.checked)}
    />
    <span className="font-light select-none">{label}</span>
  </label>
);

// Radio
const RadioButton = ({ label, selected, onChange }) => (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
    <input
      type="radio"
      name="sortOption"
      checked={selected}
      onChange={() => onChange(label)}
    />
    <span className="font-light select-none">{label}</span>
  </label>
);

const AllRooms = () => {
  const navigate = useNavigate();
  const { axios } = useAppContext();

  const [openFilters, setOpenFilters] = useState(false);

  // 🔥 NEW STATE
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [sortOption, setSortOption] = useState("");

  const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Suite"];
  const priceRanges = ["0 to 500", "500 to 1000", "1000 to 2000", "2000 to 3000"];
  const sortOptions = ["price low to High", "price High to low", "Newest First"];

  const handleNavigate = (id) => {
    navigate(`/rooms/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // =========================
  // FETCH ROOMS FROM BACKEND
  // =========================
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await axios.get("/api/rooms");

        if (data.success) {
          setRooms(data.rooms);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const toggleType = (label, checked) => {
    setSelectedTypes((prev) =>
      checked ? [...prev, label] : prev.filter((item) => item !== label)
    );
  };

  const togglePrice = (label, checked) => {
    setSelectedPrices((prev) =>
      checked ? [...prev, label] : prev.filter((item) => item !== label)
    );
  };

  return (
    <div className="flex flex-col pt-28 md:pt-36 px-4 md:px-16 lg:px-24 xl:px-32 w-full">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-playfair text-3xl md:text-[40px] text-gray-800">
          Hotel Rooms
        </h1>
        <p className="text-sm md:text-base text-gray-500 mt-2 max-w-xl">
          Explore available rooms and book your perfect stay.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <div className="order-1 lg:order-2 w-full lg:w-80 border rounded-lg">
          <div className="flex justify-between px-5 py-3 border-b">
            <p className="font-medium">FILTERS</p>
            <span
              onClick={() => setOpenFilters(!openFilters)}
              className="text-xs cursor-pointer lg:hidden"
            >
              {openFilters ? "HIDE" : "SHOW"}
            </span>
          </div>

          <div className={`${openFilters ? "block" : "hidden"} lg:block p-5`}>
            <p className="font-medium mb-2">Room Type</p>
            {roomTypes.map((item) => (
              <CheckBox
                key={item}
                label={item}
                selected={selectedTypes.includes(item)}
                onChange={toggleType}
              />
            ))}

            <p className="font-medium mt-5 mb-2">Price Range</p>
            {priceRanges.map((item) => (
              <CheckBox
                key={item}
                label={item}
                selected={selectedPrices.includes(item)}
                onChange={togglePrice}
              />
            ))}

            <p className="font-medium mt-5 mb-2">Sort By</p>
            {sortOptions.map((item) => (
              <RadioButton
                key={item}
                label={item}
                selected={sortOption === item}
                onChange={setSortOption}
              />
            ))}
          </div>
        </div>

        {/* Rooms */}
        <div className="order-2 lg:order-1 flex flex-col gap-8 w-full">
          {loading ? (
            <p>Loading rooms...</p>
          ) : rooms.length === 0 ? (
            <p>No rooms available</p>
          ) : (
            rooms.map((room) => (
              <div
                key={room._id}
                className="flex flex-col md:flex-row gap-6 border-b pb-8"
              >
                <img
                  src={room?.images?.[0]}
                  alt={room?.hotel?.name}
                  onClick={() => handleNavigate(room._id)}
                  className="md:w-1/2 h-60 object-cover rounded-xl cursor-pointer"
                />

                <div className="md:w-1/2 flex flex-col gap-2">
                  <p className="text-gray-500 text-sm">
                    {room?.hotel?.city}
                  </p>

                  <h2
                    onClick={() => handleNavigate(room._id)}
                    className="text-2xl font-playfair cursor-pointer"
                  >
                    {room?.hotel?.name}
                  </h2>

                  <div className="flex items-center">
                    <StarRating />
                    <p className="ml-2 text-sm text-gray-500">Reviews</p>
                  </div>

                  <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                    <img src={assets.locationIcon} className="w-4" />
                    <span>{room?.hotel?.address}</span>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-3">
                    {room?.amenities?.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                        <img src={facilityIcons[item]} className="w-4 h-4" />
                        <span className="text-xs">{item}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-lg font-semibold text-gray-800 mt-3">
                    ${room?.pricePerNight} / night
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AllRooms;