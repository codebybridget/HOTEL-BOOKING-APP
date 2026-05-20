import React from "react";
import { useNavigate } from "react-router-dom";

const destinations = [
  ["Abia", 320, "/states/abia.jpg"],
  ["Adamawa", 145, "/states/adamawa.jpg"],
  ["Akwa Ibom", 210, "/states/akwa-ibom.jpg"],
  ["Anambra", 278, "/states/anambra.jpg"],
  ["Bauchi", 180, "/states/bauchi.jpg"],
  ["Bayelsa", 95, "/states/bayelsa.jpg"],
  ["Benue", 160, "/states/benue.jpg"],
  ["Borno", 120, "/states/borno.jpg"],
  ["Cross River", 290, "/states/cross-river.jpg"],
  ["Delta", 410, "/states/delta.jpg"],
  ["Ebonyi", 88, "/states/ebonyi.jpg"],
  ["Edo", 520, "/states/edo.jpg"],
  ["Ekiti", 133, "/states/ekiti.jpg"],
  ["Enugu", 260, "/states/enugu.jpg"],
  ["Gombe", 105, "/states/gombe.jpg"],
  ["Imo", 260, "/states/imo.jpg"],
  ["Jigawa", 70, "/states/jigawa.jpg"],
  ["Kaduna", 332, "/states/kaduna.jpg"],
  ["Kano", 610, "/states/kano.jpg"],
  ["Katsina", 144, "/states/katsina.jpg"],
  ["Kebbi", 90, "/states/kebbi.jpg"],
  ["Kogi", 150, "/states/kogi.jpg"],
  ["Kwara", 135, "/states/kwara.jpg"],
  ["Lagos", 3659, "/states/lagos.jpg"],
  ["Nasarawa", 112, "/states/nasarawa.jpg"],
  ["Niger", 98, "/states/niger.jpg"],
  ["Ogun", 405, "/states/ogun.jpg"],
  ["Ondo", 170, "/states/ondo.jpg"],
  ["Osun", 155, "/states/osun.jpg"],
  ["Oyo", 524, "/states/oyo.jpg"],
  ["Plateau", 240, "/states/plateau.jpg"],
  ["Rivers", 453, "/states/rivers.jpg"],
  ["Sokoto", 130, "/states/sokoto.jpg"],
  ["Taraba", 118, "/states/taraba.jpg"],
  ["Yobe", 90, "/states/yobe.jpg"],
  ["Zamfara", 76, "/states/zamfara.jpg"],
  ["Abuja", 1298, "/states/abuja.jpg"],
];

const FeaturedDestination = () => {
  const navigate = useNavigate();

  const handleNavigate = (city) => {
    navigate(`/rooms?destination=${city.toLowerCase()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="bg-white py-24 px-6 md:px-16 lg:px-24 xl:px-32">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-700">
          Popular cities with QuickStay travellers
        </h2>

        <p className="mt-5 text-lg text-gray-500">
          See the top destinations people are traveling to
        </p>

        <div className="w-24 h-1 bg-[#00ADEF] mx-auto mt-6 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
        {destinations.map(([city, hotels, image]) => (
          <button
            key={city}
            onClick={() => handleNavigate(city)}
            className="relative rounded-xl overflow-hidden h-[320px] group"
          >
            <img
              src={image}
              alt={`${city} hotels`}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
            />

            <div className="absolute inset-0 bg-black/45" />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
              <p className="text-4xl font-light">
                {hotels.toLocaleString()}
              </p>

              <h3 className="text-4xl md:text-5xl font-bold mt-3">
                {city} Hotels
              </h3>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default FeaturedDestination;