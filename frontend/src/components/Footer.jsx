import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // later: connect to backend / email service
  };

  return (
    <footer className="bg-[#F6F9FC] text-gray-500/80 pt-8 px-6 md:px-16 lg:px-24 xl:px-32">
      <div className="flex flex-wrap justify-between gap-12 md:gap-6">
        
        {/* Brand Section */}
        <div className="max-w-80">
          <img
            src={assets.logo}
            alt="Company logo"
            className="mb-4 h-8 md:h-9 invert opacity-80"
          />
          <p className="text-sm leading-relaxed">
            Discover the world's most extraordinary places to stay, from
            boutique hotels to luxury villas and private islands.
          </p>

          <div className="flex items-center gap-3 mt-4">
            <a href="#" aria-label="Instagram">
              <img src={assets.instagramIcon} alt="Instagram" className="w-6" />
            </a>
            <a href="#" aria-label="Facebook">
              <img src={assets.facebookIcon} alt="Facebook" className="w-6" />
            </a>
            <a href="#" aria-label="Twitter">
              <img src={assets.twitterIcon} alt="Twitter" className="w-6" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <img src={assets.linkendinIcon} alt="LinkedIn" className="w-6" />
            </a>
          </div>
        </div>

        {/* Company Links */}
        <div>
          <p className="font-playfair text-lg text-gray-800">COMPANY</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {["About", "Careers", "Press", "Blog", "Partners"].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-gray-900 transition">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <p className="font-playfair text-lg text-gray-800">SUPPORT</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {[
              "Help Center",
              "Safety Information",
              "Cancellation Options",
              "Contact Us",
              "Accessibility",
            ].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-gray-900 transition">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="max-w-80">
          <p className="font-playfair text-lg text-gray-800">STAY UPDATED</p>
          <p className="mt-3 text-sm">
            Subscribe to our newsletter for inspiration and special offers.
          </p>

          <form onSubmit={handleSubmit} className="flex items-center mt-4">
            <input
              type="email"
              required
              className="bg-white rounded-l border border-gray-300 h-9 px-3 outline-none w-full"
              placeholder="Your email"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="flex items-center justify-center bg-black h-9 w-9 rounded-r"
            >
              <img src={assets.arrowIcon} alt="Submit" className="w-3.5 invert" />
            </button>
          </form>
        </div>
      </div>

      <hr className="border-gray-300 mt-8" />

      {/* Bottom */}
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between py-5 text-sm">
        <p>© {new Date().getFullYear()} codebybridget. All rights reserved.</p>

        <ul className="flex items-center gap-4">
          {["Privacy", "Terms", "Sitemap"].map((item) => (
            <li key={item}>
              <a href="#" className="hover:text-gray-900 transition">
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;