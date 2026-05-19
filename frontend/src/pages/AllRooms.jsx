import React, { useEffect, useMemo, useState } from "react";
import { assets, facilityIcons } from "../assets/assets";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import StarRating from "../components/StarRating";
import { useAppContext } from "../context/AppContext";

// =========================
// CHECKBOX
// =========================
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

// =========================
// RADIO
// =========================
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

  const [searchParams] = useSearchParams();

  const { axios, currency } = useAppContext();

  const [openFilters, setOpenFilters] = useState(false);

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);

  const [sortOption, setSortOption] = useState("");

  // SEARCH PARAMS
  const destination =
    searchParams.get("destination") || "";

  const checkInDate =
    searchParams.get("checkInDate") || "";

  const checkOutDate =
    searchParams.get("checkOutDate") || "";

  const guests =
    Number(searchParams.get("guests")) || 1;

  const roomTypes = [
    "Single Bed",
    "Double Bed",
    "Luxury Room",
    "Family Suite",
  ];

  const priceRanges = [
    "0 to 50000",
    "50000 to 100000",
    "100000 to 200000",
    "200000 to 500000",
  ];

  const sortOptions = [
    "Price Low to High",
    "Price High to Low",
    "Newest First",
  ];

  // =========================
  // NAVIGATE
  // =========================
  const handleNavigate = (id) => {
    navigate(`/rooms/${id}`);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // FETCH ROOMS
  // =========================
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await axios.get("/api/rooms");

        if (data?.success) {
          setRooms(data.rooms || []);
        } else {
          setRooms([]);
        }
      } catch (error) {
        console.error(
          "Fetch rooms error:",
          error.response?.data || error.message
        );

        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [axios]);

  // =========================
  // FILTERS
  // =========================
  const toggleType = (label, checked) => {
    setSelectedTypes((prev) =>
      checked
        ? [...prev, label]
        : prev.filter((item) => item !== label)
    );
  };

  const togglePrice = (label, checked) => {
    setSelectedPrices((prev) =>
      checked
        ? [...prev, label]
        : prev.filter((item) => item !== label)
    );
  };

  // =========================
  // FILTER + SEARCH + SORT
  // =========================
  const filteredRooms = useMemo(() => {
    let filtered = [...rooms];

    // DESTINATION SEARCH
    if (destination) {
      filtered = filtered.filter((room) =>
        room?.hotel?.city
          ?.toLowerCase()
          .includes(destination.toLowerCase())
      );
    }

    // GUEST FILTER
    filtered = filtered.filter(
      (room) => room.maxGuests >= guests
    );

    // ROOM TYPE FILTER
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((room) =>
        selectedTypes.includes(room.roomType)
      );
    }

    // PRICE FILTER
    if (selectedPrices.length > 0) {
      filtered = filtered.filter((room) => {
        return selectedPrices.some((range) => {
          const [min, max] = range
            .split(" to ")
            .map(Number);

          return (
            room.pricePerNight >= min &&
            room.pricePerNight <= max
          );
        });
      });
    }

    // SORTING
    if (sortOption === "Price Low to High") {
      filtered.sort(
        (a, b) => a.pricePerNight - b.pricePerNight
      );
    }

    if (sortOption === "Price High to Low") {
      filtered.sort(
        (a, b) => b.pricePerNight - a.pricePerNight
      );
    }

    if (sortOption === "Newest First") {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );
    }

    return filtered;
  }, [
    rooms,
    selectedTypes,
    selectedPrices,
    sortOption,
    destination,
    guests,
    checkInDate,
    checkOutDate,
  ]);

  return (
    <div className="flex flex-col pt-28 md:pt-36 px-4 md:px-16 lg:px-24 xl:px-32 w-full">
      {/* HEADER */}
      <div className="mb-12">
        <h1 className="font-playfair text-3xl md:text-[40px] text-gray-800">
          Hotel Rooms
        </h1>

        <p className="text-sm md:text-base text-gray-500 mt-2 max-w-xl">
          Explore available rooms and book your perfect stay.
        </p>

        {destination && (
          <p className="mt-3 text-sm text-blue-600">
            Showing rooms in {destination}
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* FILTERS */}
        <div className="order-1 lg:order-2 w-full lg:w-80 border rounded-lg h-fit">
          <div className="flex justify-between px-5 py-3 border-b">
            <p className="font-medium">FILTERS</p>

            <span
              onClick={() =>
                setOpenFilters(!openFilters)
              }
              className="text-xs cursor-pointer lg:hidden"
            >
              {openFilters ? "HIDE" : "SHOW"}
            </span>
          </div>

          <div
            className={`${
              openFilters ? "block" : "hidden"
            } lg:block p-5`}
          >
            <p className="font-medium mb-2">
              Room Type
            </p>

            {roomTypes.map((item) => (
              <CheckBox
                key={item}
                label={item}
                selected={selectedTypes.includes(
                  item
                )}
                onChange={toggleType}
              />
            ))}

            <p className="font-medium mt-5 mb-2">
              Price Range
            </p>

            {priceRanges.map((item) => (
              <CheckBox
                key={item}
                label={item}
                selected={selectedPrices.includes(
                  item
                )}
                onChange={togglePrice}
              />
            ))}

            <p className="font-medium mt-5 mb-2">
              Sort By
            </p>

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

        {/* ROOMS */}
        <div className="order-2 lg:order-1 flex flex-col gap-8 w-full">
          {loading ? (
            <p>Loading rooms...</p>
          ) : filteredRooms.length === 0 ? (
            <p>No rooms available</p>
          ) : (
            filteredRooms.map((room) => (
              <div
                key={room._id}
                className="flex flex-col md:flex-row gap-6 border-b pb-8"
              >
                <img
                  src={room?.images?.[0]}
                  alt={room?.hotel?.name}
                  onClick={() =>
                    handleNavigate(room._id)
                  }
                  className="md:w-1/2 h-60 object-cover rounded-xl cursor-pointer"
                />

                <div className="md:w-1/2 flex flex-col gap-2">
                  <p className="text-gray-500 text-sm capitalize">
                    {room?.hotel?.city}
                  </p>

                  <h2
                    onClick={() =>
                      handleNavigate(room._id)
                    }
                    className="text-2xl font-playfair cursor-pointer"
                  >
                    {room?.hotel?.name}
                  </h2>

                  <div className="flex items-center">
                    <StarRating />

                    <p className="ml-2 text-sm text-gray-500">
                      Reviews
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                    <img
                      src={assets.locationIcon}
                      alt="Location"
                      className="w-4"
                    />

                    <span>
                      {room?.hotel?.address}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-3">
                    {room?.amenities?.map(
                      (item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg"
                        >
                          <img
                            src={
                              facilityIcons[item]
                            }
                            alt={item}
                            className="w-4 h-4"
                          />

                          <span className="text-xs">
                            {item}
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  <p className="text-lg font-semibold text-gray-800 mt-3">
                    {currency}
                    {Number(
                      room?.pricePerNight || 0
                    ).toLocaleString()}{" "}
                    / night
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