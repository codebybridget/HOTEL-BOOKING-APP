import React, { useState } from "react";
import { cities } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Hero = () => {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [destination, setDestination] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!destination.trim()) {
      toast.error("Please enter destination");
      return;
    }

    if (!checkInDate || !checkOutDate) {
      toast.error("Select booking dates");
      return;
    }

    if (
      new Date(checkOutDate) <=
      new Date(checkInDate)
    ) {
      toast.error("Invalid date range");
      return;
    }

    const params =
      new URLSearchParams();

    params.set(
      "destination",
      destination.trim().toLowerCase()
    );

    params.set(
      "checkInDate",
      checkInDate
    );

    params.set(
      "checkOutDate",
      checkOutDate
    );

    params.set(
      "guests",
      guests
    );

    navigate(
      `/rooms?${params.toString()}`
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{
        backgroundImage:
          "url('/images/hero.jpg')",
      }}
    >
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/55"></div>

      {/* CONTENT */}
      <div className="relative z-10 text-center w-full max-w-6xl">
        {/* SMALL TEXT */}
        <div className="mb-8">
          <p className="text-white text-sm uppercase tracking-[5px]">
            QuickStay Nigeria
          </p>
        </div>

        {/* TITLE */}
        <h1 className="text-white text-4xl md:text-7xl font-bold leading-tight">
          Find and book hotels in Nigeria
        </h1>

        {/* SUBTITLE */}
        <p className="text-gray-200 text-lg md:text-2xl mt-6 max-w-3xl mx-auto leading-relaxed">
          Discover luxury hotels, affordable
          stays and unforgettable travel
          experiences across Nigeria.
        </p>

        {/* SEARCH BOX */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-2xl mt-12 p-6 md:p-8 grid grid-cols-1 md:grid-cols-5 gap-5"
        >
          {/* DESTINATION */}
          <div className="flex flex-col text-left">
            <label className="text-sm font-semibold text-gray-600 mb-2">
              Destination
            </label>

            <input
              list="destinations"
              type="text"
              value={destination}
              onChange={(e) =>
                setDestination(
                  e.target.value
                )
              }
              placeholder="Lagos, Abuja..."
              className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#00ADEF]"
            />

            <datalist id="destinations">
              {cities.map((city) => (
                <option
                  key={city}
                  value={city}
                />
              ))}
            </datalist>
          </div>

          {/* CHECK IN */}
          <div className="flex flex-col text-left">
            <label className="text-sm font-semibold text-gray-600 mb-2">
              Check In
            </label>

            <input
              type="date"
              value={checkInDate}
              min={today}
              onChange={(e) =>
                setCheckInDate(
                  e.target.value
                )
              }
              className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#00ADEF]"
            />
          </div>

          {/* CHECK OUT */}
          <div className="flex flex-col text-left">
            <label className="text-sm font-semibold text-gray-600 mb-2">
              Check Out
            </label>

            <input
              type="date"
              value={checkOutDate}
              min={
                checkInDate || today
              }
              onChange={(e) =>
                setCheckOutDate(
                  e.target.value
                )
              }
              className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#00ADEF]"
            />
          </div>

          {/* GUESTS */}
          <div className="flex flex-col text-left">
            <label className="text-sm font-semibold text-gray-600 mb-2">
              Guests
            </label>

            <input
              type="number"
              min={1}
              max={10}
              value={guests}
              onChange={(e) =>
                setGuests(
                  Number(
                    e.target.value
                  )
                )
              }
              className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#00ADEF]"
            />
          </div>

          {/* BUTTON */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-[#00ADEF] hover:bg-[#0095cc] text-white font-semibold rounded-xl py-3.5 transition duration-300"
            >
              Find Hotels
            </button>
          </div>
        </form>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-12">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl py-6">
            <h3 className="text-white text-4xl font-bold">
              13K+
            </h3>

            <p className="text-gray-200 mt-2">
              Hotels Listed
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl py-6">
            <h3 className="text-white text-4xl font-bold">
              36
            </h3>

            <p className="text-gray-200 mt-2">
              States Covered
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl py-6">
            <h3 className="text-white text-4xl font-bold">
              24/7
            </h3>

            <p className="text-gray-200 mt-2">
              Booking Support
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl py-6">
            <h3 className="text-white text-4xl font-bold">
              ₦
            </h3>

            <p className="text-gray-200 mt-2">
              Best Local Prices
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;