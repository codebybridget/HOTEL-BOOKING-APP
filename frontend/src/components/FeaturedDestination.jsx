import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const destinations = [
  {
    city: "Abia",
    hotels: 320,
    image: "/states/abia.jpg",
    areas: ["Umuahia", "Aba", "Ohafia"],
  },
  {
    city: "Adamawa",
    hotels: 145,
    image: "/states/adamawa.jpg",
    areas: ["Yola", "Mubi", "Jimeta"],
  },
  {
    city: "Akwa Ibom",
    hotels: 210,
    image: "/states/akwa-ibom.jpg",
    areas: ["Uyo", "Eket", "Ikot Ekpene"],
  },
  {
    city: "Anambra",
    hotels: 278,
    image: "/states/anambra.jpg",
    areas: ["Awka", "Onitsha", "Nnewi"],
  },
  {
    city: "Bauchi",
    hotels: 180,
    image: "/states/bauchi.jpg",
    areas: ["Bauchi", "Azare", "Misau"],
  },
  {
    city: "Bayelsa",
    hotels: 95,
    image: "/states/bayelsa.jpg",
    areas: ["Yenagoa", "Brass", "Ogbia"],
  },
  {
    city: "Benue",
    hotels: 160,
    image: "/states/benue.jpg",
    areas: ["Makurdi", "Gboko", "Otukpo"],
  },
  {
    city: "Borno",
    hotels: 120,
    image: "/states/borno.jpg",
    areas: ["Maiduguri", "Biu", "Konduga"],
  },
  {
    city: "Cross River",
    hotels: 290,
    image: "/states/cross-river.jpg",
    areas: ["Calabar", "Tinapa", "Marian"],
  },
  {
    city: "Delta",
    hotels: 410,
    image: "/states/delta.jpg",
    areas: ["Asaba", "Warri", "Effurun"],
  },
  {
    city: "Ebonyi",
    hotels: 88,
    image: "/states/ebonyi.jpg",
    areas: ["Abakaliki", "Afikpo", "Onueke"],
  },
  {
    city: "Edo",
    hotels: 520,
    image: "/states/edo.jpg",
    areas: ["Benin City", "GRA", "Sapele Road"],
  },
  {
    city: "Ekiti",
    hotels: 133,
    image: "/states/ekiti.jpg",
    areas: ["Ado Ekiti", "Ikere", "Iyin"],
  },
  {
    city: "Enugu",
    hotels: 260,
    image: "/states/enugu.jpg",
    areas: ["Independence Layout", "New Haven", "GRA", "Trans Ekulu"],
  },
  {
    city: "Gombe",
    hotels: 105,
    image: "/states/gombe.jpg",
    areas: ["Gombe", "Kumo", "Billiri"],
  },
  {
    city: "Imo",
    hotels: 260,
    image: "/states/imo.jpg",
    areas: ["Owerri", "Orlu", "Okigwe"],
  },
  {
    city: "Jigawa",
    hotels: 70,
    image: "/states/jigawa.jpg",
    areas: ["Dutse", "Hadejia", "Kazaure"],
  },
  {
    city: "Kaduna",
    hotels: 332,
    image: "/states/kaduna.jpg",
    areas: ["Kaduna North", "Kaduna South", "Zaria"],
  },
  {
    city: "Kano",
    hotels: 610,
    image: "/states/kano.jpg",
    areas: ["Nassarawa", "Bompai", "Sabon Gari"],
  },
  {
    city: "Katsina",
    hotels: 144,
    image: "/states/katsina.jpg",
    areas: ["Katsina", "Daura", "Funtua"],
  },
  {
    city: "Kebbi",
    hotels: 90,
    image: "/states/kebbi.jpg",
    areas: ["Birnin Kebbi", "Argungu", "Yauri"],
  },
  {
    city: "Kogi",
    hotels: 150,
    image: "/states/kogi.jpg",
    areas: ["Lokoja", "Anyigba", "Okene"],
  },
  {
    city: "Kwara",
    hotels: 135,
    image: "/states/kwara.jpg",
    areas: ["Ilorin", "Offa", "Omu Aran"],
  },
  {
    city: "Lagos",
    hotels: 3659,
    image: "/states/lagos.jpg",
    areas: ["Ikoyi", "Victoria Island", "Lekki", "Ikeja", "Yaba", "Ajah"],
  },
  {
    city: "Nasarawa",
    hotels: 112,
    image: "/states/nasarawa.jpg",
    areas: ["Lafia", "Keffi", "Akwanga"],
  },
  {
    city: "Niger",
    hotels: 98,
    image: "/states/niger.jpg",
    areas: ["Minna", "Suleja", "Bida"],
  },
  {
    city: "Ogun",
    hotels: 405,
    image: "/states/ogun.jpg",
    areas: ["Abeokuta", "Ijebu Ode", "Sagamu"],
  },
  {
    city: "Ondo",
    hotels: 170,
    image: "/states/ondo.jpg",
    areas: ["Akure", "Ondo Town", "Owo"],
  },
  {
    city: "Osun",
    hotels: 155,
    image: "/states/osun.jpg",
    areas: ["Osogbo", "Ile Ife", "Ilesa"],
  },
  {
    city: "Oyo",
    hotels: 524,
    image: "/states/oyo.jpg",
    areas: ["Ibadan", "Bodija", "Ring Road"],
  },
  {
    city: "Plateau",
    hotels: 240,
    image: "/states/plateau.jpg",
    areas: ["Jos", "Rayfield", "Bukuru"],
  },
  {
    city: "Rivers",
    hotels: 453,
    image: "/states/rivers.jpg",
    areas: ["GRA", "Old GRA", "Trans Amadi", "Ada George", "Rumuola"],
  },
  {
    city: "Sokoto",
    hotels: 130,
    image: "/states/sokoto.jpg",
    areas: ["Sokoto", "Wamakko", "Tambuwal"],
  },
  {
    city: "Taraba",
    hotels: 118,
    image: "/states/taraba.jpg",
    areas: ["Jalingo", "Wukari", "Takum"],
  },
  {
    city: "Yobe",
    hotels: 90,
    image: "/states/yobe.jpg",
    areas: ["Damaturu", "Potiskum", "Gashua"],
  },
  {
    city: "Zamfara",
    hotels: 76,
    image: "/states/zamfara.jpg",
    areas: ["Gusau", "Kaura Namoda", "Talata Mafara"],
  },
  {
    city: "Abuja",
    hotels: 1298,
    image: "/states/abuja.jpg",
    areas: ["Maitama", "Wuse", "Asokoro", "Garki", "Jabi", "Utako"],
  },
];

