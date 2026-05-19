import React from "react";
import Title from "../components/Title";

const About = () => {
  return (
    <section className="px-6 md:px-16 lg:px-24 xl:px-32 py-28 md:py-36">
      <div className="max-w-5xl">
        <Title
          align="left"
          title="About Us"
          subTitle="Learn more about our mission, vision, and the experience we provide for travelers and hotel owners."
        />

        <div className="mt-10 space-y-6 text-gray-600 leading-relaxed text-sm md:text-base">
          <p>
            Welcome to our hotel booking platform — a modern solution designed
            to make hotel reservations simple, secure, and convenient. Our goal
            is to connect travelers with trusted hotels while helping hotel
            owners manage and grow their hospitality businesses online.
          </p>

          <p>
            We provide a smooth booking experience that allows users to browse
            rooms, compare prices, explore hotel amenities, and reserve rooms
            with confidence. Whether you are traveling for business, vacation,
            family visits, or special events, we help you find the perfect place
            to stay.
          </p>

          <p>
            Our platform features hotels across major cities including Lagos,
            Abuja, Kano, and Kaduna, offering a variety of room options ranging
            from affordable stays to luxury accommodations.
          </p>

          <p>
            We are committed to transparency, reliability, and user
            satisfaction. Every feature on our platform is built to improve the
            booking experience — from real-time room availability and secure
            reservations to responsive hotel management tools.
          </p>

          <p>
            Beyond hotel bookings, we aim to create a trusted digital ecosystem
            where guests enjoy comfort and convenience while hotel owners gain
            visibility, manage rooms efficiently, and increase bookings through
            a professional online presence.
          </p>

          <p>
            Our mission is to simplify hospitality through technology and create
            memorable travel experiences for everyone.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;