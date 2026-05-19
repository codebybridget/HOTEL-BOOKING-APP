import React from "react";
import Hero from "../components/Hero";
import FeaturedDestination from "../components/FeaturedDestination";
import ExclusiveOffers from "../components/ExclusiveOffers";
import Testimonial from "../components/Testimonial";
import Newsletter from "../components/NewsLetter";

const Home = () => {
  return (
    <main className="overflow-x-hidden">
      {/* HERO */}
      <Hero />

      {/* FEATURED DESTINATIONS */}
      <FeaturedDestination />

      {/* EXCLUSIVE OFFERS */}
      <ExclusiveOffers />

      {/* TESTIMONIALS */}
      <Testimonial />

      {/* NEWSLETTER */}
      <Newsletter />
    </main>
  );
};

export default Home;