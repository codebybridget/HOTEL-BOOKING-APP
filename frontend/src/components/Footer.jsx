import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const Footer = () => {
  const handleSubmit = (e) => {
    e.preventDefault();

    toast.success("Subscribed successfully");

    e.target.reset();
  };

  return (
    <footer className="bg-[#0B2239] text-white">
      {/* TOP */}
      <div className="max-w-7xl mx-auto px-5 md:px-16 lg:px-24 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* BRAND */}
          <div className="lg:col-span-2">
            <Link to="/">
              <h2 className="text-4xl font-bold text-[#00ADEF]">
                QuickStay
              </h2>
            </Link>

            <p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-md">
              QuickStay is Nigeria’s trusted hotel
              booking platform helping travellers find
              affordable and luxury hotels across the
              country.
            </p>

            {/* SOCIALS */}
            <div className="flex items-center gap-4 mt-8">
              <a
                href="/"
                className="bg-white/10 hover:bg-[#00ADEF] transition w-12 h-12 rounded-full flex items-center justify-center"
              >
                <span className="text-xl">f</span>
              </a>

              <a
                href="/"
                className="bg-white/10 hover:bg-[#00ADEF] transition w-12 h-12 rounded-full flex items-center justify-center"
              >
                <span className="text-xl">x</span>
              </a>

              <a
                href="/"
                className="bg-white/10 hover:bg-[#00ADEF] transition w-12 h-12 rounded-full flex items-center justify-center"
              >
                <span className="text-xl">in</span>
              </a>

              <a
                href="/"
                className="bg-white/10 hover:bg-[#00ADEF] transition w-12 h-12 rounded-full flex items-center justify-center"
              >
                <span className="text-xl">ig</span>
              </a>
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="text-2xl font-bold mb-6">
              Company
            </h3>

            <ul className="space-y-4 text-gray-300 text-lg">
              <li>
                <Link
                  to="/"
                  className="hover:text-[#00ADEF] transition"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/rooms"
                  className="hover:text-[#00ADEF] transition"
                >
                  Hotels
                </Link>
              </li>

              <li>
                <Link
                  to="/"
                  className="hover:text-[#00ADEF] transition"
                >
                  Careers
                </Link>
              </li>

              <li>
                <Link
                  to="/"
                  className="hover:text-[#00ADEF] transition"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="text-2xl font-bold mb-6">
              Support
            </h3>

            <ul className="space-y-4 text-gray-300 text-lg">
              <li>
                <Link
                  to="/"
                  className="hover:text-[#00ADEF] transition"
                >
                  Help Center
                </Link>
              </li>

              <li>
                <Link
                  to="/"
                  className="hover:text-[#00ADEF] transition"
                >
                  Contact Us
                </Link>
              </li>

              <li>
                <Link
                  to="/"
                  className="hover:text-[#00ADEF] transition"
                >
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link
                  to="/"
                  className="hover:text-[#00ADEF] transition"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className="text-2xl font-bold mb-6">
              Newsletter
            </h3>

            <p className="text-gray-300 text-lg leading-relaxed">
              Subscribe to get updates about hotel
              deals and travel offers.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6"
            >
              <input
                type="email"
                required
                placeholder="Enter email address"
                className="w-full bg-white text-black px-5 py-4 rounded-lg outline-none"
              />

              <button
                type="submit"
                className="w-full mt-4 bg-[#00ADEF] hover:bg-[#0095cc] text-white py-4 rounded-lg text-lg font-semibold transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 md:px-16 lg:px-24 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-lg">
            © {new Date().getFullYear()} QuickStay.
            All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-gray-400 text-lg">
            <Link
              to="/"
              className="hover:text-[#00ADEF] transition"
            >
              Privacy
            </Link>

            <Link
              to="/"
              className="hover:text-[#00ADEF] transition"
            >
              Terms
            </Link>

            <Link
              to="/"
              className="hover:text-[#00ADEF] transition"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;