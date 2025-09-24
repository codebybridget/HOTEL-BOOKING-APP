import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { facilityIcons, roomCommonData, roomsDummyData } from '../assets/assets'
import StarRating from '../components/StarRating'

const RoomDetails = () => {
  const { id } = useParams()
  const [room, setRoom] = useState(null)
  const [mainImage, setMainImage] = useState(null)

  useEffect(() => {
    const foundRoom = roomsDummyData.find((room) => String(room._id) === String(id))
    if (foundRoom) {
      setRoom(foundRoom)
      setMainImage(foundRoom.images[0])
    }
  }, [id])

  if (!room) {
    return <p className="pt-28 text-center">Room not found</p>
  }

  return (
    <div className="py-28 md:py-36 px-4 lg:px-24 xl:px-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 mb-6">
        <h1 className="text-3xl md:text-4xl font-playfair">
          {room.hotel.name}
          <span className="font-inter text-sm"> ({room.roomType})</span>
        </h1>
        <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500">20% OFF</p>
      </div>

      {/* Image Section */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Main Image */}
        <div className="flex-[2.2]">
          <img
            src={mainImage}
            alt={room.hotel.name}
            className="w-full h-[360px] rounded-lg shadow-md object-cover"
          />
          <p className="mt-2 text-gray-600">{room.hotel.address}</p>
        </div>

        {/* Thumbnails (2x2 grid) */}
        {room?.images.length > 1 && (
          <div className="grid grid-cols-2 gap-3 flex-[1.5] self-start">
            {room.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Room thumbnail ${index + 1}`}
                onClick={() => setMainImage(image)}
                className={`w-full h-[180px] rounded-lg object-cover cursor-pointer transition 
                  ${mainImage === image ? 'outline outline-2 outline-orange-500 scale-105' : ''}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Rating Section */}
      <div className="flex items-center mt-6">
        <StarRating rating={room.rating || 4} />
        <p className="ml-2 text-gray-600">{room.reviews || '200+'} reviews</p>
      </div>

      {/* Amenities + Price */}
      <div className="flex flex-col md:flex-row md:justify-between mt-10">
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-playfair">
            Experience Luxury Like Never Before
          </h1>
          <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
            {room.amenities.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100"
              >
                <img src={facilityIcons[item]} alt={item} className="w-5 h-5" />
                <p className="text-xs">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-2xl font-medium">${room.pricePerNight} /night</p>
      </div>
     <form className='flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl'>
  <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500'>

    {/* Check-In */}
    <div className='flex flex-col'>
      <label htmlFor='checkInDate' className='font-medium'>Check-In</label>
      <input 
        type='date' 
        id="checkInDate" 
        className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' 
        required 
      />
    </div>

     <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
    {/* Check-Out */}
    <div className='flex flex-col'>
      <label htmlFor='checkOutDate' className='font-medium'>Check-Out</label>
      <input 
        type='date' 
        id="checkOutDate" 
        className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' 
        required 
      />
    </div>

     <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>

    {/* Guests */}
    <div className='flex flex-col'>
      <label htmlFor='guests' className='font-medium'>Guests</label>
      <input 
        type='number' 
        id="guests" 
        placeholder='0' 
        min="1"
        className='max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' 
        required 
      />
    </div>

  </div>

  {/* Book Button */}
  <button 
    type='submit' 
    className='bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-8 py-3 md:py-4 text-base cursor-pointer'
  >
    Check Availability
  </button>
</form>

{/*common specifications */}
<div className='mt-25 space-y-4'>
    {roomCommonData.map((spec, index)=>(
     <div key={index} className='flex items-start gap-2'>
        <img src={spec.icon} alt={`${spec.title}-icon`} className='w-6.5' />
        <div>
            <p className='text-base'>{spec.title}</p>
            <p className='text-gray-500'>{spec.description}</p>
        </div>
     </div>
    ))}
</div>
 <div className='max-w-3x1 border-y border-gray-300 my-15 py-10 text-gray-500'>
    <p>Guests will be allocated on the ground floor according to availability.
    You get a comfortable two bedroom apartment has a true city feeling. The
    price quoted is for two guest slot please mark the the number of 
    guests to get the exact price for groups. The guests will be allocated 
    ground floor according to availability. You get the comfortable two bedroom 
    apartment that has a true city feeling.</p>
 </div>
   <div className='flex flex-col items-start gap-4'>
     <div className='flex gap-4'>
        <img src={room.hotel.owner.image} alt="Host" className='h-14 w-14 md:h-18 md:w-18 rounded-full' />
        <div>
            <p className='text-lg md:text-x1'>Hosted by {room.hotel.name}</p>
            <div className='flex items-center mt-1'>
                <StarRating />
                <p className='ml-2'>200+ reviews</p>
            </div>
        </div>
     </div>
     <button className='px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer'>Contact Now</button>
   </div>
    </div>
  )
}

export default RoomDetails
