import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const ExclusiveOffers = () => {
  const navigate = useNavigate();
  const { axios } = useAppContext();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const { data } = await axios.get("/api/hotels");

        if (data?.success) {
          setHotels(data.hotels || []);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [axios]);

  const handleNavigate = (hotelId) => {
    navigate(`/hotels/${hotelId}`);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-[#f8f8f8] py-20 px-5 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-700">
            Featured Hotels Across Nigeria
          </h2>

          <p className="text-xl md:text-2xl text-gray-600 mt-5 max-w-4xl mx-auto">
            Explore hotels, luxury suites, apartments,
            and resorts from all states in Nigeria.
          </p>

          <div className="w-28 h-1.5 bg-[#00ADEF] mx-auto mt-8 rounded-full"></div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="text-center py-24">
            <p className="text-2xl text-gray-500">
              Loading hotels...
            </p>
          </div>
        ) : hotels.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center mt-16 shadow">
            <h2 className="text-3xl font-bold text-gray-700">
              No hotels uploaded yet
            </h2>

            <p className="text-gray-500 text-lg mt-4">
              Uploaded hotels will appear here automatically.
            </p>
          </div>
        ) : (
          /* HOTELS */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {hotels.map((hotel, index) => (
              <div
                key={hotel._id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300"
              >
                {/* IMAGE */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={
                      hotel?.images?.[0] ||
                      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
                    }
                    alt={hotel?.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />

                  {/* DISCOUNT BADGE */}
                  <div className="absolute top-5 left-0 bg-orange-500 text-white px-6 py-3 text-2xl font-bold shadow-lg">
                    Up to {18 + index}% off
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-8">
                  {/* HOTEL NAME */}
                  <h3 className="text-3xl font-bold text-[#00ADEF] line-clamp-1">
                    {hotel?.name}
                  </h3>

                  {/* LOCATION */}
                  <p className="text-2xl text-gray-600 mt-4 capitalize">
                    {hotel?.area}, {hotel?.city}
                  </p>

                  {/* ADDRESS */}
                  <p className="text-gray-500 mt-4 line-clamp-2">
                    {hotel?.address}
                  </p>

                  {/* PHONE */}
                  <p className="text-gray-700 mt-3 font-medium">
                    {hotel?.contact}
                  </p>

                  {/* BUTTON */}
                  <button
                    type="button"
                    onClick={() =>
                      handleNavigate(hotel._id)
                    }
                    className="mt-8 bg-[#00ADEF] hover:bg-[#0095cc] text-white px-6 py-3 rounded-lg text-lg font-semibold transition"
                  >
                    View Hotel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* APP DOWNLOAD SECTION */}
        <div className="bg-[#e8f7ff] rounded-2xl mt-24 p-10 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* TEXT */}
          <div className="max-w-xl">
            <h2 className="text-5xl font-bold text-[#00ADEF] leading-tight">
              Get the QuickStay app
            </h2>

            <h3 className="text-4xl font-bold text-gray-700 mt-6 leading-tight">
              Download the QuickStay app and book hotels instantly
            </h3>

            <p className="text-xl text-gray-600 mt-6 leading-relaxed">
              Explore hotels from Lagos, Abuja,
              Port Harcourt, Calabar, Uyo,
              Kano, Enugu and all states in Nigeria.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-5 mt-10">
              <button className="bg-black text-white px-8 py-4 rounded-xl text-lg font-semibold">
                Google Play
              </button>

              <button className="bg-black text-white px-8 py-4 rounded-xl text-lg font-semibold">
                App Store
              </button>
            </div>
          </div>

          {/* IMAGE */}
          <div className="flex items-center justify-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png"
              alt="mobile app"
              className="w-72 md:w-96"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExclusiveOffers;