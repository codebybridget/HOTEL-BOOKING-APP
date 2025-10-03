import React from 'react'
import Title from './Title'
import StarRating from './StarRating'

// 👇 add this
const testimonials = [
  {
    id: 1,
    name: "Sophia Williams",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    address: "London, UK",
    review: "QuickStay made my trip seamless. The accommodations were luxurious and exactly as described!",
    rating: 5
  },
  {
    id: 2,
    name: "Liam Johnson",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    address: "New York, USA",
    review: "The service exceeded my expectations. I’ll definitely book with QuickStay again.",
    rating: 4
  },
  {
    id: 3,
    name: "Ava Martinez",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    address: "Barcelona, Spain",
    review: "Loved the attention to detail. Everything felt premium and stress-free.",
    rating: 5
  }
]

const Testimonial = () => {
  return (
    <div className="flex flex-col items-center text-black px-6 md:px-16 lg:px-24 bg-slate-50 pt-20 pb-30">
      <Title
        title="What Our Guests Say"
        subTitle="Discover why discerning travelers consistently choose QuickStay for their exclusive and luxurious accommodations around the world."
      />

      <div className="flex flex-wrap items-center justify-center gap-6 mt-20 mb-10">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white p-6 rounded-xl shadow max-w-xs"
          >
            <div className="flex items-center gap-3">
              <img
                className="w-12 h-12 rounded-full"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <p className="font-playfair text-xl">{testimonial.name}</p>
                <p className="text-gray-500">{testimonial.address}</p>
              </div>
            </div>

            {/* Rating block */}
            <div className="flex items-center gap-1 mt-4">
              <StarRating rating={testimonial.rating} />
            </div>

            <p className="text-gray-500 mt-4">"{testimonial.review}"</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Testimonial
