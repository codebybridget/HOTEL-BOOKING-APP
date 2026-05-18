import React, { useState } from "react";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";
import { toast } from "react-hot-toast";

const AddRoom = () => {
  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  const [inputs, setInputs] = useState({
    roomType: "",
    pricePerNight: "",
    amenities: {
      "Free Wifi": false,
      "Free Breakfast": false,
      Service: false,
      "Mountain View": false,
      "Pool Access": false,
    },
  });

  const [loading, setLoading] = useState(false);

  // ✅ FIXED FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("roomType", inputs.roomType);
      formData.append("pricePerNight", inputs.pricePerNight);

      const amenitiesArray = Object.keys(inputs.amenities).filter(
        (key) => inputs.amenities[key]
      );

      formData.append("amenities", JSON.stringify(amenitiesArray));

      Object.values(images).forEach((file) => {
        if (file) formData.append("images", file);
      });

      // ✅ WORKING REQUEST
      const response = await fetch(
        "https://hotel-booking-app-backend-90js.onrender.com/api/room",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Room added successfully!");

        // ✅ RESET INSIDE FUNCTION
        setInputs({
          roomType: "",
          pricePerNight: "",
          amenities: {
            "Free Wifi": false,
            "Free Breakfast": false,
            Service: false,
            "Mountain View": false,
            "Pool Access": false,
          },
        });

        setImages({
          1: null,
          2: null,
          3: null,
          4: null,
        });
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Title
          align="left"
          font="outfit"
          title="Add Room"
          subTitle="Fill in the details carefully and accurately."
        />

        {/* Images */}
        <p className="text-gray-800 mt-10">Images</p>
        <div className="grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap">
          {Object.keys(images).map((key) => (
            <label key={key}>
              <img
                className="max-h-32 cursor-pointer opacity-80 rounded"
                src={
                  images[key]
                    ? URL.createObjectURL(images[key])
                    : assets.uploadArea
                }
                alt="upload"
              />
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) =>
                  setImages({
                    ...images,
                    [key]: e.target.files[0],
                  })
                }
              />
            </label>
          ))}
        </div>

        {/* Room Type */}
        <div className="flex gap-4 mt-4">
          <div>
            <p>Room Type</p>
            <select
              value={inputs.roomType}
              onChange={(e) =>
                setInputs({ ...inputs, roomType: e.target.value })
              }
              className="border p-2 rounded"
              required
            >
              <option value="">Select</option>
              <option value="Single Bed">Single Bed</option>
              <option value="Double Bed">Double Bed</option>
              <option value="Luxury Room">Luxury Room</option>
              <option value="Family Suite">Family Suite</option>
            </select>
          </div>

          <div>
            <p>Price / night</p>
            <input
              type="number"
              value={inputs.pricePerNight}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  pricePerNight: e.target.value,
                })
              }
              className="border p-2 rounded"
              required
            />
          </div>
        </div>

        {/* Amenities */}
        <p className="mt-4">Amenities</p>
        {Object.keys(inputs.amenities).map((amenity, index) => (
          <div key={index}>
            <input
              type="checkbox"
              checked={inputs.amenities[amenity]}
              onChange={() =>
                setInputs({
                  ...inputs,
                  amenities: {
                    ...inputs.amenities,
                    [amenity]: !inputs.amenities[amenity],
                  },
                })
              }
            />
            <label className="ml-2">{amenity}</label>
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-2 mt-6 rounded"
        >
          {loading ? "Adding..." : "Add Room"}
        </button>
      </form>
    </div>
  );
};

export default AddRoom;