const FeaturedDestination = () => {
  const navigate = useNavigate();
  const areasRef = useRef(null);

  const [selectedCity, setSelectedCity] = useState(null);

  const selectedDestination = useMemo(
    () => destinations.find((item) => item.city === selectedCity),
    [selectedCity]
  );

  const handleSelectCity = (city) => {
    setSelectedCity(city);

    setTimeout(() => {
      areasRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleNavigate = (city, area = "") => {
    let url = `/rooms?destination=${city.toLowerCase()}`;

    if (area) {
      url += `&area=${area.toLowerCase()}`;
    }

    navigate(url);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-white py-24 px-6 md:px-16 lg:px-24 xl:px-32">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-700">
          Popular cities with QuickStay travellers
        </h2>

        <p className="mt-5 text-lg text-gray-500">
          Choose a state, select an area, then view hotels and available rooms.
        </p>

        <div className="w-24 h-1 bg-[#00ADEF] mx-auto mt-6 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
        {destinations.map((destination) => (
          <button
            key={destination.city}
            type="button"
            onClick={() => handleSelectCity(destination.city)}
            className={`relative rounded-xl overflow-hidden h-[320px] group border-4 ${
              selectedCity === destination.city
                ? "border-[#00ADEF]"
                : "border-transparent"
            }`}
          >
            <img
              src={destination.image}
              alt={destination.city}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
            />

            <div className="absolute inset-0 bg-black/45" />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
              <p className="text-4xl font-light">
                {destination.hotels.toLocaleString()}
              </p>

              <h3 className="text-4xl md:text-5xl font-bold mt-3">
                {destination.city}
              </h3>

              <p className="mt-4 text-lg">
                Tap to explore areas
              </p>
            </div>
          </button>
        ))}
      </div>

      <div ref={areasRef}>
        {selectedDestination && (
          <div className="mt-20 bg-[#f8f8f8] rounded-3xl p-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-4xl font-bold text-gray-800">
                  {selectedDestination.city} Areas
                </h2>

                <p className="text-gray-500 mt-3">
                  Choose one area to see hotels available there.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleNavigate(selectedDestination.city)}
                className="bg-[#00ADEF] text-white px-6 py-3 rounded-xl font-semibold"
              >
                View All Hotels
              </button>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              {selectedDestination.areas.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => handleNavigate(selectedDestination.city, area)}
                  className="bg-white hover:bg-[#00ADEF] hover:text-white text-[#00ADEF] border border-[#00ADEF]/30 px-6 py-4 rounded-xl text-lg font-medium transition"
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedDestination;