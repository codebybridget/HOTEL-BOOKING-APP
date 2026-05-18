import React from "react";
import Title from "./Title";
import { assets, exclusiveOffers } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const ExclusiveOffers = () => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    // later: route to offers page
    console.log("View all offers");
  };

  const handleViewOffer = (id) => {
    // later: navigate(`/offers/${id}`)
    console.log("View offer:", id);
  };

  return (
    <section className="flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 py-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6">
        <Title
          align="left"
          title="Exclusive Offers"
          subTitle="Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories."
        />

        <button
          type="button"
          onClick={handleViewAll}
          className="group flex items-center gap-2 font-medium cursor-pointer"
        >
          View All Offers
          <img
            src={assets.arrowIcon}
            alt="arrow"
            className="group-hover:translate-x-1 transition"
          />
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 w-full">
        {exclusiveOffers.map((item) => (
          <div
            key={item._id}
            className="relative flex flex-col justify-between rounded-xl overflow-hidden min-h-[300px]"
            style={{ backgroundImage: `url(${item.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-between h-full p-5 text-white">
              {/* Badge */}
              <span className="text-xs bg-white text-gray-800 font-medium px-3 py-1 rounded-full w-fit">
                {item.priceOff}% OFF
              </span>

              {/* Info */}
              <div>
                <p className="text-xl font-semibold font-playfair">
                  {item.title}
                </p>
                <p className="text-sm mt-1">{item.description}</p>
                <p className="text-xs text-white/70 mt-3">
                  Expires {item.expiryDate}
                </p>
              </div>

              {/* CTA */}
              <button
                type="button"
                onClick={() => handleViewOffer(item._id)}
                className="flex items-center gap-2 font-medium mt-4"
              >
                View Offer
                <img
                  src={assets.arrowIcon}
                  alt="arrow"
                  className="invert group-hover:translate-x-1 transition"
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExclusiveOffers;