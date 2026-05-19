import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { toast } from "react-hot-toast";

const Footer = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Thank you for subscribing!");
    e.target.reset();
  };

  return (
    <footer className="bg-[#F6F9FC] text-gray-500/80 pt-10 px-6 md:px-16 lg:px-24 xl:px-32">
      <div className="flex flex-wrap justify-between gap-12 md:gap-8">
        {/* BRAND */}
        <div className="max-w-80">
          <Link to="/">
            <img
              src={assets.logo}
              alt="Company logo"
              className="mb-4 h-8 md:h-9 invert opacity-80"
            />
          </Link>

          <p className="text-sm leading-relaxed">
            Discover comfortable hotels, luxury rooms, and unforgettable stays
            across top destinations in Nigeria.
          </p>

          <div className="flex items-center gap-3 mt-5">
            <a href="/" aria-label="Instagram">
              <img src={assets.instagramIcon} alt="Instagram" className="w-6" />
            </a>

            <a href="/" aria-label="Facebook">
              <img src={assets.facebookIcon} alt="Facebook" className="w-6" />
            </a>

            <a href="/" aria-label="Twitter">
              <img src={assets.twitterIcon} alt="Twitter" className="w-6" />
            </a>

            <a href="/" aria-label="LinkedIn">
              <img src={assets.linkendinIcon} alt="LinkedIn" className="w-6" />
            </a>
          </div>
        </div>

        {/* COMPANY */}
        <div>
          <p className="font-playfair text-lg text-gray-800">COMPANY</p>

          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li>
              <Link to="/about" className="hover:text-gray-900 transition">
                About
              </Link>
            </li>

            <li>
              <Link to="/experience" className="hover:text-gray-900 transition">
                Experience
              </Link>
            </li>

            <li>
              <Link to="/rooms" className="hover:text-gray-900 transition">
                Hotels
              </Link>
            </li>

            <li>
              <Link to="/" className="hover:text-gray-900 transition">
                Partners
              </Link>
            </li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <p className="font-playfair text-lg text-gray-800">SUPPORT</p>

          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li>
              <Link to="/" className="hover:text-gray-900 transition">
                Help Center
              </Link>
            </li>

            <li>
              <Link to="/" className="hover:text-gray-900 transition">
                Safety Information
              </Link>
            </li>

            <li>
              <Link to="/" className="hover:text-gray-900 transition">
                Cancellation Options
              </Link>
            </li>

            <li>
              <a
                href="mailto:support@codebybridget.com"
                className="hover:text-gray-900 transition"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div className="max-w-80">
          <p className="font-playfair text-lg text-gray-800">STAY UPDATED</p>

          <p className="mt-3 text-sm">
            Subscribe to receive travel inspiration, hotel updates, and special
            offers.
          </p>

          <form onSubmit={handleSubmit} className="flex items-center mt-4">
            <input
              type="email"
              required
              className="bg-white rounded-l border border-gray-300 h-10 px-3 outline-none w-full"
              placeholder="Your email"
            />

            <button
              type="submit"
              aria-label="Subscribe"
              className="flex items-center justify-center bg-black h-10 w-10 rounded-r"
            >
              <img
                src={assets.arrowIcon}
                alt="Submit"
                className="w-3.5 invert"
              />
            </button>
          </form>
        </div>
      </div>

      <hr className="border-gray-300 mt-10" />

      {/* BOTTOM */}
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between py-5 text-sm">
        <p>
          © {new Date().getFullYear()} codebybridget. All rights reserved.
        </p>

        <ul className="flex items-center gap-4">
          <li>
            <Link to="/" className="hover:text-gray-900 transition">
              Privacy
            </Link>
          </li>

          <li>
            <Link to="/" className="hover:text-gray-900 transition">
              Terms
            </Link>
          </li>

          <li>
            <Link to="/" className="hover:text-gray-900 transition">
              Sitemap
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;