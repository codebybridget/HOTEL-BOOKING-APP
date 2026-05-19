import React, { useState } from "react";
import { assets } from "../assets/assets";
import Title from "./Title";
import { toast } from "react-hot-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);

      // FUTURE API CALL
      // await axios.post("/api/newsletter", { email })

      toast.success(
        "Successfully subscribed to newsletter!"
      );

      setEmail("");
    } catch (error) {
      console.error(error);

      toast.error(
        "Subscription failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center max-w-6xl w-full rounded-3xl px-6 py-14 md:py-20 mx-auto my-28 bg-gray-900 text-white overflow-hidden relative">
      {/* BACKGROUND EFFECT */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]" />

      {/* CONTENT */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* TITLE */}
        <div className="text-white max-w-3xl">
          <Title
            title="Stay Inspired"
            subTitle="Join our newsletter and be the first to discover luxury hotels, exclusive offers, travel inspiration, and special booking deals across Nigeria."
          />
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8 w-full max-w-2xl"
        >
          {/* INPUT */}
          <input
            type="email"
            required
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Enter your email"
            className="bg-white/10 px-5 py-3 border border-white/20 rounded-xl outline-none w-full placeholder:text-gray-300 focus:border-white transition"
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center justify-center gap-2 group px-6 md:px-8 py-3 rounded-xl text-white transition whitespace-nowrap ${
              loading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading
              ? "Subscribing..."
              : "Subscribe"}

            {!loading && (
              <img
                src={assets.arrowIcon}
                alt="arrow"
                className="w-3.5 invert group-hover:translate-x-1 transition"
              />
            )}
          </button>
        </form>

        {/* DISCLAIMER */}
        <p className="text-gray-400 mt-6 text-xs text-center max-w-lg leading-relaxed">
          By subscribing, you agree to receive promotional emails, hotel
          updates, and exclusive travel offers. You can unsubscribe at any
          time.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;