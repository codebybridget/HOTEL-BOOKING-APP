import React, { useState } from "react";
import { assets, cities } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [destination, setDestination] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (destination) params.set("destination", destination);
    if (checkInDate) params.set("checkInDate", checkInDate);
    if (checkOutDate) params.set("checkOutDate", checkOutDate);
    if (guests) params.set("guests", guests);

    navigate(`/rooms?${params.toString()}`);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${assets.heroImage})` }}
    >
      <p className="bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20 text-sm">
        The Ultimate Hotel Experience
      </p>

      <h1 className="font-playfair text-3xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4">
        Discover Your Perfect Getaway Destination
      </h1>

      <p className="max-w-[530px] mt-3 text-sm md:text-base leading-relaxed">
        Enjoy comfortable rooms, premium hospitality, and unforgettable stays in
        top destinations across Nigeria.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white text-gray-600 rounded-xl px-6 py-5 mt-8 flex flex-col md:flex-row gap-4 w-full md:w-auto shadow-lg"
      >
        {/* DESTINATION */}
        <div>
          <div className="flex items-center gap-2">
            <img
              src={assets.locationIcon || assets.calenderIcon}
              alt="destination"
              className="h-4"
            />

            <label htmlFor="destinationInput">Destination</label>
          </div>

          <input
            list="destinations"
            id="destinationInput"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none w-full"
            placeholder="Lagos, Abuja, Kano..."
          />

          <datalist id="destinations">
            {cities.map((city) => (
              <option value={city} key={city} />
            ))}
          </datalist>
        </div>

        {/* CHECK IN */}
        <div>
          <div className="flex items-center gap-2">
            <img
              src={assets.calenderIcon}
              alt="calendar"
              className="h-4"
            />

            <label htmlFor="checkIn">Check in</label>
          </div>

          <input
            id="checkIn"
            type="date"
            value={checkInDate}
            min={today}
            onChange={(e) => setCheckInDate(e.target.value)}
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none w-full"
          />
        </div>

        {/* CHECK OUT */}
        <div>
          <div className="flex items-center gap-2">
            <img
              src={assets.calenderIcon}
              alt="calendar"
              className="h-4"
            />

            <label htmlFor="checkOut">Check out</label>
          </div>

          <input
            id="checkOut"
            type="date"
            value={checkOutDate}
            min={checkInDate || today}
            onChange={(e) => setCheckOutDate(e.target.value)}
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none w-full"
          />
        </div>

        {/* GUESTS */}
        <div className="flex md:flex-col gap-2 md:gap-0">
          <label htmlFor="guests">Guests</label>

          <input
            id="guests"
            type="number"
            min={1}
            max={10}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none max-w-24"
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-md bg-black py-3 px-6 text-white cursor-pointer md:mt-6 hover:bg-gray-900 transition"
        >
          <img src={assets.searchIcon} alt="search" className="h-5 invert" />
          Search
        </button>
      </form>
    </section>
  );
};

export default Hero;