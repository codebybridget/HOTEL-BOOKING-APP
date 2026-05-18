import React from "react";
import { assets, cities } from "../assets/assets";

const Hero = () => {
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    // later: connect to search logic / API
  };

  return (
    <div
      className="flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${assets.heroImage})` }}
    >
      <p className="bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20 text-sm">
        The Ultimate Hotel Experience
      </p>

      <h1 className="font-playfair text-2xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4">
        Discover Your Perfect Getaway Destination
      </h1>

      <p className="max-w-[530px] mt-3 text-sm md:text-base leading-relaxed">
        Unparalleled luxury and comfort await at the world's most exclusive
        hotels and resorts. Start your journey today.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white text-gray-600 rounded-lg px-6 py-4 mt-8 flex flex-col md:flex-row gap-4 w-full md:w-auto"
      >
        {/* Destination */}
        <div>
          <div className="flex items-center gap-2">
            <img
              src={assets.calenderIcon}
              alt="destination icon"
              className="h-4"
            />
            <label htmlFor="destinationInput">Destination</label>
          </div>

          <input
            list="destinations"
            id="destinationInput"
            type="text"
            required
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none w-full"
            placeholder="Type here"
          />

          <datalist id="destinations">
            {cities.map((city, index) => (
              <option value={city} key={index} />
            ))}
          </datalist>
        </div>

        {/* Check In */}
        <div>
          <div className="flex items-center gap-2">
            <img
              src={assets.calenderIcon}
              alt="calendar icon"
              className="h-4"
            />
            <label htmlFor="checkIn">Check in</label>
          </div>

          <input
            id="checkIn"
            type="date"
            min={today}
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none w-full"
          />
        </div>

        {/* Check Out */}
        <div>
          <div className="flex items-center gap-2">
            <img
              src={assets.calenderIcon}
              alt="calendar icon"
              className="h-4"
            />
            <label htmlFor="checkOut">Check out</label>
          </div>

          <input
            id="checkOut"
            type="date"
            min={today}
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none w-full"
          />
        </div>

        {/* Guests */}
        <div className="flex md:flex-col gap-2 md:gap-0">
          <label htmlFor="guests">Guests</label>
          <input
            id="guests"
            type="number"
            min={1}
            max={4}
            defaultValue={1}
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none max-w-20"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-md bg-black py-3 px-5 text-white cursor-pointer md:mt-6"
        >
          <img
            src={assets.searchIcon}
            alt="search"
            className="h-5 invert"
          />
          Search
        </button>
      </form>
    </div>
  );
};

export default Hero;