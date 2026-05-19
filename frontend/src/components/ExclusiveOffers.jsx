import React from "react";
import Title from "./Title";
import { assets, exclusiveOffers } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const ExclusiveOffers = () => {
  const navigate = useNavigate();

  // =========================
  // VIEW ALL
  // =========================
  const handleViewAll = () => {
    navigate("/rooms");
  };

  // =========================
  // VIEW OFFER
  // =========================
  const handleViewOffer = () => {
    navigate("/rooms");
  };

  return (
    <section className="flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 py-24">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-6">
        <Title
          align="left"
          title="Exclusive Offers"
          subTitle="Take advantage of our limited-time hotel deals and premium packages designed to make your stay more affordable, comfortable, and unforgettable."
        />

        <button
          type="button"
          onClick={handleViewAll}
          className="group flex items-center gap-2 text-sm font-medium cursor-pointer"
        >
          View All Offers

          <img
            src={assets.arrowIcon}
            alt="arrow"
            className="group-hover:translate-x-1 transition"
          />
        </button>
      </div>

      {/* OFFERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 w-full">
        {exclusiveOffers.map((item) => (
          <div
            key={item._id}
            className="relative flex flex-col justify-between rounded-2xl overflow-hidden min-h-[340px] shadow-lg"
            style={{
              backgroundImage: `url(${item.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* CONTENT */}
            <div className="relative z-10 flex flex-col justify-between h-full p-6 text-white">
              {/* DISCOUNT */}
              <div>
                <span className="inline-block text-xs bg-white text-black font-semibold px-3 py-1 rounded-full">
                  {item.priceOff}% OFF
                </span>
              </div>

              {/* DETAILS */}
              <div>
                <h3 className="text-2xl font-playfair font-semibold">
                  {item.title}
                </h3>

                <p className="text-sm text-white/90 mt-2 leading-relaxed">
                  {item.description}
                </p>

                <p className="text-xs text-white/70 mt-4">
                  Expires {item.expiryDate}
                </p>

                {/* BUTTON */}
                <button
                  type="button"
                  onClick={() => handleViewOffer(item._id)}
                  className="group flex items-center gap-2 mt-5 text-sm font-medium"
                >
                  Book Now

                  <img
                    src={assets.arrowIcon}
                    alt="arrow"
                    className="invert group-hover:translate-x-1 transition"
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExclusiveOffers;