import React from "react";
import { assets } from "../assets/assets";
import Title from "./Title";

const Newsletter = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // later: connect to backend / email service
  };

  return (
    <section className="flex flex-col items-center max-w-5xl w-full rounded-2xl px-4 py-12 md:py-16 mx-2 lg:mx-auto my-28 bg-gray-900 text-white">
      
      {/* Title */}
      <div className="text-white">
        <Title
          title="Stay Inspired"
          subTitle="Join our newsletter and be the first to discover new destinations, exclusive offers, and travel inspiration."
        />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6 w-full max-w-lg"
      >
        <input
          type="email"
          required
          placeholder="Enter your email"
          className="bg-white/10 px-4 py-2.5 border border-white/20 rounded outline-none w-full placeholder:text-gray-300 focus:border-white transition"
        />

        <button
          type="submit"
          className="flex items-center justify-center gap-2 group bg-black px-5 md:px-7 py-2.5 rounded text-white active:scale-95 transition"
        >
          Subscribe
          <img
            src={assets.arrowIcon}
            alt="arrow"
            className="w-3.5 invert group-hover:translate-x-1 transition"
          />
        </button>
      </form>

      {/* Disclaimer */}
      <p className="text-gray-400 mt-6 text-xs text-center max-w-md">
        By subscribing, you agree to our Privacy Policy and consent to receive updates.
      </p>
    </section>
  );
};

export default Newsletter;