import React from "react";
import Title from "./Title";
import StarRating from "./StarRating";

// Static testimonial data
const testimonials = [
  {
    id: 1,
    name: "Sophia Williams",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    address: "London, UK",
    review:
      "QuickStay made my trip seamless. The accommodations were luxurious and exactly as described!",
    rating: 5,
  },
  {
    id: 2,
    name: "Liam Johnson",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    address: "New York, USA",
    review:
      "The service exceeded my expectations. I’ll definitely book with QuickStay again.",
    rating: 4,
  },
  {
    id: 3,
    name: "Ava Martinez",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    address: "Barcelona, Spain",
    review:
      "Loved the attention to detail. Everything felt premium and stress-free.",
    rating: 5,
  },
];

const Testimonial = () => {
  return (
    <section className="bg-slate-50 py-24 px-6 md:px-16 lg:px-24 text-black">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <Title
          title="What Our Guests Say"
          subTitle="Discover why discerning travelers consistently choose QuickStay for their exclusive and luxurious accommodations around the world."
        />

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 w-full">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* User Info */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={`${testimonial.name} profile`}
                  loading="lazy"
                  className="w-14 h-14 rounded-full object-cover"
                />

                <div>
                  <h3 className="font-playfair text-lg font-semibold">
                    {testimonial.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {testimonial.address}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div
                className="mt-4"
                aria-label={`${testimonial.name} rated ${testimonial.rating} out of 5`}
              >
                <StarRating rating={testimonial.rating} />
              </div>

              {/* Review */}
              <blockquote className="mt-4 text-sm leading-relaxed text-gray-600">
                &ldquo;{testimonial.review}&rdquo;
              </blockquote>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;