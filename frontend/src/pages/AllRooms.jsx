import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { assets } from "../assets/assets";

import { useAppContext } from "../context/AppContext";

const AllRooms = () => {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const { axios, currency } =
    useAppContext();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] =
    useState(true);

  const [sortOption, setSortOption] =
    useState("");

  const destination =
    searchParams.get("destination") ||
    "";

  const guests =
    Number(
      searchParams.get("guests")
    ) || 1;

  // FETCH ROOMS
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } =
          await axios.get("/api/rooms");

        if (data?.success) {
          setRooms(data.rooms || []);
        }
      } catch (error) {
        console.error(
          error.response?.data ||
            error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [axios]);

  // FILTER + SORT
  const filteredRooms = useMemo(() => {
    let filtered = [...rooms];

    if (destination) {
      filtered = filtered.filter(
        (room) =>
          room?.hotel?.city
            ?.toLowerCase()
            .includes(
              destination.toLowerCase()
            )
      );
    }

    filtered = filtered.filter(
      (room) =>
        room.maxGuests >= guests
    );

    if (
      sortOption === "Price Low"
    ) {
      filtered.sort(
        (a, b) =>
          a.pricePerNight -
          b.pricePerNight
      );
    }

    if (
      sortOption === "Price High"
    ) {
      filtered.sort(
        (a, b) =>
          b.pricePerNight -
          a.pricePerNight
      );
    }

    return filtered;
  }, [
    rooms,
    destination,
    guests,
    sortOption,
  ]);

  // NAVIGATE
  const handleNavigate = (id) => {
    navigate(`/rooms/${id}`);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-[#f8f8f8] min-h-screen pt-28 px-4 md:px-10 lg:px-20 pb-20">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Hotels in{" "}
          {destination || "Nigeria"}
        </h1>

        <p className="text-gray-500 text-lg mt-3">
          {filteredRooms.length} hotels
          available
        </p>

        {/* FILTERS */}
        <div className="flex flex-wrap items-center gap-4 mt-8">
          <button className="bg-[#00ADEF] text-white px-5 py-3 rounded-lg font-medium">
            Recommended
          </button>

          <button
            onClick={() =>
              setSortOption(
                "Price Low"
              )
            }
            className="bg-white border px-5 py-3 rounded-lg font-medium hover:border-[#00ADEF]"
          >
            Lowest Price
          </button>

          <button
            onClick={() =>
              setSortOption(
                "Price High"
              )
            }
            className="bg-white border px-5 py-3 rounded-lg font-medium hover:border-[#00ADEF]"
          >
            Highest Price
          </button>
        </div>
      </div>

      {/* ROOMS */}
      {loading ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">
            Loading hotels...
          </p>
        </div>
      ) : filteredRooms.length ===
        0 ? (
        <div className="bg-white rounded-2xl p-16 text-center">
          <h2 className="text-3xl font-bold text-gray-700">
            No hotels found
          </h2>

          <p className="text-gray-500 mt-4">
            Try another city or date.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {filteredRooms.map(
            (room) => (
              <div
                key={room._id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 flex flex-col lg:flex-row"
              >
                {/* IMAGE */}
                <div className="lg:w-[38%] relative">
                  <img
                    src={
                      room?.images?.[0]
                    }
                    alt={
                      room?.hotel
                        ?.name
                    }
                    onClick={() =>
                      handleNavigate(
                        room._id
                      )
                    }
                    className="w-full h-80 lg:h-full object-cover cursor-pointer"
                  />

                  {/* BADGE */}
                  <div className="absolute top-5 left-0 bg-[#00ADEF] text-white px-5 py-2 rounded-r-full font-semibold shadow-lg">
                    Best Deal
                  </div>
                </div>

                {/* DETAILS */}
                <div className="lg:w-[62%] p-8 flex flex-col justify-between">
                  <div>
                    {/* CITY */}
                    <p className="text-[#00ADEF] text-lg font-medium capitalize">
                      {
                        room?.hotel
                          ?.city
                      }
                    </p>

                    {/* NAME */}
                    <h2
                      onClick={() =>
                        handleNavigate(
                          room._id
                        )
                      }
                      className="text-4xl font-bold text-gray-800 mt-2 cursor-pointer hover:text-[#00ADEF]"
                    >
                      {
                        room?.hotel
                          ?.name
                      }
                    </h2>

                    {/* ADDRESS */}
                    <div className="flex items-center gap-2 mt-5 text-gray-500">
                      <img
                        src={
                          assets.locationIcon
                        }
                        alt="location"
                        className="w-5 h-5"
                      />

                      <span className="text-lg">
                        {
                          room?.hotel
                            ?.address
                        }
                      </span>
                    </div>

                    {/* AMENITIES */}
                    <div className="flex flex-wrap gap-3 mt-6">
                      {room?.amenities
                        ?.slice(0, 5)
                        .map(
                          (
                            item,
                            index
                          ) => (
                            <span
                              key={
                                index
                              }
                              className="bg-[#eef9ff] text-[#00ADEF] px-4 py-2 rounded-full text-sm"
                            >
                              {item}
                            </span>
                          )
                        )}
                    </div>

                    {/* DESCRIPTION */}
                    <p className="text-gray-600 text-lg leading-relaxed mt-6">
                      Enjoy premium comfort,
                      fast WiFi, quality
                      hospitality and secure
                      accommodation for your
                      stay.
                    </p>
                  </div>

                  {/* BOTTOM */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mt-10">
                    {/* PRICE */}
                    <div>
                      <p className="text-gray-500">
                        Price per night
                      </p>

                      <h2 className="text-5xl font-bold text-gray-800 mt-2">
                        {currency}
                        {Number(
                          room?.pricePerNight ||
                            99
                        ).toLocaleString()}
                      </h2>
                    </div>

                    {/* BUTTON */}
                    <button
                      onClick={() =>
                        handleNavigate(
                          room._id
                        )
                      }
                      className="bg-[#00ADEF] hover:bg-[#0095cc] text-white px-8 py-4 rounded-xl text-lg font-semibold transition"
                    >
                      View Hotel
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default AllRooms;