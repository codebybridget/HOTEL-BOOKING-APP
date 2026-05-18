import React from "react";
import Title from "./Title";
import StarRating from "./StarRating";

// Move data outside component (better performance)
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
    <section className="flex flex-col items-center text-black px-6 md:px-16 lg:px-24 bg-slate-50 py-24">
      <Title
        title="What Our Guests Say"
        subTitle="Discover why discerning travelers consistently choose QuickStay for their exclusive and luxurious accommodations around the world."
      />

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 w-full max-w-6xl">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
          >
            {/* User Info */}
            <div className="flex items-center gap-3">
              <img
                className="w-12 h-12 rounded-full object-cover"
                src={t.image}
                alt={`${t.name} profile`}
              />
              <div>
                <p className="font-playfair text-lg font-medium">
                  {t.name}
                </p>
                <p className="text-gray-500 text-sm">{t.address}</p>
              </div>
            </div>

            {/* Rating */}
            <div
              className="mt-4"
              aria-label={`Rated ${t.rating} out of 5`}
            >
              <StarRating rating={t.rating} />
            </div>

            {/* Review */}
            <p className="text-gray-500 mt-4 text-sm leading-relaxed">
              &ldquo;{t.review}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonial;