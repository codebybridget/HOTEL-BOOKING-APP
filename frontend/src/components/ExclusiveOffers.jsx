import React from "react";
import { useNavigate } from "react-router-dom";

const offers = [
  {
    id: 1,
    title: "Florence Hotel",
    city: "Benin, Edo",
    discount: "20%",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "Luxury Suites",
    city: "Ikeja, Lagos",
    discount: "21%",
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "Delta Continental",
    city: "Asaba, Delta",
    discount: "19%",
    image:
      "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=1200&q=80",
  },
];

const ExclusiveOffers = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/rooms");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-[#f8f8f8] py-20 px-5 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-700">
            Today's Top Hotel Deals
          </h2>

          <p className="text-xl md:text-2xl text-gray-600 mt-5 max-w-3xl mx-auto">
            A selection of the best hotel deals, only
            available today
          </p>

          <div className="w-28 h-1.5 bg-[#00ADEF] mx-auto mt-8 rounded-full"></div>
        </div>

        {/* OFFERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {offers.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg overflow-hidden shadow-md"
            >
              {/* IMAGE */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />

                {/* DISCOUNT BADGE */}
                <div className="absolute top-5 left-0 bg-orange-500 text-white px-6 py-3 text-2xl font-bold shadow-lg">
                  Up to {item.discount} off
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-8">
                <h3 className="text-3xl font-bold text-[#00ADEF] line-clamp-1">
                  {item.title}
                </h3>

                <p className="text-2xl text-gray-600 mt-4">
                  {item.city}
                </p>

                <button
                  type="button"
                  onClick={handleNavigate}
                  className="mt-8 bg-[#00ADEF] hover:bg-[#0095cc] text-white px-6 py-3 rounded-lg text-lg font-semibold transition"
                >
                  Book Hotel
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* APP DOWNLOAD SECTION */}
        <div className="bg-[#e8f7ff] rounded-2xl mt-24 p-10 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* TEXT */}
          <div className="max-w-xl">
            <h2 className="text-5xl font-bold text-[#00ADEF] leading-tight">
              Get the QuickStay app
            </h2>

            <h3 className="text-4xl font-bold text-gray-700 mt-6 leading-tight">
              Download the QuickStay app and book a hotel instantly
            </h3>

            <p className="text-xl text-gray-600 mt-6 leading-relaxed">
              Book your hotel instantly with our Android
              and iOS Apps.
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