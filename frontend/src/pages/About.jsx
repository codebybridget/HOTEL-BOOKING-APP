import React from "react";
import Title from "../components/Title";

const About = () => {
  return (
    <section className="px-6 md:px-16 lg:px-24 xl:px-32 py-24">
      <div className="max-w-4xl">
        <Title
          align="left"
          title="About Us"
          subTitle="Learn more about our mission, vision, and what makes our platform unique."
        />

        <div className="mt-8 space-y-6 text-gray-600 leading-relaxed text-sm md:text-base">
          <p>
            Welcome to our hotel booking platform — your gateway to discovering
            exceptional places to stay around the world. We are committed to
            providing a seamless and reliable booking experience for travelers
            seeking comfort, luxury, and convenience.
          </p>
 
          <p>
            Our platform connects guests with carefully curated hotels, ensuring
            quality, transparency, and value. Whether you're planning a business
            trip, a family vacation, or a luxury getaway, we help you find the
            perfect stay tailored to your needs.
          </p>

          <p>
            We focus on delivering a user-friendly experience, real-time
            availability, and trusted listings to make your journey smooth from
            start to finish.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;