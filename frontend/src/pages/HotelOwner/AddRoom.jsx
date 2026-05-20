import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
import { assets, cities } from "../../assets/assets";
import { toast } from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const initialAmenities = {
  "Free Wifi": false,
  "Free Breakfast": false,
  Service: false,
  "Mountain View": false,
  "Pool Access": false,
};

const AddRoom = () => {
  const { axios } = useAppContext();

  const [hotel, setHotel] = useState(null);
  const [showEditHotel, setShowEditHotel] = useState(false);

  const [hotelForm, setHotelForm] = useState({
    name: "",
    address: "",
    contact: "",
    city: "",
  });

  const [editHotelForm, setEditHotelForm] = useState({
    name: "",
    address: "",
    contact: "",
    city: "",
  });

  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  const [inputs, setInputs] = useState({
    roomType: "",
    pricePerNight: "",
    amenities: initialAmenities,
  });

  const [loading, setLoading] = useState(false);
  const [hotelLoading, setHotelLoading] = useState(false);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const { data } = await axios.get("/api/hotels/owner");

        if (data?.success) {
          setHotel(data.hotel);
        }
      } catch {
        setHotel(null);
      }
    };

    fetchHotel();
  }, [axios]);

  const handleRegisterHotel = async (e) => {
    e.preventDefault();

    try {
      setHotelLoading(true);

      const { data } = await axios.post("/api/hotels", hotelForm);

      if (data?.success) {
        setHotel(data.hotel);
        toast.success("Hotel registered successfully");
      } else {
        toast.error(data?.message || "Failed to register hotel");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to register hotel");
    } finally {
      setHotelLoading(false);
    }
  };

  const handleUpdateHotel = async (e) => {
    e.preventDefault();

    try {
      setHotelLoading(true);

      const { data } = await axios.patch("/api/hotels/owner", editHotelForm);

      if (data?.success) {
        setHotel(data.hotel);
        setShowEditHotel(false);
        toast.success("Hotel updated successfully");
      } else {
        toast.error(data?.message || "Failed to update hotel");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setHotelLoading(false);
    }
  };

  const handleImageChange = (key, file) => {
    setImages((prev) => ({
      ...prev,
      [key]: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (!hotel) {
        toast.error("Please register your hotel first");
        return;
      }

      const uploadedImages = Object.values(images).filter(Boolean);

      if (uploadedImages.length === 0) {
        toast.error("Please upload at least one image");
        return;
      }

      const amenitiesArray = Object.keys(inputs.amenities).filter(
        (key) => inputs.amenities[key]
      );

      const formData = new FormData();

      formData.append("roomType", inputs.roomType);
      formData.append("pricePerNight", Number(inputs.pricePerNight));
      formData.append("amenities", JSON.stringify(amenitiesArray));

      uploadedImages.forEach((image) => {
        formData.append("images", image);
      });

      const { data } = await axios.post("/api/rooms", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!data?.success) {
        toast.error(data?.message || "Failed to add room");
        return;
      }

      toast.success("Room added successfully");

      setInputs({
        roomType: "",
        pricePerNight: "",
        amenities: initialAmenities,
      });

      setImages({
        1: null,
        2: null,
        3: null,
        4: null,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Add Room"
        subTitle="Register your hotel, update details, then upload room images."
      />

      {!hotel && (
        <form
          onSubmit={handleRegisterHotel}
          className="bg-white border rounded-2xl p-8 mt-8 shadow-sm mb-10"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Register Hotel
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <p className="mb-2 font-medium">Hotel Name</p>
              <input
                type="text"
                value={hotelForm.name}
                onChange={(e) =>
                  setHotelForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="Eko Hotel"
                className="border p-4 rounded-xl w-full"
                required
              />
            </div>

            <div>
              <p className="mb-2 font-medium">Phone Number</p>
              <input
                type="text"
                value={hotelForm.contact}
                onChange={(e) =>
                  setHotelForm((prev) => ({
                    ...prev,
                    contact: e.target.value,
                  }))
                }
                placeholder="+234..."
                className="border p-4 rounded-xl w-full"
                required
              />
            </div>

            <div>
              <p className="mb-2 font-medium">State / Location</p>
              <select
                value={hotelForm.city}
                onChange={(e) =>
                  setHotelForm((prev) => ({
                    ...prev,
                    city: e.target.value,
                  }))
                }
                className="border p-4 rounded-xl w-full"
                required
              >
                <option value="">Select State</option>
                {cities.map((city) => (
                  <option key={city} value={city.toLowerCase()}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-2 font-medium">Hotel Address</p>
              <input
                type="text"
                value={hotelForm.address}
                onChange={(e) =>
                  setHotelForm((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                placeholder="Hotel address"
                className="border p-4 rounded-xl w-full"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={hotelLoading}
            className="bg-black text-white px-8 py-3 rounded-xl mt-6 disabled:opacity-50"
          >
            {hotelLoading ? "Registering..." : "Register Hotel"}
          </button>
        </form>
      )}

      {hotel && (
        <>
          <div className="bg-white border rounded-2xl p-6 mt-8 shadow-sm mb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <img
                  src={hotel?.images?.[0] || assets.roomImg}
                  alt="hotel"
                  className="w-28 h-28 rounded-xl object-cover border"
                />

                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {hotel.name}
                  </h2>

                  <p className="text-gray-500 mt-2">{hotel.address}</p>
                  <p className="text-gray-500 mt-1">{hotel.contact}</p>

                  <span className="inline-block mt-3 bg-[#eef9ff] text-[#00ADEF] px-4 py-1 rounded-full text-sm font-medium capitalize">
                    {hotel.city}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowEditHotel(!showEditHotel);

                  setEditHotelForm({
                    name: hotel.name || "",
                    address: hotel.address || "",
                    contact: hotel.contact || "",
                    city: hotel.city || "",
                  });
                }}
                className="bg-black text-white px-5 py-3 rounded-xl"
              >
                {showEditHotel ? "Close Form" : "Edit Hotel"}
              </button>
            </div>

            {showEditHotel && (
              <form
                onSubmit={handleUpdateHotel}
                className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8"
              >
                <div>
                  <p className="mb-2 font-medium">Hotel Name</p>

                  <input
                    type="text"
                    value={editHotelForm.name}
                    onChange={(e) =>
                      setEditHotelForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="border p-4 rounded-xl w-full"
                    required
                  />
                </div>

                <div>
                  <p className="mb-2 font-medium">Phone Number</p>

                  <input
                    type="text"
                    value={editHotelForm.contact}
                    onChange={(e) =>
                      setEditHotelForm((prev) => ({
                        ...prev,
                        contact: e.target.value,
                      }))
                    }
                    className="border p-4 rounded-xl w-full"
                    required
                  />
                </div>

                <div>
                  <p className="mb-2 font-medium">State / Location</p>

                  <select
                    value={editHotelForm.city}
                    onChange={(e) =>
                      setEditHotelForm((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                    className="border p-4 rounded-xl w-full"
                    required
                  >
                    <option value="">Select State</option>

                    {cities.map((city) => (
                      <option key={city} value={city.toLowerCase()}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="mb-2 font-medium">Hotel Address</p>

                  <input
                    type="text"
                    value={editHotelForm.address}
                    onChange={(e) =>
                      setEditHotelForm((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    className="border p-4 rounded-xl w-full"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={hotelLoading}
                  className="bg-[#00ADEF] text-white px-6 py-3 rounded-xl w-fit disabled:opacity-50"
                >
                  {hotelLoading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <p className="text-gray-800 mt-6 font-medium text-lg">
              Room Images
            </p>

            <div className="grid grid-cols-2 sm:flex gap-4 my-4 flex-wrap">
              {Object.keys(images).map((key) => (
                <label key={key}>
                  <img
                    className="h-36 w-36 object-cover cursor-pointer rounded-2xl border border-gray-300"
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
                    onChange={(e) => handleImageChange(key, e.target.files[0])}
                  />
                </label>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-6 mt-8">
              <div>
                <p className="mb-2 font-medium">Room Type</p>

                <select
                  value={inputs.roomType}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      roomType: e.target.value,
                    }))
                  }
                  className="border p-4 rounded-xl w-80"
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
                <p className="mb-2 font-medium">Price / Night</p>

                <input
                  type="number"
                  min="1"
                  value={inputs.pricePerNight}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      pricePerNight: e.target.value,
                    }))
                  }
                  className="border p-4 rounded-xl w-80"
                  placeholder="50000"
                  required
                />
              </div>
            </div>

            <p className="mt-10 mb-4 font-medium text-lg">Amenities</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(inputs.amenities).map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center gap-3 bg-white border rounded-xl px-5 py-4"
                >
                  <input
                    type="checkbox"
                    checked={inputs.amenities[amenity]}
                    onChange={() =>
                      setInputs((prev) => ({
                        ...prev,
                        amenities: {
                          ...prev.amenities,
                          [amenity]: !prev.amenities[amenity],
                        },
                      }))
                    }
                  />

                  <span className="text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#00ADEF] hover:bg-[#0094cc] text-white px-10 py-4 mt-10 rounded-xl font-semibold transition disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Add Room"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default AddRoom;