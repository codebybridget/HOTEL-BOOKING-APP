import React from "react";
import Title from "../components/Title";

const Experience = () => {
  return (
    <section className="px-6 md:px-16 lg:px-24 xl:px-32 py-24">
      <div className="max-w-4xl">
        <Title
          align="left"
          title="Experience"
          subTitle="Discover what makes every stay unique and memorable."
        />

        <div className="mt-8 space-y-6 text-gray-600 leading-relaxed text-sm md:text-base">
          <p>
            We believe that travel is more than just booking a place to stay —
            it's about creating unforgettable experiences. Our platform is
            designed to help you explore destinations with comfort, ease, and
            confidence.
          </p>

          <p>
            From luxury suites with breathtaking views to cozy spaces that feel
            like home, every listing is carefully selected to deliver quality and
            satisfaction. We ensure that every detail contributes to a smooth and
            enjoyable stay.
          </p>

          <p>
            Whether you're traveling for business, leisure, or adventure, our
            goal is to make every moment of your journey exceptional.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Experience;