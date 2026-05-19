import React from "react";
import Title from "../components/Title";

const Experience = () => {
  return (
    <section className="px-6 md:px-16 lg:px-24 xl:px-32 py-28 md:py-36">
      <div className="max-w-5xl">
        <Title
          align="left"
          title="Experience"
          subTitle="Discover what makes every stay unique, comfortable, and unforgettable."
        />

        <div className="mt-10 space-y-6 text-gray-600 leading-relaxed text-sm md:text-base">
          <p>
            At our hotel booking platform, we believe every trip should feel
            special from the moment you search for a room until the day you
            check out. We connect travelers with carefully selected hotels that
            combine comfort, convenience, and quality service.
          </p>

          <p>
            Whether you're planning a luxury getaway, a business trip, a family
            vacation, or a weekend escape, our platform helps you discover the
            perfect stay in top cities across Nigeria including Lagos, Abuja,
            Kano, and Kaduna.
          </p>

          <p>
            Every hotel listed on our platform is designed to deliver a smooth
            and memorable experience. From modern rooms and premium amenities to
            excellent customer service and secure bookings, we focus on making
            travel stress-free and enjoyable.
          </p>

          <p>
            Our mission is simple — to help guests book with confidence while
            giving hotel owners a reliable platform to showcase their rooms,
            manage bookings, and grow their business online.
          </p>

          <p>
            With easy room browsing, real-time booking features, and a clean
            user experience, we are building more than a booking website — we
            are creating a trusted hospitality experience for everyone.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Experience;